# Deploying IdeaForge

## Build and run

- **Build**: `npm run build`
- **Run**: `npm run start`
- **Lint** (optional): `npm run lint`

The app is a standard Next.js 15 app. Use `NODE_ENV=production` when running in production (Next.js sets this automatically when you run `next start`).

---

## Important: where you can deploy

### File-based storage

IdeaForge stores all data in JSON files under the **`data/`** directory (users, ideas, comments, messages, join requests, password-reset tokens, contact form messages). The app uses Node.js `fs` to read and write these files.

- **Serverless (Vercel, Netlify, etc.)**: The filesystem is **read-only** (or ephemeral). Any write (registration, new idea, comment, message, contact form, etc.) will **fail** at runtime. Do **not** deploy this version to serverless if you need persistent data.
- **Node server (VPS, Docker, Railway, Render, Fly.io, etc.)**: As long as the process has a **writable** directory and `process.cwd()` or the path to `data/` is writable, the app will work. Ensure the `data/` folder exists (the app creates it on first write if it can).

For a production-ready setup on serverless, you would need to replace the file-based storage with a database (e.g. PostgreSQL, SQLite, or a hosted DB) and keep the same APIs in `src/lib/`.

---

## Pre-deploy checklist

1. **Build**: Run `npm run build`. Fix any type or compile errors (e.g. the contact page `result.error` type was fixed so the build passes).
2. **No hardcoded secrets**: The app only uses `NODE_ENV` for cookie security; no API keys are required for the current file-based setup.
3. **Crash hardening**: Dashboard and ideas list now catch data-load errors and show empty/default data instead of crashing. Idea detail page already used try/catch and null checks.
4. **Middleware**: Protects `/dashboard`, `/ideas/new`, `/messages`, `/profile` (redirects to login if no session). Auth routes redirect to home when already logged in.

---

## After deploy

- Create an account via **Register** to get a first user.
- Ensure the server has write access to the `data/` directory (or that you have migrated to a real DB).
