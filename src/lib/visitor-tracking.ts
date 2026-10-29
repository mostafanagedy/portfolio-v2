import { randomUUID } from "node:crypto";

export const TRACKABLE_EVENTS = [
  "page_view",
  "cv_click",
  "github_click",
  "linkedin_click",
  "project_click",
  "contact_click",
] as const;

export type TrackableEvent = (typeof TRACKABLE_EVENTS)[number];

export function isTrackableEvent(value: unknown): value is TrackableEvent {
  return typeof value === "string" && TRACKABLE_EVENTS.includes(value as TrackableEvent);
}

export function createSessionId() {
  return randomUUID();
}

export function normalizePath(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 300 || !value.startsWith("/")) return null;
  if (value.startsWith("//") || value.includes("\\") || value.includes("\n")) return null;
  return value.split("?")[0].split("#")[0].slice(0, 300);
}

export function normalizeReferrer(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 1000) return null;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.hostname.slice(0, 253);
  } catch {
    return null;
  }
}

export function getDateRetentionExpiry(days = 30) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
