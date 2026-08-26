// Event categories drive both the highlight styling on the site and the colour
// Google shows the event in. The category is stored on the Google event itself
// (extendedProperties.private.selahCategory) so it survives edits made anywhere.

export const CATEGORIES = ["exam", "assignment", "club", "class", "other"] as const;

export type Category = (typeof CATEGORIES)[number];

export type CategoryStyle = {
  label: string;
  /** Chip/pill styling used in the month grid. */
  chip: string;
  /** Left accent bar + background for the upcoming list. */
  row: string;
  /** Small uppercase badge. */
  badge: string;
  /** Dot used where there's no room for a full chip. */
  dot: string;
  /** Google Calendar colorId, so events look right in Google too. */
  googleColorId: string;
};

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  exam: {
    label: "Exam",
    chip: "bg-exam text-white font-semibold",
    row: "border-l-4 border-exam bg-exam-light",
    badge: "bg-exam text-white",
    dot: "bg-exam",
    googleColorId: "11", // Tomato
  },
  assignment: {
    label: "Due",
    chip: "bg-assignment-light text-assignment font-medium",
    row: "border-l-4 border-assignment bg-assignment-light",
    badge: "bg-assignment text-white",
    dot: "bg-assignment",
    googleColorId: "5", // Banana
  },
  club: {
    label: "Club",
    chip: "bg-club-light text-club font-medium",
    row: "border-l-4 border-club bg-club-light",
    badge: "bg-club text-white",
    dot: "bg-club",
    googleColorId: "1", // Lavender
  },
  class: {
    label: "Class",
    chip: "bg-surface-hover text-muted",
    row: "border-l-4 border-border bg-surface-hover",
    badge: "bg-muted text-white",
    dot: "bg-muted",
    googleColorId: "8", // Graphite
  },
  other: {
    label: "Event",
    chip: "bg-primary-light text-foreground",
    row: "border-l-4 border-primary bg-primary-light",
    badge: "bg-primary text-white",
    dot: "bg-primary",
    googleColorId: "4", // Flamingo
  },
};

/** Human-facing options for the event form. */
export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "exam", label: "Exam / quiz / test" },
  { value: "assignment", label: "Assignment due" },
  { value: "club", label: "Club or campus event" },
  { value: "class", label: "Class meeting" },
  { value: "other", label: "Other" },
];

// Ordered most-specific first: an event called "Exam review session" should read
// as an exam, but "Quiz 3 study group" should still land on exam too. Anything
// genuinely ambiguous falls through to "other".
const PATTERNS: [Category, RegExp][] = [
  [
    "exam",
    /\b(exam|midterm|mid-term|final(s)?\b|quiz(z?es)?|test(s)?\b|assessment|proctor)/i,
  ],
  [
    "assignment",
    /\b(due|assignment|homework|hw\b|paper|essay|project|problem set|pset|submit|deadline|draft|report|lab report|discussion post|response)/i,
  ],
  [
    "club",
    /\b(club|callout|meeting|social|fair|mixer|rush|bible study|small group|worship|service|volunteer|fundraiser|game night|retreat|conference|workshop|info session|interest session)/i,
  ],
  ["class", /\b(lecture|lab\b|recitation|seminar|discussion section|office hours|class\b)/i],
];

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}

/**
 * Guess a category from the event's own words. Used for events created in
 * Google (or by a professor's shared calendar) that carry no Selah metadata.
 */
export function detectCategory(title: string, description?: string): Category {
  const haystack = `${title} ${description ?? ""}`;
  for (const [category, pattern] of PATTERNS) {
    if (pattern.test(haystack)) return category;
  }
  return "other";
}
