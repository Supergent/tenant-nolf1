/**
 * Formatting Helpers
 *
 * Pure functions for data formatting and transformation.
 * NO database access, NO ctx parameter.
 */

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

/**
 * Format due date to human-readable string
 */
export function formatDueDate(dueDate: number | undefined): string {
  if (!dueDate) return "No due date";

  const now = Date.now();
  const diff = dueDate - now;

  if (diff < 0) return "Overdue";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days < 7) return `Due in ${days} days`;

  const date = new Date(dueDate);
  return `Due ${date.toLocaleDateString()}`;
}

/**
 * Get priority color class
 */
export function getPriorityColor(
  priority: "low" | "medium" | "high" | undefined
): string {
  if (!priority) return "text-gray-500";

  switch (priority) {
    case "high":
      return "text-danger";
    case "medium":
      return "text-warning";
    case "low":
      return "text-success";
    default:
      return "text-gray-500";
  }
}

/**
 * Get status color class
 */
export function getStatusColor(
  status: "todo" | "in_progress" | "completed"
): string {
  switch (status) {
    case "completed":
      return "text-success";
    case "in_progress":
      return "text-secondary";
    case "todo":
      return "text-text-secondary";
    default:
      return "text-gray-500";
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Format task count
 */
export function formatTaskCount(count: number): string {
  if (count === 0) return "No tasks";
  if (count === 1) return "1 task";
  return `${count} tasks`;
}

/**
 * Sort priority value for sorting
 */
export function getPrioritySortValue(
  priority: "low" | "medium" | "high" | undefined
): number {
  if (!priority) return 0;
  switch (priority) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}
