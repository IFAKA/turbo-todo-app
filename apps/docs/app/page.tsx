import { Card } from "@repo/ui/card";

export default function DocsHome() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Turborepo Starter Template</h1>
          <p className="text-xl text-muted-foreground">
            A production-ready monorepo with Next.js, tRPC, Drizzle ORM, and NextAuth.
          </p>
        </header>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <Card className="p-4 bg-muted/50">
            <pre className="text-sm overflow-x-auto">
              <code>{`# Automated setup (recommended)
npm run setup

# Add GitHub OAuth credentials to .env
# Then start development
npm run dev

# Open the app at http://localhost:3000
# Open docs at http://localhost:3001
# Open slides at http://localhost:3002`}</code>
            </pre>
          </Card>
        </section>

        {/* Tech Stack */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Frontend</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Next.js 16 (App Router)</li>
                <li>React 19</li>
                <li>Tailwind CSS</li>
                <li>Radix UI Components</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Backend</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>tRPC v11 (Type-safe API)</li>
                <li>Drizzle ORM</li>
                <li>NextAuth v5 (Authentication)</li>
                <li>SQLite/Turso Database</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">State & Forms</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>TanStack Query</li>
                <li>React Hook Form</li>
                <li>Optimistic Updates</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Tooling</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Turborepo</li>
                <li>TypeScript 5.9</li>
                <li>ESLint + Prettier</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Project Structure */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Project Structure</h2>
          <Card className="p-4 bg-muted/50">
            <pre className="text-sm overflow-x-auto">
              <code>{`project/
├── apps/
│   ├── web/          # Main application (port 3000)
│   ├── docs/         # Documentation site (port 3001)
│   └── slides/       # Slidev presentation (port 3002)
│
└── packages/
    ├── api/          # tRPC router & procedures
    ├── auth/         # NextAuth configuration
    ├── db/           # Drizzle ORM & schema
    ├── trpc-client/  # Reusable tRPC client utilities
    ├── ui/           # Shared React components
    ├── typescript-config/
    └── eslint-config/`}</code>
            </pre>
          </Card>
        </section>

        {/* Packages */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Packages</h2>
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold">@repo/api</h3>
              <p className="text-sm text-muted-foreground mt-1">
                tRPC router with example todo procedures: <code className="bg-muted px-1 rounded">getAll</code>, <code className="bg-muted px-1 rounded">create</code>, <code className="bg-muted px-1 rounded">toggle</code>, <code className="bg-muted px-1 rounded">delete</code>
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">@repo/auth</h3>
              <p className="text-sm text-muted-foreground mt-1">
                NextAuth v5 config with helpers: <code className="bg-muted px-1 rounded">auth</code>, <code className="bg-muted px-1 rounded">getSession</code>, <code className="bg-muted px-1 rounded">requireAuth</code>, <code className="bg-muted px-1 rounded">requireGuest</code>
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">@repo/db</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Drizzle ORM with SQLite/Turso. Auth tables + example <code className="bg-muted px-1 rounded">todos</code> table with relations.
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">@repo/trpc-client</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Reusable tRPC client utilities with optimistic update helpers.
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">@repo/ui</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Shadcn components: Button, Input, Checkbox, Card, Sonner (toasts)
              </p>
            </Card>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
          <p className="text-muted-foreground mb-4">
            All API calls go through tRPC at <code className="bg-muted px-1 rounded">/api/trpc</code>
          </p>
          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-500/20 text-blue-600 text-xs font-mono px-2 py-0.5 rounded">QUERY</span>
                <code className="font-semibold">todo.getAll</code>
              </div>
              <p className="text-sm text-muted-foreground">Returns all todos sorted by creation date</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-500/20 text-green-600 text-xs font-mono px-2 py-0.5 rounded">MUTATION</span>
                <code className="font-semibold">todo.create</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Creates a new todo. Input: <code className="bg-muted px-1 rounded">{`{ title: string }`}</code>
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-500/20 text-green-600 text-xs font-mono px-2 py-0.5 rounded">MUTATION</span>
                <code className="font-semibold">todo.toggle</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Toggles completed status. Input: <code className="bg-muted px-1 rounded">{`{ id: number }`}</code>
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-500/20 text-green-600 text-xs font-mono px-2 py-0.5 rounded">MUTATION</span>
                <code className="font-semibold">todo.delete</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Deletes a todo. Input: <code className="bg-muted px-1 rounded">{`{ id: number }`}</code>
              </p>
            </Card>
          </div>
        </section>

        {/* Database Schema */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Database Schema</h2>
          <Card className="p-4 bg-muted/50">
            <pre className="text-sm overflow-x-auto">
              <code>{`// packages/db/src/schema/todo.ts
export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" })
    .notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull().$defaultFn(() => new Date()),
  userId: text("userId").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});`}</code>
            </pre>
          </Card>
        </section>

        {/* Commands */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Available Commands</h2>
          <Card className="p-4">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 font-mono">npm run setup</td>
                  <td className="py-2 text-muted-foreground">Automated first-time setup</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">npm run dev</td>
                  <td className="py-2 text-muted-foreground">Start all apps in development mode</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">npm run build</td>
                  <td className="py-2 text-muted-foreground">Build all apps and packages</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">npm run lint</td>
                  <td className="py-2 text-muted-foreground">Run ESLint across the monorepo</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">npm run db:push -w @repo/db</td>
                  <td className="py-2 text-muted-foreground">Push schema changes to database</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">npm run db:studio -w @repo/db</td>
                  <td className="py-2 text-muted-foreground">Open Drizzle Studio (database GUI)</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>Built with Turborepo, Next.js, tRPC, and Drizzle ORM</p>
        </footer>
      </div>
    </div>
  );
}
