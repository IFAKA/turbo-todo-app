import { eq, and } from "drizzle-orm";
import { todos } from "@repo/db";
import { router, protectedProcedure } from "../trpc";
import {
  createTodoSchema,
  toggleTodoSchema,
  deleteTodoSchema,
} from "../validators/todo";

export const todoRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(todos)
      .where(eq(todos.userId, ctx.session.user.id))
      .orderBy(todos.createdAt);
  }),

  create: protectedProcedure
    .input(createTodoSchema)
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(todos)
        .values({
          title: input.title,
          userId: ctx.session.user.id,
        })
        .returning();
      return result;
    }),

  toggle: protectedProcedure
    .input(toggleTodoSchema)
    .mutation(async ({ ctx, input }) => {
      const [todo] = await ctx.db
        .select()
        .from(todos)
        .where(
          and(eq(todos.id, input.id), eq(todos.userId, ctx.session.user.id))
        );
      if (!todo) throw new Error("Todo not found");

      const [result] = await ctx.db
        .update(todos)
        .set({ completed: !todo.completed })
        .where(
          and(eq(todos.id, input.id), eq(todos.userId, ctx.session.user.id))
        )
        .returning();
      return result;
    }),

  delete: protectedProcedure
    .input(deleteTodoSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(todos)
        .where(
          and(eq(todos.id, input.id), eq(todos.userId, ctx.session.user.id))
        );
      return { success: true };
    }),
});
