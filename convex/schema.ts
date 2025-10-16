import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for Minimal To-Do List Application
 *
 * Architecture: Four-layer Convex pattern
 * - User-scoped with proper indexing
 * - Real-time reactive queries
 * - TypeScript type safety throughout
 */

export default defineSchema({
  /**
   * Tasks Table
   * Core entity for to-do items with real-time updates
   */
  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      )
    ),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_user_and_due_date", ["userId", "dueDate"]),

  /**
   * AI Assistant Threads (Agent Component)
   * Tracks conversations with AI assistant for task suggestions
   */
  threads: defineTable({
    userId: v.string(),
    title: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("archived")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),

  /**
   * AI Assistant Messages (Agent Component)
   * Message history for AI conversations
   */
  messages: defineTable({
    threadId: v.id("threads"),
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_user", ["userId"]),

  /**
   * User Preferences
   * Store user-specific settings and preferences
   */
  userPreferences: defineTable({
    userId: v.string(),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    emailNotifications: v.optional(v.boolean()),
    taskSortOrder: v.optional(v.union(v.literal("createdAt"), v.literal("dueDate"), v.literal("priority"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
