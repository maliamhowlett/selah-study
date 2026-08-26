// Local-time date helpers. Everything the calendar grid does happens in the
// browser's timezone; parsing a Google all-day date ("2026-09-03") with
// `new Date(str)` would treat it as UTC and land on the wrong day west of
// Greenwich, so all-day dates are always split by hand.

import type { CalendarEvent } from "./types";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** YYYY-MM-DD in local time — the key used to bucket events onto grid days. */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Parse either "YYYY-MM-DD" or a full ISO datetime into a local Date. */
export function parseEventDate(value: string): Date {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  }
  return new Date(value);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

/**
 * The six-week block of days a month grid renders — always starts on the Sunday
 * on or before the 1st, so every month is the same height and nothing jumps.
 */
export function monthGridDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const gridStart = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

/** Range to ask Google for, padded to cover the whole visible grid. */
export function monthGridRange(year: number, month: number): { timeMin: string; timeMax: string } {
  const days = monthGridDays(year, month);
  return {
    timeMin: days[0].toISOString(),
    timeMax: addDays(days[days.length - 1], 1).toISOString(),
  };
}

/** Every local day an event touches, so multi-day events show on each square. */
export function eventDayKeys(event: CalendarEvent): string[] {
  const start = startOfDay(parseEventDate(event.start));
  const end = startOfDay(parseEventDate(event.end));
  const keys: string[] = [];
  // Guard against a malformed end before start, and against a runaway range.
  for (let day = start, i = 0; day <= end && i < 400; day = addDays(day, 1), i++) {
    keys.push(dayKey(day));
  }
  return keys.length > 0 ? keys : [dayKey(start)];
}

export function groupEventsByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    for (const key of eventDayKeys(event)) {
      const bucket = map.get(key);
      if (bucket) bucket.push(event);
      else map.set(key, [event]);
    }
  }
  for (const bucket of map.values()) {
    bucket.sort((a, b) => {
      if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
      return parseEventDate(a.start).getTime() - parseEventDate(b.start).getTime();
    });
  }
  return map;
}

export function isSameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b);
}

/** "8:30 AM", or "" for all-day events. */
export function formatTime(event: CalendarEvent): string {
  if (event.allDay) return "";
  return parseEventDate(event.start).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "Thu Sep 3" */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** "today", "tomorrow", "in 5 days", "3 weeks" — the countdown on the list. */
export function countdownLabel(target: Date, from: Date = new Date()): string {
  const days = Math.round(
    (startOfDay(target).getTime() - startOfDay(from).getTime()) / 86_400_000,
  );
  if (days < 0) return days === -1 ? "yesterday" : `${Math.abs(days)} days ago`;
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days < 14) return `in ${days} days`;
  const weeks = Math.round(days / 7);
  if (days < 60) return `in ${weeks} weeks`;
  return `in ${Math.round(days / 30)} months`;
}

/** Splits the upcoming list into the buckets the page renders. */
export function bucketUpcoming(events: CalendarEvent[], now: Date = new Date()) {
  const today = startOfDay(now);
  const endOfWeek = addDays(today, 7 - now.getDay());
  const endOfNextWeek = addDays(endOfWeek, 7);

  const upcoming = events
    .filter((event) => parseEventDate(event.end) >= today)
    .sort((a, b) => parseEventDate(a.start).getTime() - parseEventDate(b.start).getTime());

  return {
    thisWeek: upcoming.filter((e) => parseEventDate(e.start) <= endOfWeek),
    nextWeek: upcoming.filter((e) => {
      const start = parseEventDate(e.start);
      return start > endOfWeek && start <= endOfNextWeek;
    }),
    later: upcoming.filter((e) => parseEventDate(e.start) > endOfNextWeek),
  };
}

/** "2026-09-03T08:30" — the value an <input type="datetime-local"> expects. */
export function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}
