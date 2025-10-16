import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import agent from "@convex-dev/agent/convex.config";

const app = defineApp();

// Better Auth MUST be first
app.use(betterAuth);

// Rate limiting for API protection
app.use(rateLimiter);

// AI agent for intelligent task suggestions and assistance
app.use(agent);

export default app;
