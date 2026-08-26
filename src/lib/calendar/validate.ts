import { isCategory } from "./categories";
import type { EventInput } from "./types";

/**
 * Validates the body of a create/update request. Returns either a clean
 * EventInput or a message safe to show the user.
 */
export function parseEventInput(body: unknown): { input: EventInput } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Missing event details." };
  }
  const raw = body as Record<string, unknown>;

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return { error: "Give the event a title." };
  if (title.length > 300) return { error: "That title is too long." };

  const allDay = raw.allDay === true;
  const start = typeof raw.start === "string" ? raw.start : "";
  const end = typeof raw.end === "string" && raw.end ? raw.end : start;

  if (!start) return { error: "Pick a start date." };
  if (Number.isNaN(new Date(start).getTime())) return { error: "That start date isn't valid." };
  if (Number.isNaN(new Date(end).getTime())) return { error: "That end date isn't valid." };
  if (new Date(end) < new Date(start)) {
    return { error: "The end has to come after the start." };
  }

  const category = isCategory(raw.category) ? raw.category : "other";
  const description = typeof raw.description === "string" ? raw.description.trim() : "";
  const location = typeof raw.location === "string" ? raw.location.trim() : "";

  return {
    input: {
      title,
      description: description || undefined,
      location: location || undefined,
      start,
      end,
      allDay,
      category,
    },
  };
}
