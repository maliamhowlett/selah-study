// Turns the free-text key dates transcribed from syllabi ("Wed Sep 17,
// 8:00–9:00 PM") into concrete calendar events. Syllabus text is messy, so
// every proposal carries whatever doubt the parser has rather than hiding it.

import { detectCategory } from "./categories";
import type { Category } from "./categories";
import { detectCourse } from "./courses";
import type { CourseKey } from "./courses";
import type { RRuleDay } from "./types";
import type { KeyDate, MeetingTime } from "@/lib/classes";

export interface DateProposal {
  /** Stable key so the UI can track selection across re-renders. */
  key: string;
  courseCode: string;
  label: string;
  /** The original string from the syllabus, always shown so it can be checked. */
  raw: string;
  title: string;
  category: Category;
  /** Which class the event belongs to — drives its colour. */
  course: CourseKey;
  /** Present for weekly blocks such as SI sessions. `untilDay` is inclusive. */
  repeat?: { days: RRuleDay[]; untilDay: string };
  location?: string;
  description?: string;
  /** YYYY-MM-DD, or null when no date could be read out of `raw`. */
  day: string | null;
  /** "20:00" / "21:00", or null for an all-day date. */
  startTime: string | null;
  endTime: string | null;
  /** Set when the parse is suspect — shown as a warning on the row. */
  warning?: string;
  /**
   * When the stated weekday disagrees with the date, the nearest date that
   * *does* fall on the stated weekday. Offered as a one-click alternative;
   * never applied automatically, because either half can be the wrong one.
   */
  suggestedDay?: string;
  /** The weekday the syllabus claimed, e.g. "Wed". */
  statedWeekday?: string;
  /** Reassurance rather than doubt — shown quietly, not as a warning. */
  note?: string;
}

const DAY_LETTERS: Record<string, number> = {
  u: 0, m: 1, t: 2, w: 3, r: 4, f: 5, s: 6,
};

/**
 * Turns a meeting-days string into weekday numbers. Handles both spelled-out
 * forms ("Thu (lecture)", "Tues/Thurs") and the letter codes universities use,
 * where T is Tuesday and R is Thursday ("MWF", "T/R").
 */
export function parseMeetingDays(days: string): number[] {
  const named = days.toLowerCase().match(/\b(sun|mon|tues?|wed(?:nes)?|thur?s?|fri|sat)/g);
  if (named) {
    return [...new Set(named.map((name) => WEEKDAY_INDEX[name]).filter((d) => d !== undefined))];
  }
  const letters = days.replace(/[^A-Za-z]/g, "").toLowerCase().split("");
  return [...new Set(letters.map((c) => DAY_LETTERS[c]).filter((d) => d !== undefined))];
}

export function meetingDaysFor(meetingTimes?: MeetingTime[]): number[] {
  if (!meetingTimes) return [];
  return [...new Set(meetingTimes.flatMap((m) => parseMeetingDays(m.days ?? "")))];
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
};

const WEEKDAY_INDEX: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, tues: 2, wed: 3, wednes: 3,
  thu: 4, thur: 4, thurs: 4, fri: 5, sat: 6,
};

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Syllabus dates carry no year. A date in Aug–Dec belongs to the academic year
 * that started this calendar year; Jan–Jul belongs to the following one.
 */
