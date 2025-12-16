import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const toggleTodoSchema = z.object({
  id: z.number(),
});

export const deleteTodoSchema = z.object({
  id: z.number(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
