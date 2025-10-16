/**
 * Endpoint Layer: AI Assistant
 *
 * Business logic for AI-powered task assistance.
 * Manages threads and messages for AI conversations.
 */

import { v } from "convex/values";
import { mutation, query, action } from "../_generated/server";
import { internal } from "../_generated/api";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Threads from "../db/threads";
import * as Messages from "../db/messages";
import { isValidThreadTitle, isValidMessageContent } from "../helpers/validation";

/**
 * Create a new conversation thread
 */
export const createThread = mutation({
  args: {
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "createThread", {
      key: authUser._id,
    });
    if (!rateLimit.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimit.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Validation
    if (args.title && !isValidThreadTitle(args.title)) {
      throw new Error("Thread title too long. Maximum 100 characters.");
    }

    // 4. Create thread
    return await Threads.createThread(ctx, {
      userId: authUser._id,
      title: args.title || "New Conversation",
      status: "active",
    });
  },
});

/**
 * List all threads for current user
 */
export const listThreads = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("archived"))),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    if (args.status) {
      return await Threads.getThreadsByUserAndStatus(ctx, authUser._id, args.status);
    }

    return await Threads.getThreadsByUser(ctx, authUser._id);
  },
});

/**
 * Get a specific thread with its messages
 */
export const getThread = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get thread
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Verify ownership
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to view this thread");
    }

    // Get messages
    const messages = await Messages.getMessagesByThread(ctx, args.threadId);

    return {
      thread,
      messages,
    };
  },
});

/**
 * Archive a thread
 */
export const archiveThread = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to archive this thread");
    }

    return await Threads.archiveThread(ctx, args.threadId);
  },
});

/**
 * Delete a thread and all its messages
 */
export const deleteThread = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to delete this thread");
    }

    // Delete all messages first
    await Messages.deleteMessagesByThread(ctx, args.threadId);

    // Delete thread
    return await Threads.deleteThread(ctx, args.threadId);
  },
});

/**
 * Send a message to the AI assistant
 */
export const sendMessage = action({
  args: {
    threadId: v.id("threads"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Get auth user via query
    const authUser = await ctx.runQuery(internal.endpoints.assistant.getAuthUser);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting via mutation
    await ctx.runMutation(internal.endpoints.assistant.checkRateLimit, {
      userId: authUser._id,
    });

    // 3. Validation
    if (!isValidMessageContent(args.content)) {
      throw new Error("Message content invalid. Must be 1-10000 characters.");
    }

    // 4. Verify thread ownership
    const thread = await ctx.runQuery(internal.endpoints.assistant.verifyThreadOwnership, {
      threadId: args.threadId,
      userId: authUser._id,
    });

    if (!thread) {
      throw new Error("Thread not found or not authorized");
    }

    // 5. Save user message
    await ctx.runMutation(internal.endpoints.assistant.saveMessage, {
      threadId: args.threadId,
      userId: authUser._id,
      role: "user",
      content: args.content,
    });

    // 6. Get AI response (using OpenAI API)
    const aiResponse = await ctx.runAction(internal.endpoints.assistant.getAIResponse, {
      threadId: args.threadId,
      userMessage: args.content,
    });

    // 7. Save assistant message
    await ctx.runMutation(internal.endpoints.assistant.saveMessage, {
      threadId: args.threadId,
      userId: authUser._id,
      role: "assistant",
      content: aiResponse,
    });

    return {
      userMessage: args.content,
      assistantMessage: aiResponse,
    };
  },
});

/**
 * Internal: Get authenticated user
 */
export const getAuthUser = query({
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx);
  },
});

/**
 * Internal: Check rate limit for messaging
 */
export const checkRateLimit = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const rateLimit = await rateLimiter.limit(ctx, "sendMessage", {
      key: args.userId,
    });

    if (!rateLimit.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimit.retryAfter / 1000)} seconds.`
      );
    }
  },
});

/**
 * Internal: Verify thread ownership
 */
export const verifyThreadOwnership = query({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread || thread.userId !== args.userId) {
      return null;
    }
    return thread;
  },
});

/**
 * Internal: Save message
 */
export const saveMessage = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await Messages.createMessage(ctx, args);
  },
});

/**
 * Internal: Get AI response using OpenAI
 */
export const getAIResponse = action({
  args: {
    threadId: v.id("threads"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    // Get conversation history
    const messages = await ctx.runQuery(internal.endpoints.assistant.getThreadMessages, {
      threadId: args.threadId,
    });

    // Format messages for OpenAI
    const conversationHistory = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call OpenAI API
    try {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        throw new Error("OPENAI_API_KEY not configured");
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a helpful AI assistant for a to-do list application.
Your role is to help users manage their tasks by:
- Suggesting task breakdowns for complex projects
- Providing productivity tips
- Helping prioritize tasks
- Offering encouragement and motivation

Keep responses concise and actionable. Focus on helping users complete their tasks efficiently.`,
            },
            ...conversationHistory,
            {
              role: "user",
              content: args.userMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
    }
  },
});

/**
 * Internal: Get thread messages
 */
export const getThreadMessages = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    return await Messages.getMessagesByThread(ctx, args.threadId);
  },
});
