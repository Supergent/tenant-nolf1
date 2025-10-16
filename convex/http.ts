import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * HTTP Router
 * Handles HTTP requests for authentication endpoints
 */
const http = httpRouter();

/**
 * Better Auth Routes
 * Handle all authentication requests (login, signup, logout, etc.)
 *
 * Using httpAction() wrapper for proper TypeScript types:
 * - ctx: ActionCtx with runQuery, runMutation, runAction
 * - request: Web API Request object
 * - returns: Promise<Response>
 */
http.route({
  path: "/auth/*",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

http.route({
  path: "/auth/*",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

export default http;
