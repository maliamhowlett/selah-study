// Which class an event belongs to. This is the *colour* axis of the calendar:
// every ACCT event is one colour, every SCLA event another. What kind of thing
// it is — exam, something due, optional — is the separate emphasis axis handled
// in categories.ts, so the two stack rather than competing.

export const COURSES = ["acct", "scla", "ma161", "expl", "ma170", "none"] as const;

export type CourseKey = (typeof COURSES)[number];

export type CourseStyle = {
  /** Short label for chips and the legend. */
  label: string;
  /** Full course code, shown in the form's dropdown. */
  code: string;
  /** Tailwind class for the solid accent colour (borders, dots). */
  accent: string;
  /** Tailwind class for the tinted background. */
  tint: string;
  /** Tailwind class for text sitting on the tint. */
  text: string;
  /** Tailwind class for the accent as a border colour. */
  border: string;
  /** Google Calendar colorId so the class colour carries into Google too. */
  googleColorId: string;
};

export const COURSE_STYLES: Record<CourseKey, CourseStyle> = {
  acct: {
    label: "ACCT",
    code: "ACCT 20000",
    accent: "bg-course-acct",
    tint: "bg-course-acct-light",
    text: "text-course-acct",
    border: "border-course-acct",
    googleColorId: "6", // Tangerine
  },
  scla: {
    label: "SCLA",
    code: "SCLA 10100",
    accent: "bg-course-scla",
    tint: "bg-course-scla-light",
    text: "text-course-scla",
    border: "border-course-scla",
    googleColorId: "4", // Flamingo
  },
  ma161: {
    label: "MA 161",
    code: "MA 16100",
    accent: "bg-course-ma161",
    tint: "bg-course-ma161-light",
    text: "text-course-ma161",
    border: "border-course-ma161",
    googleColorId: "2", // Sage
  },
  expl: {
    label: "EXPL",
    code: "EXPL 10100",
    accent: "bg-course-expl",
    tint: "bg-course-expl-light",
    text: "text-course-expl",
    border: "border-course-expl",
    googleColorId: "1", // Lavender
  },
  ma170: {
    label: "MA 170",
    code: "MA 17000 / STAT 17000",
    accent: "bg-course-ma170",
    tint: "bg-course-ma170-light",
    text: "text-course-ma170",
    border: "border-course-ma170",
    googleColorId: "7", // Peacock
  },
  none: {
    label: "Personal",
    code: "Not a class",
    accent: "bg-course-none",
    tint: "bg-course-none-light",
    text: "text-course-none",
    border: "border-course-none",
    googleColorId: "8", // Graphite
  },
};

/** Dropdown order — classes first, "not a class" last. */
export const COURSE_OPTIONS: { value: CourseKey; label: string }[] = COURSES.map(
  (key) => ({ value: key, label: COURSE_STYLES[key].code }),
);

export function isCourse(value: unknown): value is CourseKey {
  return typeof value === "string" && (COURSES as readonly string[]).includes(value);
}

// MA 161 is matched before the bare "MA 170" pattern so "MA 16100" can't be
// caught by a looser rule, and calculus/statistics words act as a fallback for
// events typed without a course code.
const COURSE_PATTERNS: { key: CourseKey; pattern: RegExp }[] = [
  { key: "acct", pattern: /\b(acct|accounting|smartbook|connect)\b/i },
  { key: "scla", pattern: /\b(scla|gilgamesh|odyssey|othello|prometheus)\b/i },
  { key: "ma161", pattern: /\b(ma\s?-?16100|ma\s?161|calc(ulus)?\s?1?)\b/i },
  { key: "expl", pattern: /\b(expl|exploration|exploratory)\b/i },
  { key: "ma170", pattern: /\b(ma\s?-?17000|ma\s?170|stat\s?-?17000|stat\s?170)\b/i },
];

/** Guess the course from an event's own words, for anything created outside
 * this site that carries no Selah metadata. */
export function detectCourse(title: string, description?: string): CourseKey {
  const haystack = `${title} ${description ?? ""}`;
  for (const { key, pattern } of COURSE_PATTERNS) {
    if (pattern.test(haystack)) return key;
  }
  return "none";
}
