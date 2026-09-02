// Composes the two axes of the calendar's look: the course supplies the colour,
// the category supplies the emphasis. Every component asks for its classes here
// so an exam looks the same whether it's in the month grid or the list.

import { CATEGORY_STYLES } from "./categories";
import type { Category } from "./categories";
import { COURSE_STYLES } from "./courses";
import type { CourseKey } from "./courses";

interface Styleable {
  category: Category;
  course?: CourseKey;
}

function parts(event: Styleable) {
  return {
    course: COURSE_STYLES[event.course ?? "none"],
    category: CATEGORY_STYLES[event.category],
  };
}

/** Small chip in a month-grid cell. */
export function chipClass(event: Styleable): string {
  const { course, category } = parts(event);
  return `${course.tint} ${course.text} ${category.chip}`;
}

/** Full-width row in the upcoming list. */
export function rowClass(event: Styleable): string {
  const { course, category } = parts(event);
  return `border-l-4 ${course.border} ${course.tint} ${course.text} ${category.row}`;
}

/** Dot for the compact/mobile view — colour only, no room for emphasis. */
export function dotClass(event: Styleable): string {
  return parts(event).course.accent;
}

/** The title with its category marker, e.g. "★ ACCT Exam 1". */
export function markedTitle(event: Styleable & { title: string }): string {
  return `${CATEGORY_STYLES[event.category].marker}${event.title}`;
}

/** Sorts a day's events so exams sit above homework above optional extras. */
export function byEmphasis(a: Styleable, b: Styleable): number {
  return CATEGORY_STYLES[a.category].weight - CATEGORY_STYLES[b.category].weight;
}
