"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoSchema, type CreateTodoInput } from "@repo/api/schemas";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Checkbox } from "@repo/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Trash2 } from "lucide-react";
import { useTodos } from "../hooks/use-todos";

export function TodoApp() {
  const { todos, isLoading, create, toggle, delete: deleteTodo, isCreating } = useTodos();

  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = (data: CreateTodoInput) => {
    create(data);
    form.reset();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Todo App</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex gap-2">
            <Input
              {...form.register("title")}
              placeholder="Add a new todo..."
              disabled={isCreating}
            />
            <Button type="submit" disabled={isCreating}>
              Add
            </Button>
          </div>
          {form.formState.errors.title && (
            <p className="text-destructive text-sm">
              {form.formState.errors.title.message}
            </p>
          )}
        </form>

        <div className="space-y-2">
          {isLoading && (
            <p className="text-muted-foreground text-sm">Loading...</p>
          )}
          {todos.length === 0 && !isLoading && (
            <p className="text-muted-foreground text-sm">
              No todos yet. Add one above!
            </p>
          )}
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 rounded-md border bg-card"
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggle({ id: todo.id })}
              />
              <span
                className={`flex-1 ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo({ id: todo.id })}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
