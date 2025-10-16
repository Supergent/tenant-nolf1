/**
 * Utility functions for the frontend
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

/**
 * Format due date
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

  return `Due ${new Date(dueDate).toLocaleDateString()}`;
}

/**
 * Get priority badge color
 */
export function getPriorityColor(
  priority: "low" | "medium" | "high" | undefined
): string {
  if (!priority) return "bg-gray-100 text-gray-700";

  switch (priority) {
    case "high":
      return "bg-danger/10 text-danger";
    case "medium":
      return "bg-warning/10 text-warning";
    case "low":
      return "bg-success/10 text-success";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

/**
 * Get status badge color
 */
export function getStatusColor(
  status: "todo" | "in_progress" | "completed"
): string {
  switch (status) {
    case "completed":
      return "bg-success/10 text-success";
    case "in_progress":
      return "bg-secondary/10 text-secondary";
    case "todo":
      return "bg-muted text-text-secondary";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
