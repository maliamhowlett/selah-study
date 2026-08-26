import type { Category } from "./categories";

/** The event shape the site works with, normalised away from Google's schema. */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  /** ISO datetime for timed events, or YYYY-MM-DD for all-day events. */
  start: string;
  /** Same format as `start`. For all-day events this is *inclusive*. */
  end: string;
  allDay: boolean;
  category: Category;
  /** Whether the category was set in Selah Study or guessed from the title. */
  categorySource: "manual" | "detected";
  htmlLink?: string;
}

/** What the event form sends when creating or updating. */
export interface EventInput {
  title: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  allDay: boolean;
  category: Category;
}
