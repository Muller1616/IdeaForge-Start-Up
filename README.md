# IdeaForge - Startup Idea Collaboration Platform

A modern web application for entrepreneurs, developers, and designers to share startup ideas, find co-founders, and build innovative startups together.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, TypeScript
- **Backend** (planned): Node.js, Express.js
- **Database** (planned): MongoDB
- **Auth** (planned): NextAuth.js v5

## Features

### Implemented (Frontend)

- **User Authentication UI**: Login and registration pages with modern design
- **Ideas System**: Browse, filter, search, and view startup ideas with upvote and comment UI
- **User Dashboard**: Overview of user activity, ideas, and teams
- **Profile Pages**: User profiles with skills, bio, LinkedIn/GitHub links
- **Post Idea**: Form to submit new startup ideas
- **Messaging UI**: Direct message interface
- **Team Pages**: Team overview with members and progress updates
- **Admin Panel**: User management, idea moderation, content moderation
- **Theme Toggle**: Light/dark mode support
- **Responsive Design**: Mobile-first, works on all devices

### Planned (Backend)

- User authentication with NextAuth.js
- MongoDB models and API routes
- Real-time messaging
- Upvote and comment persistence
- Team building workflow

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth routes (login, register)
│   ├── admin/              # Admin panel
│   ├── dashboard/           # User dashboard
│   ├── ideas/              # Ideas listing, detail, new
│   ├── messages/           # Messaging
│   ├── profile/            # User profiles
│   └── teams/              # Team pages
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── ui/                 # Button, Card, Input, Badge
│   ├── ideas/              # UpvoteButton, SearchBar, CategoryFilter
│   └── ThemeToggle.tsx
└── lib/
    └── utils.ts            # cn() utility
```

## Design System

- **Colors**: Primary (indigo), Accent (cyan), semantic colors for success/warning/error
- **Typography**: Geist font family
- **Components**: Consistent Button, Card, Input, Badge variants
- **Theme**: Light/dark mode via CSS variables

## License

MIT
