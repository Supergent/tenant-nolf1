/**
 * Database Layer: User Preferences
 *
 * This is the ONLY file that directly accesses the userPreferences table using ctx.db.
 * All user preferences-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// CREATE OR GET
export async function getOrCreateUserPreferences(
  ctx: MutationCtx,
  userId: string
) {
  const existing = await ctx.db
    .query("userPreferences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();

  if (existing) {
    return existing;
  }

  const now = Date.now();
  const id = await ctx.db.insert("userPreferences", {
    userId,
    theme: "system",
    emailNotifications: true,
    taskSortOrder: "createdAt",
    createdAt: now,
    updatedAt: now,
  });

  return await ctx.db.get(id);
}

// READ - Get by user ID
export async function getUserPreferences(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("userPreferences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
}

// UPDATE
export async function updateUserPreferences(
  ctx: MutationCtx,
  userId: string,
  args: {
    theme?: "light" | "dark" | "system";
    emailNotifications?: boolean;
    taskSortOrder?: "createdAt" | "dueDate" | "priority";
  }
) {
  const existing = await ctx.db
    .query("userPreferences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();

  if (!existing) {
    throw new Error("User preferences not found");
  }

  return await ctx.db.patch(existing._id, {
    ...args,
    updatedAt: Date.now(),
  });
}

// DELETE
export async function deleteUserPreferences(
  ctx: MutationCtx,
  id: Id<"userPreferences">
) {
  return await ctx.db.delete(id);
}
