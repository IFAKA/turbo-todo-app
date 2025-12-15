"use client";

import { TodoItem } from "./TodoItem";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoList({ todos, isLoading, onToggle, onDelete }: TodoListProps) {
  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading...</p>;
  }

  if (todos.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No todos yet. Add one above!
      </p>
    );
  }

  return (
    <div className="space-y-2">
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
