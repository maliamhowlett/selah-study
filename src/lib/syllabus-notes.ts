// Observations about the syllabi that the class data itself can't express:
// what a syllabus quietly leaves out, and what's worth chasing before the
// semester gets away from you. Keyed by class slug.
//
// Everything here is a judgement about a document, not a fact stored in it —
// which is exactly why it lives apart from the class records rather than being
// squeezed into a notes field.

export interface SyllabusNote {
  /** Flagged in amber next to the grading table. */
  caution?: string;
  /** Quieter aside — a conversion, a scheduling quirk. */
  aside?: string;
}

export const SYLLABUS_NOTES: Record<string, SyllabusNote> = {
  "scla-10100": {
    caution:
      "The only dated item in this whole syllabus is the Research Process " +
      "quiz. The other six assignments — 60% of the grade — are placed by " +
      "unit, not by date.",
  },
  "expl-10100": {
    aside:
      "Graded on points rather than percentages, so convert if the handout " +
      "asks for a percent — every 10 points is 1%. No final exam; last class " +
      "is Wed 10 Dec.",
  },
  "ma-17000": {
    caution:
      "The syllabus warns in writing: don't book winter break travel before " +
      "the final exam date is published.",
  },
};

/** What still has to be tracked down, in the order worth doing it. */
export const OUTSTANDING: { title: string; detail: string }[] = [
  {
    title: "Three final exam dates",
    detail:
      "ACCT Exam 3, MA 161 Final and MA 170 Final all say “finals week, TBD.” " +
      "The registrar publishes the schedule — look up all three at once.",
  },
  {
    title: "SCLA due dates",
    detail:
      "Six assignments worth 60% of that grade, plus the weekly response " +
      "papers, have no dates anywhere in the syllabus. Email Prof. Heth or " +
      "check Brightspace.",
  },
  {
    title: "Two office rooms",
    detail:
      "Neither the MA 161 nor the MA 170 syllabus gives one — consultation " +
      "hours only.",
  },
];
