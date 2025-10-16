/**
 * Rate Limiter Configuration
 *
 * Configures rate limiting rules for API endpoints to prevent abuse.
 * Uses the @convex-dev/rate-limiter component.
 */

import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Task operations - token bucket allows bursts with refill
  createTask: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 5, // Allow burst of 5 tasks
  },
  updateTask: {
    kind: "token bucket",
    rate: 50,
    period: MINUTE,
    capacity: 10,
  },
  deleteTask: {
    kind: "token bucket",
    rate: 30,
    period: MINUTE,
    capacity: 5,
  },

  // AI Assistant operations - more conservative limits
  sendMessage: {
    kind: "token bucket",
    rate: 10,
    period: MINUTE,
    capacity: 2, // Allow small burst
  },
  createThread: {
    kind: "token bucket",
    rate: 5,
    period: MINUTE,
    capacity: 2,
  },

  // User preferences - rarely updated
  updatePreferences: {
    kind: "token bucket",
    rate: 10,
    period: MINUTE,
    capacity: 2,
  },
});
