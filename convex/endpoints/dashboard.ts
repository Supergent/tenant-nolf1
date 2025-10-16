import { v } from "convex/values";
import { query } from "../_generated/server";
import { authComponent } from "../auth";
import * as Dashboard from "../db/dashboard";
import * as Tasks from "../db/tasks";
import * as Threads from "../db/threads";

export const summary = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Use _id from Better Auth return value (Convex document ID)
    return Dashboard.loadSummary(ctx, authUser._id);
  },
});

export const recent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Use _id from Better Auth return value (Convex document ID)
    return Dashboard.loadRecent(ctx, authUser._id, args.limit ?? 5);
  },
});

/**
 * Task statistics for dashboard
 */
export const taskStats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return {
        todo: 0,
        in_progress: 0,
        completed: 0,
        total: 0,
        overdue: 0,
      };
    }

    const taskCounts = await Tasks.countTasksByStatus(ctx, authUser._id);
    const overdueTasks = await Tasks.getOverdueTasksByUser(ctx, authUser._id);

    return {
      ...taskCounts,
      total: taskCounts.todo + taskCounts.in_progress + taskCounts.completed,
      overdue: overdueTasks.length,
    };
  },
});

/**
 * Thread statistics for dashboard
 */
export const threadStats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return {
        active: 0,
        archived: 0,
        total: 0,
      };
    }

    const activeThreads = await Threads.getActiveThreadsByUser(ctx, authUser._id);
    const allThreads = await Threads.getThreadsByUser(ctx, authUser._id);

    return {
      active: activeThreads.length,
      archived: allThreads.length - activeThreads.length,
      total: allThreads.length,
    };
  },
});
