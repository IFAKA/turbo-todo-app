import { trpc } from "@repo/api/react";
import { toast } from "@repo/ui/sonner";

export function useTodos() {
  const utils = trpc.useUtils();
  const todosQuery = trpc.todo.getAll.useQuery();

  const invalidateTodos = () => utils.todo.getAll.invalidate();

  const createTodo = trpc.todo.create.useMutation({
    onSuccess: invalidateTodos,
    onError: (err) => toast.error("Failed to create todo", { description: err.message }),
  });

  const toggleTodo = trpc.todo.toggle.useMutation({
    onSuccess: invalidateTodos,
    onError: (err) => toast.error("Failed to update todo", { description: err.message }),
  });

  const deleteTodo = trpc.todo.delete.useMutation({
    onSuccess: invalidateTodos,
    onError: (err) => toast.error("Failed to delete todo", { description: err.message }),
  });

  return {
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    create: createTodo.mutate,
    toggle: toggleTodo.mutate,
    delete: deleteTodo.mutate,
    isCreating: createTodo.isPending,
  };
}
