"use client";

import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: { id: number; title: string; completed: boolean }[];
  isLoading?: boolean;
  onToggle: (data: { id: number }) => void;
  onDelete: (data: { id: number }) => void;
}

export function TodoList({ todos, isLoading, onToggle, onDelete }: TodoListProps) {
  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground text-sm py-8">
        Loading...
      </p>
    );
  }

  if (todos.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm py-8">
        No todos yet
      </p>
    );
  }

  return (
    <div className="divide-y">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          {...todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
