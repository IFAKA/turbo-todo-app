import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import * as relations from "./relations";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...schema, ...relations }
});

export * from "./schema";
export * from "./relations";
export type { Todo, NewTodo } from "./schema/todo";
export type { User, NewUser } from "./schema/auth";
