"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { useTodos } from "@/hooks/use-todos";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";

export function TodoApp() {
  const { todos, isLoading, create, toggle, delete: deleteTodo, isCreating } = useTodos();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Todo App</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TodoForm onSubmit={create} isSubmitting={isCreating} />
        <TodoList
          todos={todos}
          isLoading={isLoading}
          onToggle={(id) => toggle({ id })}
          onDelete={(id) => deleteTodo({ id })}
        />
      </CardContent>
    </Card>
  );
}
