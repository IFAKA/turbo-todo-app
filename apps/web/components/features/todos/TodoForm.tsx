"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoSchema, type CreateTodoInput } from "@repo/validators";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Plus } from "lucide-react";

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
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2">
      <Input
        {...form.register("title")}
        placeholder="What needs to be done?"
        disabled={isSubmitting}
      />
      <Button type="submit" size="icon" disabled={isSubmitting || !form.watch("title").trim()}>
        <Plus className="size-4" />
      </Button>
    </form>
  );
}
