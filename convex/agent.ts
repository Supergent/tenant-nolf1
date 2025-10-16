/**
 * AI Agent Configuration
 *
 * Configures the AI assistant for task management help.
 * Uses the @convex-dev/agent component with OpenAI.
 */

import { Agent } from "@convex-dev/agent";
import { components } from "./_generated/api";
import { openai } from "@ai-sdk/openai";
import { AI_CONFIG } from "./helpers/constants";

/**
 * Task Assistant Agent
 *
 * Helps users with:
 * - Breaking down complex tasks
 * - Prioritizing work
 * - Productivity tips
 * - Motivation and encouragement
 */
export const taskAssistant = new Agent(components.agent, {
  name: "Task Assistant",
  description: "AI assistant for task management and productivity",
  languageModel: openai.chat("gpt-4o-mini"),
  instructions: AI_CONFIG.SYSTEM_PROMPT,
  temperature: AI_CONFIG.TEMPERATURE,
  maxTokens: AI_CONFIG.MAX_TOKENS,
});
