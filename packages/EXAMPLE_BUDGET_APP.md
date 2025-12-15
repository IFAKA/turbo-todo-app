# Example: Building a Budget App

A beginner-friendly guide to building a budget app using this monorepo structure.

## What You're Building

A budget app where:
- Users can create **accounts** (checking, savings, credit card, cash)
- Each account can have **transactions** (income or expenses)
- Account balances update automatically

## Understanding the Stack

### What is Drizzle?
Drizzle is a **database toolkit**. It lets you:
- Define your database tables using TypeScript (instead of raw SQL)
- Query your database with type-safe code
- Handle relationships between tables (e.g., "an account has many transactions")

### What is tRPC?
tRPC lets you build **type-safe APIs**. It means:
- Your frontend knows exactly what data the backend returns
- You get autocomplete and error checking
- No need to write separate API types - they're shared automatically

### What is Zod?
Zod is for **input validation**. It ensures:
- Users can't send invalid data (e.g., empty names, negative amounts)
- You get helpful error messages
- Types are inferred automatically

---

## Project Structure

```
packages/
├── trpc-client/   # Reusable utilities (DON'T TOUCH)
├── db/            # Database tables & relationships
└── api/           # API endpoints & validation

apps/
└── web/           # Your Next.js frontend
```

---

## Step 1: Define Database Tables

Tables are like spreadsheets - they store your data in rows and columns.

### Create `packages/db/src/schema/account.ts`

```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// This creates a table called "accounts" in your database
export const accounts = sqliteTable("accounts", {
  // id: Auto-incrementing unique identifier (1, 2, 3...)
  id: integer("id").primaryKey({ autoIncrement: true }),

  // name: The account name (e.g., "My Checking Account")
  name: text("name").notNull(), // notNull = required field

  // type: Limited to specific values only
  type: text("type", {
    enum: ["checking", "savings", "credit", "cash"]
  }).notNull(),

  // balance: Decimal number, starts at 0
  balance: real("balance").notNull().default(0),

  // createdAt: Automatically set when record is created
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// These types are auto-generated from the table definition
// Use them in your code for type safety
export type Account = typeof accounts.$inferSelect;    // For reading
export type NewAccount = typeof accounts.$inferInsert; // For creating
```

### Create `packages/db/src/schema/transaction.ts`

```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { accounts } from "./account";

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // accountId: Links this transaction to an account
  // "references" creates a foreign key relationship
  // "onDelete: cascade" means: if account is deleted, delete its transactions too
  accountId: integer("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),

  description: text("description").notNull(),

  // amount: Always positive (we use "type" to determine if it's income/expense)
  amount: real("amount").notNull(),

  type: text("type", { enum: ["income", "expense"] }).notNull(),

  // category: Optional field (can be null)
  category: text("category"),

  date: integer("date", { mode: "timestamp" }).notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
```

### Update `packages/db/src/schema/index.ts`

```typescript
// This file exports everything so other packages can import from "@repo/db"
export * from "./account";
export * from "./transaction";
```

---

## Step 2: Define Relationships

Relationships tell Drizzle how tables connect to each other.
This enables powerful queries like "get all accounts WITH their transactions".

### Create `packages/db/src/relations/account.ts`

```typescript
import { relations } from "drizzle-orm";
import { accounts } from "../schema/account";
import { transactions } from "../schema/transaction";

// "One account has MANY transactions"
export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));
```

### Create `packages/db/src/relations/transaction.ts`

```typescript
import { relations } from "drizzle-orm";
import { transactions } from "../schema/transaction";
import { accounts } from "../schema/account";

// "One transaction belongs to ONE account"
export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],  // The field in transactions table
    references: [accounts.id],          // That points to accounts table
  }),
}));
```

### Update `packages/db/src/relations/index.ts`

```typescript
export * from "./account";
export * from "./transaction";
```

---

## Step 3: Create Input Validators

Validators check that data from users is valid BEFORE it hits your database.

### Create `packages/api/src/validators/account.ts`

