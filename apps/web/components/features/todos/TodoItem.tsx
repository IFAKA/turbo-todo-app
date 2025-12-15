"use client";

import { Checkbox } from "@repo/ui/checkbox";
import { Button } from "@repo/ui/button";
import { Trash2 } from "lucide-react";

interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ id, title, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md border bg-card">
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle(id)}
      />
      <span
        className={`flex-1 ${
          completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(id)}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
