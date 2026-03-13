# IdeaForge – Codebase Overview (Detailed)

This document describes every major part of the project: config, app routes, components, and lib modules.

---

## 1. Project root

### `package.json`
- **name**: `idea-forge`
- **Scripts**: `dev` (Next.js + Turbopack), `build`, `start`, `lint`
- **Dependencies**: `next`, `react`, `react-dom`, `next-auth`, `lucide-react`, `clsx`, `tailwind-merge`, `sonner`
- **Dev**: `@tailwindcss/postcss`, `tailwindcss`, `postcss`, `typescript`, `eslint`, `eslint-config-next`, `@types/*`

### `next.config.ts`
- **Images**: `remotePatterns` allow `https` (any host) and `http` (localhost) for `<Image>`.
- No other custom config.

### `tsconfig.json`
- **Paths**: `@/*` → `./src/*`
- **Strict**: enabled. **Module**: ESNext, **Resolution**: bundler.
- Next.js TypeScript plugin enabled.

### `postcss.config.mjs`
- Uses `@tailwindcss/postcss` for Tailwind v4.

### `.gitignore`
- Ignores `node_modules`, `.next`, `out`, `build`, `.env*.local`, `.vercel`, `data/` (local JSON DB), etc.

---

## 2. Source layout (`src/`)

```
src/
├── app/           # Next.js App Router (routes + layouts)
├── components/    # React UI and layout components
├── lib/           # Auth, DB, server actions, utils
├── middleware.ts  # Route protection and auth redirects
```

---

## 3. App Router (`src/app/`)

### 3.1 Root layout – `src/app/layout.tsx`
- **Server component** (async).
- Calls `getCurrentUser()` from `@/lib/auth` to get the logged-in user (or `null`).
- Wraps the app in `AuthProvider` and passes `user` so client components can use `useAuth()`.
- Renders: `Toaster` (top-center toasts), `Navbar`, `main` (children), `Footer`.
- **Metadata**: title, description, keywords for IdeaForge.
- **Dynamic**: `export const dynamic = "force-dynamic"` so layout is not statically cached.

**Important**: No typo on the `getCurrentUser()` line (e.g. no stray `l`); that would cause a crash.

---

### 3.2 Global styles – `src/app/globals.css`
- **Tailwind**: `@import "tailwindcss"` and `@theme { ... }` for design tokens.
- **Theme variables** (in `@theme` and `:root` / `.dark`):
  - **Brand**: `--color-primary`, `--color-primary-dark`, `--color-accent`, etc.
  - **Semantic**: `--color-success`, `--color-warning`, `--color-error`, `--color-info`.
  - **Surfaces**: `--color-surface`, `--color-surface-elevated`, `--color-surface-hover`, `--color-border`, `--color-text`, `--color-text-muted`.
  - **Typography**: `--font-sans`, `--font-display`.
  - **Radius / shadows**: `--radius-*`, `--shadow-glow`, `--shadow-card`, etc.
- **Light mode**: `:root` overrides for light backgrounds and text.
- **Dark mode**: `.dark` overrides for dark backgrounds and text.
- **Base**: `@layer base` for default border color, body background/text, smooth scroll.
- **Scrollbar**: Custom track/thumb using theme variables.
- **Utilities**: `.gradient-text`, `.glass` for gradient text and glass effect.

---

### 3.3 Auth routes (route group `(auth)`)

- **Layout** – `src/app/(auth)/layout.tsx`  
  Wraps auth pages (no shared UI beyond root layout).

- **Login** – `src/app/(auth)/login/page.tsx`
  - **Client component**.
  - Form: `username`, `password` (required).
  - On submit: builds `FormData`, calls server action `login(formData)` from `@/lib/auth`.
  - On success: `login` sets cookies and `redirect("/dashboard")`; no return value.
  - On error: `login` returns `{ error: string }`; page shows it in a red box and keeps user on login.
  - Loading: `isPending` disables inputs and shows spinner in button.
  - Link to `/register`.