```typescript
import { z } from "zod";

// Schema for creating a new account
export const createAccountSchema = z.object({
  name: z.string()
    .min(1, "Name is required")           // At least 1 character
    .max(50, "Name too long"),            // At most 50 characters
  type: z.enum(["checking", "savings", "credit", "cash"]),
  balance: z.number().default(0),         // Optional, defaults to 0
});

// Schema for deleting an account
export const deleteAccountSchema = z.object({
  id: z.number(),
});

// TypeScript types - use these in your components
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
```

### Create `packages/api/src/validators/transaction.ts`

```typescript
import { z } from "zod";

export const createTransactionSchema = z.object({
  accountId: z.number(),
  description: z.string()
    .min(1, "Description is required")
    .max(200, "Description too long"),
  amount: z.number()
    .positive("Amount must be positive"),  // No negative numbers
  type: z.enum(["income", "expense"]),
  category: z.string().optional(),          // Optional field
  date: z.coerce.date(),                    // Converts string to Date
});

export const getByAccountSchema = z.object({
  accountId: z.number(),
});

export const deleteTransactionSchema = z.object({
  id: z.number(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
```

### Update `packages/api/src/validators/index.ts`

```typescript
export * from "./account";
export * from "./transaction";
```

---

## Step 4: Create API Routers

Routers define your API endpoints - what actions users can perform.

### Create `packages/api/src/routers/account.ts`

```typescript
import { eq } from "drizzle-orm";
import { accounts } from "@repo/db";
import { router, publicProcedure } from "../trpc";
import { createAccountSchema, deleteAccountSchema } from "../validators/account";

export const accountRouter = router({
  // GET all accounts (with their transactions included)
  getAll: publicProcedure.query(async ({ ctx }) => {
    // ctx.db is your database connection (set up in context.ts)
    return await ctx.db.query.accounts.findMany({
      with: { transactions: true },  // Include related transactions
    });
  }),

  // CREATE a new account
  create: publicProcedure
    .input(createAccountSchema)  // Validate input first
    .mutation(async ({ ctx, input }) => {
      // Insert into database and return the created record
      const [result] = await ctx.db
        .insert(accounts)
        .values(input)
        .returning();  // Returns the created row
      return result;
    }),

  // DELETE an account
  delete: publicProcedure
    .input(deleteAccountSchema)
    .mutation(async ({ ctx, input }) => {
      // eq() means "where id equals input.id"
      await ctx.db.delete(accounts).where(eq(accounts.id, input.id));
      return { success: true };
    }),
});
```

### Create `packages/api/src/routers/transaction.ts`

```typescript
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { transactions, accounts } from "@repo/db";
import { router, publicProcedure } from "../trpc";
import {
  createTransactionSchema,
  getByAccountSchema,
  deleteTransactionSchema
} from "../validators/transaction";

export const transactionRouter = router({
  // GET transactions for a specific account
  getByAccount: publicProcedure
    .input(getByAccountSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(transactions)
        .where(eq(transactions.accountId, input.accountId));
    }),

  // CREATE a transaction and update account balance
  create: publicProcedure
    .input(createTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      // 1. Create the transaction
      const [tx] = await ctx.db
        .insert(transactions)
        .values(input)
        .returning();

      // 2. Update the account balance
      // Income adds money, expense subtracts money
      const balanceChange = input.type === "income"
        ? input.amount
        : -input.amount;

      await ctx.db
        .update(accounts)
        .set({
          // sql`` is Drizzle's way to do atomic operations
          // This is SAFE (parameterized, no SQL injection risk)
          // It updates in one query: "UPDATE accounts SET balance = balance + $1"
          balance: sql`balance + ${balanceChange}`
        })
        .where(eq(accounts.id, input.accountId));

      // ⚠️ Alternative WITHOUT sql`` (not recommended for balances):
      // const [account] = await ctx.db.select().from(accounts).where(eq(accounts.id, input.accountId));
      // await ctx.db.update(accounts).set({ balance: account.balance + balanceChange }).where(...);
      // This requires 2 queries and has race condition risk if 2 users transact simultaneously

      return tx;
    }),

  // DELETE a transaction
  delete: publicProcedure
    .input(deleteTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(transactions)
        .where(eq(transactions.id, input.id));
      return { success: true };
    }),
});
```

### Update `packages/api/src/routers/index.ts`

```typescript
export { accountRouter } from "./account";
export { transactionRouter } from "./transaction";
```

### Update `packages/api/src/root.ts`

