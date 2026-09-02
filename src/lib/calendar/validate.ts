import { isCategory } from "./categories";
import { isCourse } from "./courses";
import { RRULE_DAYS } from "./types";
import type { EventInput, RRuleDay, RepeatRule } from "./types";

/** Reads the optional weekly-repeat block. A malformed rule is dropped rather
 * than rejected, so a bad repeat never blocks saving the event itself. */
function parseRepeat(raw: unknown): RepeatRule | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const rule = raw as Record<string, unknown>;

  const days = Array.isArray(rule.days)
    ? rule.days.filter((d): d is RRuleDay =>
        RRULE_DAYS.includes(d as RRuleDay),
      )
    : [];
  if (days.length === 0) return undefined;

  const until = typeof rule.until === "string" ? rule.until : "";
  if (!until || Number.isNaN(new Date(until).getTime())) return undefined;

  return { days: [...new Set(days)], until };
}

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
  const course = isCourse(raw.course) ? raw.course : "none";
  const repeat = parseRepeat(raw.repeat);
  if (repeat && new Date(repeat.until) < new Date(start)) {
    return { error: "The repeat has to end after the first date." };
  }
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
      course,
      repeat,
    },
  };
}
