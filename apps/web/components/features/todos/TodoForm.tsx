"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoSchema, type CreateTodoInput } from "@repo/validators";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

interface TodoFormProps {
  onSubmit: (data: CreateTodoInput) => void;
  isSubmitting?: boolean;
}

export function TodoForm({ onSubmit, isSubmitting }: TodoFormProps) {
  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: "" },
  });

  const handleSubmit = (data: CreateTodoInput) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
      <div className="flex gap-2">
        <Input
          {...form.register("title")}
          placeholder="Add a new todo..."
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting}>
          Add
        </Button>
      </div>
      {form.formState.errors.title && (
        <p className="text-destructive text-sm">
          {form.formState.errors.title.message}
        </p>
      )}
    </form>
  );
}