function inferYear(month: number, today: Date): number {
  const startYear = today.getMonth() + 1 >= 7 ? today.getFullYear() : today.getFullYear() - 1;
  return month >= 7 ? startYear : startYear + 1;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** "8:00–9:00 PM" or "10:30 AM-12:00 PM" -> 24h start/end. */
function parseTimeRange(raw: string): { start: string; end: string } | null {
  const match = raw.match(
    /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*[–—-]\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i,
  );
  if (!match) return null;

  const endMeridiem = match[6].toUpperCase();
  // "8:00–9:00 PM" states the meridiem once, at the end — carry it back.
  const startMeridiem = (match[3] ?? endMeridiem).toUpperCase();

  const to24 = (hour: string, meridiem: string) => {
    let h = Number(hour) % 12;
    if (meridiem === "PM") h += 12;
    return h;
  };

  return {
    start: `${pad(to24(match[1], startMeridiem))}:${match[2] ?? "00"}`,
    end: `${pad(to24(match[4], endMeridiem))}:${match[5] ?? "00"}`,
  };
}

/** Room codes like "WTHR 200" belong in location; prose belongs in notes. */
function splitDetail(detail?: string): { location?: string; description?: string } {
  if (!detail) return {};
  const trimmed = detail.trim();
  if (/^[A-Z]{2,5}\s?\d{1,4}[A-Z]?$/.test(trimmed)) return { location: trimmed };
  return { description: trimmed };
}

export function proposalFromKeyDate(
  keyDate: KeyDate,
  courseCode: string,
  index: number,
  today: Date = new Date(),
  meetingDays: number[] = [],
): DateProposal {
  const raw = keyDate.date ?? "";
  const { location, description } = splitDetail(keyDate.detail);

  const base: DateProposal = {
    key: `${courseCode}-${index}`,
    courseCode,
    label: keyDate.label,
    raw,
    title: `${courseCode} — ${keyDate.label}`,
    category: detectCategory(keyDate.label, keyDate.detail),
    course: detectCourse(courseCode, keyDate.label),
    location,
    description,
    day: null,
    startTime: null,
    endTime: null,
  };

  const dateMatch = raw.match(/([A-Za-z]{3,9})\.?\s+(\d{1,2})\b/);
  // First three letters identify every month, including "Sept" and "September".
  const month = dateMatch ? MONTHS[dateMatch[1].slice(0, 3).toLowerCase()] : undefined;

  if (!dateMatch || !month) {
    return {
      ...base,
      warning: raw.trim()
        ? `No date could be read from "${raw.trim()}" — set one to import it.`
        : "This entry has no date.",
    };
  }

  const dayOfMonth = Number(dateMatch[2]);
  const year = inferYear(month, today);
  const date = new Date(year, month - 1, dayOfMonth);

  // Reject impossible dates (e.g. "Feb 30" rolling into March).
  if (date.getMonth() !== month - 1) {
    return { ...base, warning: `"${raw.trim()}" isn't a real date.` };
  }

  const time = parseTimeRange(raw);
  const proposal: DateProposal = {
    ...base,
    day: `${year}-${pad(month)}-${pad(dayOfMonth)}`,
    startTime: time?.start ?? null,
    endTime: time?.end ?? null,
  };

  // The most common transcription error: a weekday copied from a previous
  // year's schedule. Surface it rather than silently trusting either half.
  const statedMatch = raw.match(/^\s*(Sun|Mon|Tues?|Wed(?:nes)?|Thur?s?|Fri|Sat)/i);
  if (statedMatch) {
    const stated = WEEKDAY_INDEX[statedMatch[1].toLowerCase()];
    const actual = date.getDay();
    if (stated !== undefined && stated !== actual) {
      // Shift to the nearest day carrying the stated weekday — within ±3 days,
      // so a schedule copied from last year's calendar lines up again.
      let delta = stated - actual;
      if (delta > 3) delta -= 7;
      if (delta < -3) delta += 7;
      const shifted = new Date(year, month - 1, dayOfMonth + delta);

      proposal.statedWeekday = statedMatch[1];

      // If the date already falls on a day this class actually meets, the date
      // is almost certainly right and the weekday label is the stale half — so
      // say so quietly instead of raising an alarm, and offer no shift.
      if (meetingDays.includes(actual)) {
        proposal.note =
          `Your notes say ${statedMatch[1]}, but this is a ${WEEKDAY_NAMES[actual]} — one of ` +
          `your ${courseCode} class days, so the date looks right and the label is just stale.`;
      } else {
        proposal.suggestedDay =
          `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}-${pad(shifted.getDate())}`;
        proposal.warning =
          `Your notes say ${statedMatch[1]}, but ${dateMatch[1]} ${dayOfMonth}, ${year} is a ` +
          `${WEEKDAY_NAMES[actual]}${
            meetingDays.length > 0 ? ", which isn't one of your class days" : ""
          }.`;
      }
    }
  }

  return proposal;
}

export function proposalsForClass(
  courseCode: string,
  keyDates: KeyDate[],
  today: Date = new Date(),
  meetingTimes?: MeetingTime[],
): DateProposal[] {
  const meetingDays = meetingDaysFor(meetingTimes);
  return keyDates.map((keyDate, i) =>
    proposalFromKeyDate(keyDate, courseCode, i, today, meetingDays),
  );
}
