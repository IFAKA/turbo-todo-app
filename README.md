# Turborepo Starter Template

A production-ready monorepo template with Next.js, tRPC, Drizzle ORM, and NextAuth.

## Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **API**: tRPC v11 with React Query
- **Database**: Drizzle ORM + SQLite/Turso
- **Auth**: NextAuth v5 (GitHub OAuth)
- **UI**: Tailwind CSS + Shadcn components
- **Monorepo**: Turborepo with npm workspaces

## Project Structure

```
apps/
├── web/              → Main Next.js application (port 3000)
├── docs/             → Documentation site (port 3001)
└── slides/           → Slidev presentation (port 3002)

packages/
├── api/              → tRPC routers, procedures, validators
├── auth/             → NextAuth configuration and helpers
├── db/               → Drizzle schema, relations, migrations
├── trpc-client/      → Reusable tRPC client utilities
├── ui/               → Shadcn components + Tailwind config
├── eslint-config/    → Shared ESLint configuration
└── typescript-config/→ Shared TypeScript configuration
```

## Web App Architecture

The web app follows clean architecture principles with feature-based organization:

```
apps/web/
├── app/                    # Next.js App Router
│   ├── (protected)/        # Auth-required routes
│   └── (public)/           # Public routes
├── components/
│   ├── features/           # Feature-specific components
│   │   └── todos/          # Example: Todo feature
│   │       ├── TodoApp.tsx
│   │       ├── TodoForm.tsx
│   │       ├── TodoItem.tsx
│   │       └── TodoList.tsx
│   └── layout/             # Shared layout components
│       └── UserNav.tsx
├── hooks/                  # Custom React hooks
│   └── use-todos.ts        # Data fetching + mutations
├── lib/                    # Utilities & constants
│   └── constants.ts        # App-wide constants
└── types/                  # TypeScript declarations
```

### Key Patterns

- **Route Groups**: `(protected)` and `(public)` for auth separation
- **Feature Components**: Organized by domain in `components/features/`
- **Custom Hooks**: Encapsulate tRPC queries and mutations with optimistic updates
- **Centralized Constants**: No magic strings, all routes and config in `lib/constants.ts`

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```bash
# Database - use absolute path for local SQLite
DATABASE_URL="file:/Users/yourname/path/to/project/packages/db/sqlite.db"

# Auth - generate with: openssl rand -base64 32
AUTH_SECRET="your-secret-here"

# GitHub OAuth - create at https://github.com/settings/developers
# Callback URL: http://localhost:3000/api/auth/callback/github
AUTH_GITHUB_ID="your-client-id"
AUTH_GITHUB_SECRET="your-client-secret"
```

### 3. Push database schema

```bash
npm run db:push -w @repo/db
```

### 4. Start development

```bash
npm run dev
```

| Port | App |
|------|-----|
| 3000 | Web app |
| 3001 | Documentation |
| 3002 | Slides |

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps and packages |
| `npm run lint` | Lint all packages |
| `npm run check-types` | Type-check all packages |
| `npm run db:push -w @repo/db` | Push schema to database |
| `npm run db:studio -w @repo/db` | Open Drizzle Studio |
| `npm run dev -w slides` | Open slides presentation |

## Using as a Template

### Creating a new app

1. Copy this repo
2. Update `package.json` name fields
3. Configure `.env`
4. Push database schema
5. Start building

### Adding a new feature

1. Create feature folder: `components/features/your-feature/`
2. Create components: `YourFeature.tsx`, `YourFeatureForm.tsx`, `YourFeatureItem.tsx`
3. Create barrel export: `index.ts`
4. Create hook (optional): `hooks/use-your-feature.ts`
5. Add route: `app/(protected)/your-feature/page.tsx`

### Adding a new package

```bash
mkdir packages/your-package
cd packages/your-package
npm init -y
```

Update the package.json:
```json
{
  "name": "@repo/your-package",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

### Adding a new tRPC router

1. Create validator in `packages/api/src/validators/`
2. Create router in `packages/api/src/routers/`
3. Add to root router in `packages/api/src/root.ts`

### Adding a new database table

1. Create schema in `packages/db/src/schema/`
2. Export from `packages/db/src/schema/index.ts`
3. Add relations in `packages/db/src/relations/`
4. Run `npm run db:push -w @repo/db`

## Package Exports

### @repo/db

```typescript
import { db, todos, users } from "@repo/db";
import { Todo, NewTodo } from "@repo/db/schema";
```

### @repo/api

```typescript
import { appRouter, type AppRouter } from "@repo/api";
import { TRPCProvider } from "@repo/api/client";
import { createContext } from "@repo/api/context";
```

### @repo/auth

```typescript
import { auth, getSession, requireAuth, requireGuest } from "@repo/auth";
```

### @repo/trpc-client

```typescript
import { createTRPCReactClient } from "@repo/trpc-client/react";
import { createListCache } from "@repo/trpc-client/optimistic";
```

### @repo/ui

```typescript
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
```

## Production Deployment

### Database (Turso)

1. Create a Turso database at https://turso.tech
2. Update `DATABASE_URL` to your Turso URL with auth token

### Vercel

1. Connect your repo to Vercel
2. Set root directory to `apps/web`
3. Add environment variables
4. Deploy

## License

MIT
