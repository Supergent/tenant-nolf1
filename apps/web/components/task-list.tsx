"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button, Card, Badge } from "@jn704kmvn1w3p5a4xx8aankht17sksat/components";
import { CheckCircle2, Circle, Trash2, Edit2, Clock } from "lucide-react";
import { cn, formatRelativeTime, formatDueDate, getPriorityColor, getStatusColor } from "../lib/utils";

interface TaskListProps {
  status?: "todo" | "in_progress" | "completed";
  onEditTask?: (taskId: Id<"tasks">) => void;
}

export function TaskList({ status, onEditTask }: TaskListProps) {
  const tasks = status
    ? useQuery(api.endpoints.tasks.listByStatus, { status })
    : useQuery(api.endpoints.tasks.list);

  const toggleComplete = useMutation(api.endpoints.tasks.toggleComplete);
  const deleteTask = useMutation(api.endpoints.tasks.remove);

  if (tasks === undefined) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-text-secondary">
          {status === "completed"
            ? "No completed tasks yet. Start checking off your to-dos!"
            : "No tasks yet. Create your first task to get started!"}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <Card
          key={task._id}
          className={cn(
            "p-4 transition-all hover:shadow-md",
            task.status === "completed" && "opacity-70"
          )}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => toggleComplete({ id: task._id })}
              className="mt-0.5 flex-shrink-0 text-text-secondary transition-colors hover:text-primary"
            >
              {task.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "font-medium",
                  task.status === "completed" && "line-through"
                )}
              >
                {task.title}
              </h3>

              {task.description && (
                <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {task.priority && (
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                )}

                <Badge className={getStatusColor(task.status)}>
                  {task.status.replace("_", " ")}
                </Badge>

                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Clock className="h-3 w-3" />
                    <span>{formatDueDate(task.dueDate)}</span>
                  </div>
                )}

                <span className="text-xs text-text-secondary">
                  {formatRelativeTime(task.createdAt)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {onEditTask && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditTask(task._id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask({ id: task._id })}
                className="h-8 w-8 p-0 text-danger hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
