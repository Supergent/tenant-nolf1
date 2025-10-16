/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 */

/**
 * Validate task title
 */
export function isValidTaskTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 200;
}

/**
 * Validate task description
 */
export function isValidTaskDescription(description: string | undefined): boolean {
  if (!description) return true;
  return description.length <= 2000;
}

/**
 * Validate due date is in the future
 */
export function isValidDueDate(dueDate: number | undefined): boolean {
  if (!dueDate) return true;
  return dueDate > Date.now();
}

/**
 * Validate task status transition
 */
export function isValidStatusTransition(
  currentStatus: "todo" | "in_progress" | "completed",
  newStatus: "todo" | "in_progress" | "completed"
): boolean {
  // All transitions are allowed in a minimal todo app
  // Could add business rules here if needed
  return true;
}

/**
 * Validate thread title
 */
export function isValidThreadTitle(title: string | undefined): boolean {
  if (!title) return true;
  return title.length > 0 && title.length <= 100;
}

/**
 * Validate message content
 */
export function isValidMessageContent(content: string): boolean {
  return content.trim().length > 0 && content.length <= 10000;
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
}
