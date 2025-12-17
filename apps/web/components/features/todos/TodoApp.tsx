"use client";

import { Card, CardContent } from "@repo/ui/card";
import { useTodos } from "@/hooks/use-todos";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";

export function TodoApp() {
  const { todos, isLoading, create, toggle, delete: deleteTodo, isCreating } = useTodos();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="space-y-4">
        <TodoForm onSubmit={create} isSubmitting={isCreating} />
        <TodoList
          todos={todos}
          isLoading={isLoading}
          onToggle={toggle}
          onDelete={deleteTodo}
        />
      </CardContent>
    </Card>
  );
}
