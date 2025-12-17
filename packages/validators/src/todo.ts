import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export const toggleTodoSchema = z.object({
  id: z.number(),
});

export type ToggleTodoInput = z.infer<typeof toggleTodoSchema>;

export const deleteTodoSchema = z.object({
  id: z.number(),
});

export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>;
