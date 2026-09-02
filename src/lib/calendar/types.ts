import type { Category } from "./categories";
import type { CourseKey } from "./courses";

/** Weekday codes as the iCalendar RRULE spec writes them. */
export const RRULE_DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const;
export type RRuleDay = (typeof RRULE_DAYS)[number];

/**
 * A weekly repeat, which is all this site needs — class blocks, recitations,
 * SI sessions and club meetings are all "every week on these days until the
 * semester ends".
 */
export interface RepeatRule {
  days: RRuleDay[];
  /**
   * The instant the series stops, as a UTC ISO string. The browser computes it
   * from the chosen last day so the cut-off lands at local midnight rather than
   * whatever timezone the server happens to run in.
   */
  until: string;
}

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
  /** Which class this belongs to — drives the event's colour. */
  course: CourseKey;
  /** Whether the category was set in Selah Study or guessed from the title. */
  categorySource: "manual" | "detected";
  /** Set when this is one occurrence of a repeating series. */
  seriesId?: string;
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
  course: CourseKey;
  /** Only honoured when creating; editing touches a single occurrence. */
  repeat?: RepeatRule;
}
