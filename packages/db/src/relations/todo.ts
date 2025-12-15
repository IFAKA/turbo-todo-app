import { relations } from "drizzle-orm";
import { todos } from "../schema/todo";
import { users } from "../schema/auth";

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}));
