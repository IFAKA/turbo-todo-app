# Todo App - Web

The main Next.js application for the Todo App template.

## Directory Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── (protected)/        # Auth-required routes
│   │   ├── dashboard/      # Main dashboard
│   │   └── layout.tsx      # Auth check wrapper
│   ├── (public)/           # Public routes
│   │   ├── login/          # Login page
│   │   └── page.tsx        # Landing page
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth handlers
│   │   └── trpc/           # tRPC handlers
│   ├── fonts/              # Custom fonts
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/
│   ├── features/           # Feature-specific components
│   │   └── todos/          # Todo feature
│   │       ├── TodoApp.tsx
│   │       ├── TodoForm.tsx
│   │       ├── TodoItem.tsx
│   │       ├── TodoList.tsx
│   │       └── index.ts
│   └── layout/             # Layout components
│       ├── UserNav.tsx
│       └── index.ts
├── hooks/                  # Custom React hooks
│   └── use-todos.ts        # Todo operations hook
├── lib/                    # Utilities & constants
│   └── constants.ts        # App-wide constants
├── types/                  # TypeScript declarations
│   └── next-auth.d.ts      # NextAuth type augmentation
└── public/                 # Static assets
```

## Architecture

### Route Groups

- `(protected)/` - Routes requiring authentication. The layout calls `requireAuth()`.
- `(public)/` - Public routes accessible to everyone.

### Component Organization

- `components/features/` - Feature-specific components organized by domain
- `components/layout/` - Shared layout components (header, nav, footer)

### Hooks

Custom hooks encapsulate data fetching and mutations:

```tsx
import { useTodos } from "@/hooks/use-todos";

function MyComponent() {
  const { todos, isLoading, create, toggle, delete: deleteTodo } = useTodos();
}
```

### Constants

Centralized constants prevent magic strings:

```tsx
import { APP_NAME, ROUTES } from "@/lib/constants";

// Use ROUTES.DASHBOARD instead of "/dashboard"
```

## Development

```bash
# From monorepo root
npm run dev

# Or just this app
npm run dev -w apps/web
```

Runs on http://localhost:3000

## Adding Features

### 1. Create feature folder

```bash
mkdir -p components/features/your-feature
```

### 2. Create components

```
components/features/your-feature/
├── YourFeature.tsx      # Main component
├── YourFeatureItem.tsx  # Item component
├── YourFeatureForm.tsx  # Form component
└── index.ts             # Exports
```

### 3. Create hook (optional)

```tsx
// hooks/use-your-feature.ts
export function useYourFeature() {
  const cache = createListCache(trpc.useUtils().yourFeature.getAll);
  // ... mutations with optimistic updates
}
```

### 4. Add route

```
app/(protected)/your-feature/
└── page.tsx
```
