import { trpc } from "@repo/api/client";
import { createListCache } from "@repo/trpc-client/optimistic";
import { toast } from "@repo/ui/sonner";

export function useTodos() {
  const cache = createListCache(trpc.useUtils().todo.getAll);
  const todosQuery = trpc.todo.getAll.useQuery();

  const createTodo = trpc.todo.create.useMutation(
    cache.withOptimistic(({ add }) => ({
      // userId is placeholder - server will use actual userId from session
      action: (input) => add({ ...input, completed: false, createdAt: new Date().toISOString(), userId: "" }),
      onError: (err) => toast.error("Failed to create todo", { description: err.message }),
    }))
  );

  const toggleTodo = trpc.todo.toggle.useMutation(
    cache.withOptimistic(({ get, update }) => ({
      action: ({ id }) => {
        const todo = get().find((t) => t.id === id);
        if (todo) update(id, { completed: !todo.completed });
      },
      onError: (err) => toast.error("Failed to update todo", { description: err.message }),
    }))
  );

  const deleteTodo = trpc.todo.delete.useMutation(
    cache.withOptimistic(({ remove }) => ({
      action: ({ id }) => remove(id),
      onError: (err) => toast.error("Failed to delete todo", { description: err.message }),
    }))
  );

  return {
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    create: createTodo.mutate,
    toggle: toggleTodo.mutate,
    delete: deleteTodo.mutate,
    isCreating: createTodo.isPending,
  };
}
