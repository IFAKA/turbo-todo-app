import { eq } from "drizzle-orm";
import { todos } from "@repo/db";
import { router, publicProcedure } from "../trpc";
import {
  createTodoSchema,
  toggleTodoSchema,
  deleteTodoSchema,
} from "../schemas/todo";

export const todoRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(todos).orderBy(todos.createdAt);
  }),

  create: publicProcedure
    .input(createTodoSchema)
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(todos)
        .values({ title: input.title })
        .returning();
      return result;
    }),

  toggle: publicProcedure
    .input(toggleTodoSchema)
    .mutation(async ({ ctx, input }) => {
      const [todo] = await ctx.db
        .select()
        .from(todos)
        .where(eq(todos.id, input.id));
      if (!todo) throw new Error("Todo not found");

      const [result] = await ctx.db
        .update(todos)
        .set({ completed: !todo.completed })
        .where(eq(todos.id, input.id))
        .returning();
      return result;
    }),

  delete: publicProcedure
    .input(deleteTodoSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(todos).where(eq(todos.id, input.id));
      return { success: true };
    }),
});
