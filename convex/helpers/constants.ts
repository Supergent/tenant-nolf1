/**
 * Application Constants
 *
 * Centralized constants for the application.
 */

/**
 * Task priorities
 */
export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

/**
 * Task statuses
 */
export const TASK_STATUSES = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

/**
 * Thread statuses
 */
export const THREAD_STATUSES = {
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

/**
 * Message roles
 */
export const MESSAGE_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
} as const;

/**
 * Pagination limits
 */
export const PAGINATION = {
  TASKS_PER_PAGE: 50,
  MESSAGES_PER_PAGE: 100,
  THREADS_PER_PAGE: 20,
} as const;

/**
 * Rate limits (used with Rate Limiter component)
 */
export const RATE_LIMITS = {
  CREATE_TASK: 20, // 20 tasks per minute
  UPDATE_TASK: 50, // 50 updates per minute
  DELETE_TASK: 30, // 30 deletes per minute
  SEND_MESSAGE: 10, // 10 messages per minute (AI assistant)
  CREATE_THREAD: 5, // 5 threads per minute
} as const;

/**
 * Date formatting
 */
export const DATE_FORMATS = {
  FULL: "MMMM d, yyyy 'at' h:mm a",
  SHORT: "MMM d, yyyy",
  TIME: "h:mm a",
} as const;

/**
 * AI Assistant configuration
 */
export const AI_CONFIG = {
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  SYSTEM_PROMPT: `You are a helpful AI assistant for a to-do list application.
Your role is to help users manage their tasks by:
- Suggesting task breakdowns for complex projects
- Providing productivity tips
- Helping prioritize tasks
- Offering encouragement and motivation

Keep responses concise and actionable. Focus on helping users complete their tasks efficiently.`,
} as const;
