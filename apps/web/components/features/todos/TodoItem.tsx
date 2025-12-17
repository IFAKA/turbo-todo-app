"use client";

import { Checkbox } from "@repo/ui/checkbox";
import { Button } from "@repo/ui/button";
import { X } from "lucide-react";

interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (data: { id: number }) => void;
  onDelete: (data: { id: number }) => void;
}

export function TodoItem({ id, title, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group flex items-center gap-3 py-2">
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle({ id })}
      />
      <span className={`flex-1 text-sm ${completed ? "line-through text-muted-foreground" : ""}`}>
        {title}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete({ id })}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