- **Register** – `src/app/(auth)/register/page.tsx`
  - **Client component**.
  - Form: username, email, password, profession, location, bio (max 300), skills (comma-separated), LinkedIn, GitHub, profile picture via `ImageUpload` (stores base64 in hidden `avatarUrl`).
  - On submit: `FormData` + hidden `avatarUrl` → server action `register(formData)` from `@/lib/auth`.
  - On success: `register` sets cookies and `redirect("/dashboard")`.
  - On error: `register` returns `{ error }`; page shows it and does not redirect.
  - Uses `ImageUpload` from `@/components/ui/ImageUpload` to capture avatar as base64.

---

### 3.4 Public and protected pages

- **Home** – `src/app/page.tsx`  
  Landing (hero, features, CTAs). Can be server or client; no auth.

- **Ideas list** – `src/app/ideas/page.tsx`
  - **Server component** (async).
  - Calls `getIdeas()` from `@/lib/ideas` and renders list (or empty state with “Post New Idea”).
  - Each idea: title, description, status badge, upvotes, date, author avatar (DiceBear), link to `/ideas/[id]`.
  - CTA at bottom to `/ideas/new`.

- **Idea detail** – `src/app/ideas/[id]/page.tsx`
  - **Client component**.
  - Reads `params.id` (for future API). Currently uses mock idea + comments; can be wired to `getIdea(id)` when available.
  - Renders: idea body, upvote/comment/request-to-join/share buttons, comment list, comment textarea and “Post Comment”.
  - Toasts (e.g. sonner) for upvote, join request, share (copy link), and post comment.

- **Post idea** – `src/app/ideas/new/page.tsx`
  - **Client component**.
  - Form: title, description, status (optional), category/skills/team size (UI only for now).
  - Submit builds `FormData` (title, description, status) and calls server action `submitIdea(formData)` from `@/lib/ideaActions`.
  - `submitIdea` requires auth (cookies), creates idea via `createIdea` in `@/lib/ideas`, then `redirect("/dashboard")`.
  - Toasts for success/error; loading state during submit.

- **Dashboard** – `src/app/dashboard/page.tsx`
  - **Server component** (async).
  - `getCurrentUser()`; if missing, `redirect("/login")`.
  - `getIdeas()` to show ideas (e.g. “My Ideas” section).
  - Renders welcome message (username), stat cards (mock), and list of ideas with links.

- **Messages** – `src/app/messages/page.tsx`  
  Client UI for conversations and send message; toasts on send. No real backend yet.

- **Profile (current user)** – `src/app/profile/me/page.tsx`
  - **Server component** (async).
  - `getCurrentUser()`; if missing, `redirect("/login")`.
  - Renders `<ProfileClient user={user} />`.

- **Profile client** – `src/app/profile/me/ProfileClient.tsx`
  - **Client component**.
  - Displays and edits profile: profession, bio, skills, location, LinkedIn, GitHub, avatar.
  - Edit mode: form submits to server action `editProfile(formData)` from `@/lib/profileActions`; on success toggles back to view mode.
  - Uses `ImageUpload` for avatar in edit mode.

- **Profile by id** – `src/app/profile/[userId]/page.tsx`  
  Client component; currently mock data for any `userId`. Can later fetch user by `userId`.

- **Team** – `src/app/teams/[teamId]/page.tsx`  
  Client component; mock team and members. Can later wire to real API.

---

### 3.5 Admin

- **Layout** – `src/app/admin/layout.tsx`  
  Can enforce admin role (e.g. redirect if not admin); currently may allow all.

- **Admin dashboard** – `src/app/admin/page.tsx`  
  Stats and links to users, ideas, moderation.

- **Users** – `src/app/admin/users/page.tsx`  
  Table of users (data source can be from API or lib).

- **Ideas** – `src/app/admin/ideas/page.tsx`  
  List/table of ideas for moderation.

