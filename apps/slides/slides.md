---
theme: seriph
background: https://cover.sli.dev
title: Turborepo Starter Template
info: |
  ## Turborepo Starter Template
  A production-ready monorepo with Next.js, tRPC, Drizzle, and NextAuth.
class: text-center
transition: slide-left
mdc: true
---

# Turborepo Starter Template

A production-ready monorepo for full-stack TypeScript apps

<div class="pt-12">
  <span class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space to continue <carbon:arrow-right class="inline"/>
  </span>
</div>

---
transition: fade-out
---

# The Stack

<div class="grid grid-cols-2 gap-8 pt-4">

<div>

### Frontend
- **Next.js 16** - App Router, React 19
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Accessible components

</div>

<div>

### Backend
- **tRPC v11** - End-to-end type safety
- **Drizzle ORM** - Type-safe database queries
- **NextAuth v5** - Authentication

</div>

</div>

<div class="pt-8">

### Infrastructure
- **Turborepo** - High-performance monorepo build system
- **SQLite/Turso** - Local dev + serverless production

</div>

---

# Project Structure

```
apps/
├── web/              → Main Next.js application (port 3000)
├── docs/             → Documentation site (port 3001)
└── slides/           → This presentation (port 3002)

packages/
├── api/              → tRPC routers, procedures, validators
├── auth/             → NextAuth configuration
├── db/               → Drizzle schema, relations, migrations
├── trpc-client/      → Reusable tRPC client utilities
├── ui/               → Shadcn components + Tailwind
├── eslint-config/    → Shared ESLint configuration
└── typescript-config/→ Shared TypeScript configuration
```

---

# Web App Architecture

Clean architecture with feature-based organization:

```
apps/web/
├── app/
│   ├── (protected)/        # Auth-required routes
│   │   └── dashboard/
│   └── (public)/           # Public routes
│       └── login/
├── components/
│   ├── features/           # Feature-based components
│   │   └── todos/
│   │       ├── TodoApp.tsx
│   │       ├── TodoForm.tsx
│   │       ├── TodoItem.tsx
│   │       └── TodoList.tsx
│   └── layout/             # Shared layout components
│       └── UserNav.tsx
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & constants
└── types/                  # TypeScript declarations
```

---
layout: two-cols
layoutClass: gap-8
---

# Architecture Patterns

### Route Groups
```
app/
├── (protected)/    # requireAuth()
└── (public)/       # No auth needed
```

### Feature Components
```
components/features/todos/
├── TodoApp.tsx     # Container
├── TodoForm.tsx    # Form logic
├── TodoItem.tsx    # Single item
├── TodoList.tsx    # List rendering
└── index.ts        # Barrel export
```

::right::

### Centralized Constants

```ts
// lib/constants.ts
export const APP_NAME = "Todo App";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
} as const;
```

### Usage

```tsx
import { ROUTES } from "@/lib/constants";

// No magic strings!
<Link href={ROUTES.DASHBOARD}>
  Dashboard
</Link>
```

---
layout: two-cols
layoutClass: gap-8
---

# Package: @repo/db

Database schema with Drizzle ORM:

```ts
// packages/db/src/schema/todo.ts
import { sqliteTable, text, integer }
  from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({
    autoIncrement: true
  }),
  title: text("title").notNull(),
  completed: integer("completed", {
    mode: "boolean"
  }).default(false),
  userId: text("user_id").notNull(),
});
```

::right::

# Type Inference

Drizzle auto-generates types:

```ts
// Auto-generated from schema
type Todo = typeof todos.$inferSelect;
// { id: number; title: string;
//   completed: boolean; userId: string }

type NewTodo = typeof todos.$inferInsert;
// { title: string; userId: string;
//   id?: number; completed?: boolean }
```

<div class="pt-4">

**Benefits:**
- Single source of truth
- No manual type definitions
- Schema changes = type changes

</div>

---

# Package: @repo/api

tRPC routers with full type safety from database to frontend.

```ts
// packages/api/src/routers/todo.ts
export const todoRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.todos.findMany({
      where: eq(todos.userId, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(createTodoSchema)  // Zod validation
    .mutation(async ({ ctx, input }) => {
      const [todo] = await ctx.db
        .insert(todos)
        .values({ ...input, userId: ctx.session.user.id })
        .returning();
      return todo;
    }),
});
```

---

# Package: @repo/auth

NextAuth v5 configuration with GitHub OAuth.

```ts
// packages/auth/src/index.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
});
```

<div class="pt-4">

**Usage in app:**
```ts
import { auth, requireAuth } from "@repo/auth";

// In server component or API route
const session = await auth();
// Or require auth (throws if not authenticated)
const session = await requireAuth();
```

</div>

---
layout: two-cols
layoutClass: gap-8
---

# Custom Hooks

Encapsulate data fetching with optimistic updates:

```ts
// hooks/use-todos.ts
export function useTodos() {
  const cache = createListCache(
    trpc.useUtils().todo.getAll
  );

  const createTodo = trpc.todo.create
    .useMutation(
      cache.withOptimistic(({ add }) => ({
        action: (input) => add({
          ...input,
          id: -Date.now(),
          completed: false,
        }),
        onError: (err) =>
          toast.error(err.message),
      }))
    );

  return { todos, create, toggle, delete };
}
```

::right::

# Component Usage

Clean separation of concerns:

```tsx
// components/features/todos/TodoApp.tsx
"use client";

import { useTodos } from "@/hooks/use-todos";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";

export function TodoApp() {
  const {
    todos, isLoading,
    create, toggle, delete: deleteTodo
  } = useTodos();

  return (
    <Card>
      <TodoForm onSubmit={create} />
      <TodoList
        todos={todos}
        onToggle={toggle}
        onDelete={deleteTodo}
      />
    </Card>
  );
}
```

---

# Quick Start

<div class="grid grid-cols-2 gap-8">

<div>

### 1. Clone & Install

```bash
git clone <repo>
cd todo-app
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

</div>

<div>

### 3. Push Database Schema

```bash
npm run db:push -w @repo/db
```

### 4. Start Development

```bash
npm run dev
```

Visit http://localhost:3000

</div>

</div>

---

# Adding a New Feature

<div class="grid grid-cols-2 gap-8 text-sm">

<div>

### 1. Database Schema
```ts
// packages/db/src/schema/notes.ts
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
});
```

### 2. tRPC Router
```ts
// packages/api/src/routers/note.ts
export const noteRouter = router({
  getAll: protectedProcedure.query(...),
  create: protectedProcedure.mutation(...),
});
```

</div>

<div>

### 3. Feature Components
```
components/features/notes/
├── NoteApp.tsx
├── NoteForm.tsx
├── NoteItem.tsx
└── index.ts
```

### 4. Custom Hook
```ts
// hooks/use-notes.ts
export function useNotes() { ... }
```

### 5. Route
```
app/(protected)/notes/page.tsx
```

</div>

</div>

---
layout: center
class: text-center
---

# Start Building

<div class="text-2xl pt-4 pb-8">
  Clone the template and build your next project
</div>

```bash
npm run dev
```

<div class="pt-8 text-gray-400">

**Ports:**
- `3000` - Web app
- `3001` - Docs
- `3002` - Slides (this presentation)

</div>
