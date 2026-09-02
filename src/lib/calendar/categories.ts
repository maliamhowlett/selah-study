// What *kind* of thing an event is. This is the emphasis axis of the calendar:
// the colour already says which class an event belongs to (see courses.ts), so
// the category layers weight, underline or a dashed outline on top of that
// colour rather than replacing it. That way an ACCT exam still reads as ACCT.
//
// The category is stored on the Google event itself
// (extendedProperties.private.selahCategory) so it survives edits made anywhere.

export const CATEGORIES = [
  "exam",
  "assignment",
  "optional",
  "club",
  "class",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type CategoryStyle = {
  label: string;
  /** Extra classes layered onto the course colour in the month grid. */
  chip: string;
  /** Extra classes layered onto the course colour in the upcoming list. */
  row: string;
  /** Small uppercase badge — this one keeps its own colour so the word reads. */
  badge: string;
  /** Prefix character shown before the title, or "" for none. */
  marker: string;
  /** How much this needs to jump out, used to sort a busy day. */
  weight: number;
};

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  exam: {
    label: "Exam",
    // Solid underline plus a ring: the loudest treatment on the calendar.
    chip: "font-bold underline decoration-2 underline-offset-[3px] ring-2 ring-exam/70",
    row: "font-bold underline decoration-2 underline-offset-[3px] ring-2 ring-inset ring-exam/50",
    badge: "bg-exam text-white",
    marker: "★ ",
    weight: 0,
  },
  assignment: {
    label: "Due",
    // Dotted underline: clearly marked, one step quieter than an exam.
    chip: "font-semibold underline decoration-dotted decoration-2 underline-offset-[3px]",
    row: "font-semibold underline decoration-dotted decoration-2 underline-offset-[3px]",
    badge: "bg-assignment text-white",
    marker: "",
    weight: 1,
  },
  optional: {
    label: "Optional",
    // Dashed outline and lighter type: visibly a "could", not a "must".
    chip: "border border-dashed border-current/50 italic opacity-90",
    row: "border border-dashed border-current/40 italic opacity-90",
    badge: "bg-success text-white",
    marker: "✦ ",
    weight: 2,
  },
  club: {
    label: "Club",
    chip: "",
    row: "",
    badge: "bg-club text-white",
    marker: "",
    weight: 3,
  },
  class: {
    label: "Class",
    chip: "opacity-85",
    row: "opacity-85",
    badge: "bg-muted text-white",
    marker: "",
    weight: 4,
  },
  other: {
    label: "Event",
    chip: "",
    row: "",
    badge: "bg-primary text-white",
    marker: "",
    weight: 3,
  },
};

/** Human-facing options for the event form. */
export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "exam", label: "Exam / quiz / test" },
  { value: "assignment", label: "Assignment due" },
  { value: "optional", label: "Optional — extra credit, SI, review" },
  { value: "club", label: "Club or campus event" },
  { value: "class", label: "Class meeting" },
  { value: "other", label: "Other" },
];

// Category detection runs in a deliberate order, because real syllabus labels
// mix vocabularies: "Midterm Reflection Paper" is an assignment, not an exam,
// even though it contains the word "midterm".

// Checked first so an optional exam-prep session doesn't read as an exam.
const OPTIONAL =
  /\b(extra credit|bonus|optional|supplemental instruction|si session|review session|study session|drop-in|office hours|tutoring|not required|if you want)\b/i;

const SITTING = /\b(exam|quiz(z?es)?|test(s)?|assessment|proctor)\b/i;

const COURSEWORK =
  /\b(paper|essay|worksheet|reflection|activity|vision board|interview|response|draft|report|project|problem set|pset|homework|hw|assignment|smartbook|discussion post|due|deadline|submit)\b/i;

const SCHEDULED = /\b(midterm|mid-term|final(s)?)\b/i;

const CLUB =
  /\b(club|callout|social|fair|mixer|rush|bible study|small group|worship|volunteer|fundraiser|game night|retreat|conference|workshop|info session|interest session)\b/i;

const CLASS_TIME =
  /\b(lecture|lab|recitation|seminar|discussion section|class|meeting)\b/i;

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}

/**
 * Guess a category from the event's own words. Used for events created in
 * Google (or by a professor's shared calendar) that carry no Selah metadata.
 */
export function detectCategory(title: string, description?: string): Category {
  const haystack = `${title} ${description ?? ""}`;

  // Nothing optional should ever be shown as a hard requirement, so this wins
  // over every other rule.
  if (OPTIONAL.test(haystack)) return "optional";

  // "Exam"/"quiz"/"test" are unambiguous — a sitting is a sitting.
  if (SITTING.test(haystack)) return "exam";

  // Checked before midterm/final so "Final Reflection Paper" reads as work due,
  // not as an exam.
  if (COURSEWORK.test(haystack)) return "assignment";

  // "Last day of class (no final)" is a date to know, not an exam to sit.
  if (SCHEDULED.test(haystack) && !/\bno\s+final\b/i.test(haystack)) return "exam";

  if (CLUB.test(haystack)) return "club";
  if (CLASS_TIME.test(haystack)) return "class";

  return "other";
}