- **Moderation** – `src/app/admin/moderation/page.tsx`  
  Reported content list and actions (dismiss/remove).

---

## 4. Components (`src/components/`)

### 4.1 Layout

- **Navbar** – `src/components/layout/Navbar.tsx`
  - **Client component**.
  - Uses `useAuth()` from `AuthProvider` to get `user`.
  - If logged in: “Welcome, {username}”, user menu (Dashboard, Post Idea, Messages, My Profile, Admin, Log out). Log out calls `logout()` from `@/lib/auth`.
  - If not: “Log in” and “Get Started” (link to register).
  - Includes `ThemeToggle` for light/dark.
  - Mobile: hamburger and slide-down menu with same links.

- **Footer** – `src/components/layout/Footer.tsx`  
  Links (e.g. Ideas, About, Privacy, Terms) and copyright. No auth.

### 4.2 Providers

- **AuthProvider** – `src/components/providers/AuthProvider.tsx`
  - **Client component**.
  - Receives `user: User | null` from root layout (from `getCurrentUser()`).
  - `createContext` for `{ user }`; `useAuth()` returns that context.
  - No login/register logic here; that’s in auth pages and `@/lib/auth`.

### 4.3 UI primitives

- **Button** – `src/components/ui/Button.tsx`
  - `forwardRef` button with `variant` (primary, secondary, outline, ghost, danger), `size` (sm, md, lg, icon), `isLoading`, optional `leftIcon`/`rightIcon`.
  - Uses `cn()` from `@/lib/utils` for class names; styles use theme variables.

- **Card** – `src/components/ui/Card.tsx`  
  Card container plus `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` subcomponents.

- **Input** – `src/components/ui/Input.tsx`  
  Label, optional error, optional left/right icon; forwards ref and standard input props.

- **Badge** – `src/components/ui/Badge.tsx`  
  Small pill with `variant` (default, primary, secondary, accent, success, warning, error, outline).

- **ImageUpload** – `src/components/ui/ImageUpload.tsx`
  - **Client component**.
  - File input (accepts image); max 2MB; reads as base64 and calls `onImageChange(base64)`.
  - Shows preview or placeholder icon.

### 4.4 Toaster and theme

- **Toaster** – `src/components/Toaster.tsx`  
  Renders `sonner`’s `<Toaster />` with `position="top-center"`, rich colors, close button, duration.

- **ThemeToggle** – `src/components/ThemeToggle.tsx`  
  Toggles light/dark; sets `document.documentElement.classList.toggle("dark")` and `localStorage.theme`.

### 4.5 Ideas (optional / reusable)

- **UpvoteButton**, **SearchBar**, **CategoryFilter** – in `src/components/ideas/`.  
  Reusable for idea list/detail; can be wired to server state or URL params later.

---

## 5. Lib (`src/lib/`)

### 5.1 Utils – `src/lib/utils.ts`
- **cn(...inputs)**  
  Merges class names with `clsx` and `tailwind-merge` (e.g. for conditional Tailwind classes).

### 5.2 Auth – `src/lib/auth.ts`
- **"use server"** so all exports are server actions.
- **login(formData)**  
  Reads `username`, `password`. Loads user with `getUserByUsername(username)` from `@/lib/db`. If missing or password mismatch, returns `{ error: "Invalid username or password" }`. Otherwise sets cookies `session`, `userId`, `username` and calls `redirect("/dashboard")`.
- **register(formData)**  
  Reads username, email, password, profession, bio, skills, location, linkedin, github, avatarUrl. Validates required fields and bio length; checks `getUserByUsername`. Creates user with `createUser` from `@/lib/db`, sets same cookies, `redirect("/dashboard")`. On validation/duplicate error returns `{ error }`.
- **logout()**  
  Deletes `session`, `userId`, `username` cookies and `redirect("/")`.
- **getCurrentUser()**  
  Reads cookies; if `session` and `userId` exist, fetches user with `getUserById(userId)` and returns user without password; otherwise `null`.

