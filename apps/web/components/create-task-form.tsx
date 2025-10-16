"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button, Input, Card } from "@jn704kmvn1w3p5a4xx8aankht17sksat/components";
import { Plus, Loader2 } from "lucide-react";

export function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | undefined>();
  const [dueDate, setDueDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createTask = useMutation(api.endpoints.tasks.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsLoading(true);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPriority(undefined);
      setDueDate("");
      setIsExpanded(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <Card className="p-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-2 text-left text-text-secondary hover:text-text-primary transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add a new task...</span>
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title */}
        <Input
          placeholder="Task title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
          maxLength={200}
        />

        {/* Description */}
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-muted bg-surface px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
          maxLength={2000}
        />

        {/* Priority & Due Date */}
        <div className="flex flex-wrap gap-2">
          <select
            value={priority || ""}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high" | undefined)
            }
            className="rounded-md border border-muted bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">No priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-md border border-muted bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="submit" disabled={!title.trim() || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setTitle("");
              setDescription("");
              setPriority(undefined);
              setDueDate("");
              setIsExpanded(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