```typescript
import { router } from "./trpc";
import { accountRouter, transactionRouter } from "./routers";

// Combine all routers into one
export const appRouter = router({
  account: accountRouter,
  transaction: transactionRouter,
});

// This type is used by the frontend for type safety
export type AppRouter = typeof appRouter;
```

---

## Step 5: Set Up the Web App

Only **2 files** need changes in your web app!

### `apps/web/app/api/trpc/[trpc]/route.ts`

```typescript
// This single line creates your entire API!
export { GET, POST } from "@repo/api/handler";
```

### `apps/web/app/layout.tsx`

```typescript
import { TRPCProvider } from "@repo/api/client";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Wrap your app with the provider */}
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
```

---

## Step 6: Use in Components

Now you can use your API with full type safety!

### Example: Account List Component

```typescript
"use client";

import { trpc } from "@repo/api/client";

export function AccountList() {
  // Fetch all accounts - this is a "query" (read operation)
  const { data: accounts, isLoading } = trpc.account.getAll.useQuery();

  // Create account - this is a "mutation" (write operation)
  const createAccount = trpc.account.create.useMutation({
    onSuccess: () => {
      // Refetch the list after creating
      trpc.useUtils().account.getAll.invalidate();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Accounts</h1>

      {/* List accounts */}
      {accounts?.map((account) => (
        <div key={account.id}>
          <h2>{account.name}</h2>
          <p>Type: {account.type}</p>
          <p>Balance: ${account.balance.toFixed(2)}</p>
          <p>Transactions: {account.transactions.length}</p>
        </div>
      ))}

      {/* Create account button */}
      <button
        onClick={() => createAccount.mutate({
          name: "New Account",
          type: "checking",
        })}
      >
        Add Account
      </button>
    </div>
  );
}
```

### Example: With Optimistic Updates

Optimistic updates make your app feel instant by updating the UI before the server responds.

```typescript
"use client";

import { trpc } from "@repo/api/client";
import { createListCache } from "@repo/trpc-client/optimistic";

export function AccountList() {
  // Set up optimistic cache helper
  const cache = createListCache(trpc.useUtils().account.getAll);

  const { data: accounts } = trpc.account.getAll.useQuery();

  const createAccount = trpc.account.create.useMutation(
    cache.withOptimistic(({ add }) => ({
      // This runs IMMEDIATELY (before server responds)
      action: (input) => add({
        ...input,
        id: -Date.now(),           // Temporary ID
        balance: input.balance ?? 0,
        createdAt: new Date(),
        transactions: [],
      }),
      // This runs if the server request fails
      onError: (err) => {
        alert("Failed to create account: " + err.message);
      },
    }))
  );

  // ... rest of component
}
```

---

## Quick Reference

### Database Operations

```typescript
// INSERT
await ctx.db.insert(accounts).values({ name: "Test" }).returning();

// SELECT all
await ctx.db.select().from(accounts);

// SELECT with condition
await ctx.db.select().from(accounts).where(eq(accounts.id, 1));

// SELECT with relations
await ctx.db.query.accounts.findMany({ with: { transactions: true } });

// UPDATE
await ctx.db.update(accounts).set({ name: "New Name" }).where(eq(accounts.id, 1));

// DELETE
await ctx.db.delete(accounts).where(eq(accounts.id, 1));
```

### Frontend Hooks

```typescript
// Read data (auto-refetches)
const { data, isLoading, error } = trpc.account.getAll.useQuery();

// Write data
const mutation = trpc.account.create.useMutation();
mutation.mutate({ name: "Test", type: "checking" });

// Invalidate cache (trigger refetch)
trpc.useUtils().account.getAll.invalidate();
```

---

## Summary

| Step | Package | What to do |
|------|---------|-----------|
| 1 | `@repo/db/schema/` | Define your tables |
| 2 | `@repo/db/relations/` | Define relationships |
| 3 | `@repo/api/validators/` | Create input validation |
| 4 | `@repo/api/routers/` | Create API endpoints |
| 5 | `apps/web` | Add 2 lines (route + provider) |
| 6 | Components | Use `trpc.X.Y.useQuery()` / `.useMutation()` |

**Remember**: `@repo/trpc-client` is 100% reusable - you never need to modify it!
