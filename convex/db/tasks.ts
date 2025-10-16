/**
 * Database Layer: Tasks
 *
 * This is the ONLY file that directly accesses the tasks table using ctx.db.
 * All task-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// CREATE
export async function createTask(
  ctx: MutationCtx,
  args: {
    userId: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "completed";
    priority?: "low" | "medium" | "high";
    dueDate?: number;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("tasks", {
    ...args,
    createdAt: now,
    updatedAt: now,
  });
}

// READ - Get by ID
export async function getTaskById(ctx: QueryCtx, id: Id<"tasks">) {
  return await ctx.db.get(id);
}

// READ - Get all tasks by user
export async function getTasksByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

// READ - Get tasks by user and status
export async function getTasksByUserAndStatus(
  ctx: QueryCtx,
  userId: string,
  status: "todo" | "in_progress" | "completed"
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", status)
    )
    .order("desc")
    .collect();
}

// READ - Get upcoming tasks by due date
export async function getUpcomingTasksByUser(ctx: QueryCtx, userId: string) {
  const now = Date.now();
  return await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => q.and(
      q.neq(q.field("status"), "completed"),
      q.gte(q.field("dueDate"), now)
    ))
    .order("asc")
    .collect();
}

// READ - Get overdue tasks
export async function getOverdueTasksByUser(ctx: QueryCtx, userId: string) {
  const now = Date.now();
  return await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => q.and(
      q.neq(q.field("status"), "completed"),
      q.lt(q.field("dueDate"), now)
    ))
    .collect();
}

// UPDATE
export async function updateTask(
  ctx: MutationCtx,
  id: Id<"tasks">,
  args: {
    title?: string;
    description?: string;
    status?: "todo" | "in_progress" | "completed";
    priority?: "low" | "medium" | "high";
    dueDate?: number;
    completedAt?: number;
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

// UPDATE - Mark as completed
export async function completeTask(ctx: MutationCtx, id: Id<"tasks">) {
  const now = Date.now();
  return await ctx.db.patch(id, {
    status: "completed",
    completedAt: now,
    updatedAt: now,
  });
}

// UPDATE - Mark as incomplete
export async function uncompleteTask(ctx: MutationCtx, id: Id<"tasks">) {
  return await ctx.db.patch(id, {
    status: "todo",
    completedAt: undefined,
    updatedAt: Date.now(),
  });
}

// DELETE
export async function deleteTask(ctx: MutationCtx, id: Id<"tasks">) {
  return await ctx.db.delete(id);
}

// STATS - Count tasks by status
export async function countTasksByStatus(
  ctx: QueryCtx,
  userId: string
): Promise<{ todo: number; in_progress: number; completed: number }> {
  const allTasks = await getTasksByUser(ctx, userId);

  return {
    todo: allTasks.filter((t) => t.status === "todo").length,
    in_progress: allTasks.filter((t) => t.status === "in_progress").length,
    completed: allTasks.filter((t) => t.status === "completed").length,
  };
}