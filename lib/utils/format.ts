/**
 * Extracted from components/portal/StudentPortal.jsx, where these
 * were originally defined inline. Pulled out so they're unit-testable
 * without rendering a component, and so AdminPortal.jsx (which needed
 * its own date formatting) can share the same logic instead of
 * re-implementing it slightly differently.
 */

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return " - ";
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;
  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${time}`;
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function formatDueDate(iso: string | null | undefined): string {
  if (!iso) return "No due date";
  const diffDays = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  return `Due in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
}

/** Short date used in the admin leads table ("Aug 7"), distinct from
 * formatDateTime's fuller "Today, 7:00 PM" style used in the student portal. */
export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return " - ";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
