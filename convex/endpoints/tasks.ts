/**
 * Endpoint Layer: Tasks
 *
 * Business logic for task management.
 * Composes database operations from the db layer.
 * Handles authentication and authorization.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Tasks from "../db/tasks";
import {
  isValidTaskTitle,
  isValidTaskDescription,
  sanitizeInput,
} from "../helpers/validation";

/**
 * Create a new task
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "createTask", {
      key: authUser._id,
    });
    if (!rateLimit.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimit.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Validation
    const sanitizedTitle = sanitizeInput(args.title);
    if (!isValidTaskTitle(sanitizedTitle)) {
      throw new Error("Invalid task title. Must be 1-200 characters.");
    }

    if (args.description && !isValidTaskDescription(args.description)) {
      throw new Error("Description too long. Maximum 2000 characters.");
    }

    // 4. Create task
    return await Tasks.createTask(ctx, {
      userId: authUser._id,
      title: sanitizedTitle,
      description: args.description
        ? sanitizeInput(args.description)
        : undefined,
      status: "todo",
      priority: args.priority,
      dueDate: args.dueDate,
    });
  },
});

/**
 * List all tasks for current user
 */
export const list = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    return await Tasks.getTasksByUser(ctx, authUser._id);
  },
});

/**
 * Get tasks by status
 */
export const listByStatus = query({
  args: {
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    return await Tasks.getTasksByUserAndStatus(ctx, authUser._id, args.status);
  },
});

/**
 * Get upcoming tasks (with due dates)
 */
export const upcoming = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    return await Tasks.getUpcomingTasksByUser(ctx, authUser._id);
  },
});

/**
 * Get overdue tasks
 */
export const overdue = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    return await Tasks.getOverdueTasksByUser(ctx, authUser._id);
  },
});

/**
 * Update a task
 */
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("todo"), v.literal("in_progress"), v.literal("completed"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "updateTask", {
      key: authUser._id,
    });
    if (!rateLimit.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimit.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Verify ownership
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to update this task");
    }

    // 4. Validation
    if (args.title) {
      const sanitizedTitle = sanitizeInput(args.title);
      if (!isValidTaskTitle(sanitizedTitle)) {
        throw new Error("Invalid task title. Must be 1-200 characters.");
      }
    }

    if (args.description && !isValidTaskDescription(args.description)) {
      throw new Error("Description too long. Maximum 2000 characters.");
    }

    // 5. Update task
    const { id, ...updateArgs } = args;

    // If marking as completed, set completedAt
    const updateData: any = {
      ...updateArgs,
      title: args.title ? sanitizeInput(args.title) : undefined,
      description: args.description ? sanitizeInput(args.description) : undefined,
    };

    if (args.status === "completed" && task.status !== "completed") {
      updateData.completedAt = Date.now();
    } else if (args.status && args.status !== "completed") {
      updateData.completedAt = undefined;
    }

    return await Tasks.updateTask(ctx, id, updateData);
  },
});

/**
 * Toggle task completion
 */
export const toggleComplete = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "updateTask", {
      key: authUser._id,
    });
    if (!rateLimit.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimit.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Verify ownership
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to update this task");
    }

    // 4. Toggle completion
    if (task.status === "completed") {
      return await Tasks.uncompleteTask(ctx, args.id);
    } else {
      return await Tasks.completeTask(ctx, args.id);
    }
  },
});

/**
 * Delete a task
 */
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "deleteTask", {
      key: authUser._id,
    });
    if (!rateLimit.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimit.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Verify ownership
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to delete this task");
    }

    // 4. Delete task
    return await Tasks.deleteTask(ctx, args.id);
  },
});

/**
 * Get task statistics
 */
export const stats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return {
        todo: 0,
        in_progress: 0,
        completed: 0,
        total: 0,
      };
    }

    const counts = await Tasks.countTasksByStatus(ctx, authUser._id);

    return {
      ...counts,
      total: counts.todo + counts.in_progress + counts.completed,
    };
  },
});
