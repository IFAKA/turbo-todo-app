import { eq, and } from "drizzle-orm";
import { todos } from "@repo/db";
import { createTodoSchema, toggleTodoSchema, deleteTodoSchema } from "@repo/validators";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

export const todoRouter = router({
  getAll: protectedProcedure.query(({ ctx: { db, user } }) =>
    db.select().from(todos).where(eq(todos.userId, user.id)).orderBy(todos.createdAt)
  ),

  create: protectedProcedure.input(createTodoSchema).mutation(({ ctx: { db, user }, input }) =>
    db.insert(todos).values({ title: input.title, userId: user.id })
  ),

  toggle: protectedProcedure.input(toggleTodoSchema).mutation(async ({ ctx: { db, user }, input }) => {
    const [todo] = await db.select().from(todos).where(and(eq(todos.id, input.id), eq(todos.userId, user.id)));
    if (!todo) throw new TRPCError({ code: "NOT_FOUND" });
    await db.update(todos).set({ completed: !todo.completed }).where(eq(todos.id, input.id));
  }),

  delete: protectedProcedure.input(deleteTodoSchema).mutation(({ ctx: { db, user }, input }) =>
    db.delete(todos).where(and(eq(todos.id, input.id), eq(todos.userId, user.id)))
  ),
});
