/**
 * Endpoint Layer: User Preferences
 *
 * Business logic for user settings and preferences.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as UserPreferences from "../db/userPreferences";

/**
 * Get current user's preferences
 */
export const get = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return null;
    }

    return await UserPreferences.getUserPreferences(ctx, authUser._id);
  },
});

/**
 * Update user preferences
 */
export const update = mutation({
  args: {
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    emailNotifications: v.optional(v.boolean()),
    taskSortOrder: v.optional(
      v.union(v.literal("createdAt"), v.literal("dueDate"), v.literal("priority"))
    ),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "updatePreferences", {
      key: authUser._id,
    });
    if (!rateLimit.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimit.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Get or create preferences
    let preferences = await UserPreferences.getUserPreferences(ctx, authUser._id);

    if (!preferences) {
      // Create default preferences first
      preferences = await UserPreferences.getOrCreateUserPreferences(ctx, authUser._id);
    }

    // 4. Update preferences
    return await UserPreferences.updateUserPreferences(ctx, authUser._id, args);
  },
});

/**
 * Initialize preferences for new user (called on first login)
 */
export const initialize = mutation({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await UserPreferences.getOrCreateUserPreferences(ctx, authUser._id);
  },
});