### 5.3 Database (users) – `src/lib/db.ts`
- **No "use server"**; used from server only (layout, auth, profile actions).
- **User** interface: id, username, email, password?, profession, bio, skills[], location, linkedin, github, avatarUrl, createdAt.
- **Storage**: JSON file at `data/users.json`; creates `data/` and file if missing (`ensureDb`).
- **getUsers()**, **getUserById(id)**, **getUserByUsername(username)**  
  Read from JSON.
- **createUser(userData)**  
  Appends new user with `crypto.randomUUID()` and `createdAt`; writes back.
- **updateUser(id, updates)**  
  Partial update and write back.

### 5.4 Ideas (storage) – `src/lib/ideas.ts`
- **"use server"** at top (so it can be used from server components / server context).
- **Idea** interface: id, title, description, authorId, authorUsername, upvotes, status, createdAt.
- **Storage**: `data/ideas.json`; `ensureDb` creates `data/` and file if missing.
- **getIdeas()**  
  Returns all ideas (from server).
- **createIdea(ideaData)**  
  Adds idea with id, upvotes: 0, createdAt; prepends to list and writes back.

### 5.5 Idea actions – `src/lib/ideaActions.ts`
- **"use server"**.
- **submitIdea(formData)**  
  Ensures user from cookies; gets title, description, status; calls `createIdea` with `authorId`/`authorUsername` from user; `revalidatePath` for dashboard and ideas; then `redirect("/dashboard")`. Returns `{ error }` if not logged in or validation fails.

### 5.6 Profile actions – `src/lib/profileActions.ts`
- **"use server"**.
- **editProfile(formData)**  
  Ensures user from cookies; updates profession, bio, skills, location, linkedin, github, avatarUrl via `updateUser`; `revalidatePath("/profile/me")`; returns `{ success: true }` or `{ error }`.

---

## 6. Middleware – `src/middleware.ts`
- Runs on every request matched by the config (excluding api, _next/static, _next/image, favicon, sitemap, robots).
- **Protected routes** (prefix): `/dashboard`, `/ideas/new`, `/messages`, `/profile`. If no `session` cookie → redirect to `/login` with `callbackUrl` in query.
- **Auth routes**: `/login`, `/register`. If `session` exists → redirect to `/dashboard`.
- Uses `NextResponse.redirect` and `NextResponse.next()`.

---

## 7. Data flow summary

- **Auth**: Login/register use server actions in `lib/auth.ts`; they set/delete cookies and redirect. Root layout calls `getCurrentUser()` (reads cookies, loads user from `lib/db`). `AuthProvider` passes user to client; Navbar and protected pages use it or redirect.
- **Ideas**: Stored in `data/ideas.json`. Created via `submitIdea` (ideaActions) which uses `createIdea` (ideas). Listed on server in `ideas/page.tsx` and `dashboard/page.tsx` via `getIdeas()`.
- **Profile**: Current user from `getCurrentUser()`. Edits via `editProfile` (profileActions) → `updateUser` (db). Avatar as base64 in register and profile edit (ImageUpload).
- **Toasts**: Sonner Toaster in root layout; pages call `toast.success()` / `toast.error()` for registration, login, post idea, messages, idea detail actions.

---

## 8. Fixes applied to prevent crashes

1. **Root layout**  
   Removed stray character after `getCurrentUser()` (e.g. `l`) so the file is valid and the call runs.

2. **Data directory**  
   In both `lib/db.ts` and `lib/ideas.ts`, `ensureDb()` now runs `fs.mkdir(DATA_DIR, { recursive: true })` before writing the JSON file so `data/` exists on first run.

3. **Ideas list page**  
   Converted from client to **server component** (removed `"use client"`) so it can be `async` and `await getIdeas()` from `lib/ideas` without invalid async-client-component usage.

With these in place, the app should build and run without those crashes. For a quick check: `npm run build` then `npm run start` (or `npm run dev`).
