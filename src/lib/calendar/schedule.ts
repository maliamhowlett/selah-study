// Dates that live in a syllabus's prose rather than in its "key dates" list —
// the weekly SmartBook deadlines, the SI timetable, the run-up to a quiz. They
// are transcribed here once, by hand, so the import panel can offer them the
// same way it offers the parsed key dates.
//
// Everything here is a *proposal*: the panel shows the source wording and lets
// each row be edited or skipped before anything reaches Google.

import type { Category } from "./categories";
import type { CourseKey } from "./courses";
import type { RRuleDay } from "./types";

/** Fall 2026. Recurring blocks start the first full week and stop at the last
 * day of classes. */
const SEMESTER = { firstWeek: "2026-08-31", lastDay: "2026-12-11" };

export interface ScheduledItem {
  key: string;
  title: string;
  course: CourseKey;
  category: Category;
  location?: string;
  description?: string;
  /** YYYY-MM-DD of the first (or only) occurrence, or null when the syllabus
   * never gave a date and it has to be filled in by hand. */
  day: string | null;
  /** "16:30", or null for an all-day entry. */
  startTime: string | null;
  endTime: string | null;
  /** Present for weekly blocks. `untilDay` is inclusive. */
  repeat?: { days: RRuleDay[]; untilDay: string };
  /** Anything assumed rather than stated — shown quietly on the row. */
  note?: string;
}

export interface ScheduleGroup {
  key: string;
  courseCode: string;
  title: string;
  blurb: string;
  items: ScheduledItem[];
}

const DAY_INDEX: Record<RRuleDay, number> = {
  SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6,
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * The first date on or after `from` that falls on one of `days`. A weekly
 * series has to start on a day it actually meets, or Google shifts the whole
 * pattern.
 */
function firstOnOrAfter(from: string, days: RRuleDay[]): string {
  const [y, m, d] = from.split("-").map(Number);
  const wanted = new Set(days.map((day) => DAY_INDEX[day]));
  for (let offset = 0; offset < 7; offset += 1) {
    const candidate = new Date(y, m - 1, d + offset);
    if (wanted.has(candidate.getDay())) {
      return `${candidate.getFullYear()}-${pad(candidate.getMonth() + 1)}-${pad(candidate.getDate())}`;
    }
  }
  return from;
}

/** Shorthand for a weekly block that runs to the end of the semester. */
function weekly(
  item: Omit<ScheduledItem, "day" | "repeat"> & {
    days: RRuleDay[];
    untilDay?: string;
    from?: string;
  },
): ScheduledItem {
  const { days, untilDay, from, ...rest } = item;
  return {
    ...rest,
    day: firstOnOrAfter(from ?? SEMESTER.firstWeek, days),
    repeat: { days, untilDay: untilDay ?? SEMESTER.lastDay },
  };
}

/** An all-day deadline. ACCT's weekly work is all "by 11:59 PM of the stated
 * date", which reads better pinned to the top of the day than at a time. */
function due(
  key: string,
  title: string,
  day: string | null,
  course: CourseKey,
  description: string,
): ScheduledItem {
  return {
    key,
    title,
    course,
    category: "assignment",
    day,
    startTime: null,
    endTime: null,
    description,
  };
}

/**
 * A graded item a syllabus names but never dates. It reaches the panel with an
 * empty date box: worth having on the list so it can't be forgotten, but it
 * can't be imported until the real date is filled in from Brightspace.
 */
function undated(
  key: string,
  title: string,
  course: CourseKey,
  weight: string,
  extra?: string,
): ScheduledItem {
  return {
    key,
    title,
    course,
    category: "assignment",
    day: null,
    startTime: null,
    endTime: null,
    description: extra ? `${weight} of your grade. ${extra}` : `${weight} of your grade.`,
    note: "No date in the syllabus — check Brightspace and type it in before importing.",
  };
}

// ---------------------------------------------------------------------------
// ACCT 20000 — the weekly SmartBook deadlines from the course schedule table.
// Every one is a Tuesday except the last, which the syllabus puts on a Sunday.
// ---------------------------------------------------------------------------

const ACCT_DUE: [string, string][] = [
  ["2026-09-15", "Ch. 1, 2, 3 SmartBook Review & HW"],
  ["2026-09-29", "Ch. 4 SmartBook Review & HW"],
  ["2026-10-06", "Ch. 5 SmartBook Review & HW"],
  ["2026-10-13", "Ch. 6 SmartBook Review & HW"],
  ["2026-10-20", "Ch. 7 SmartBook Review & HW"],
  ["2026-11-03", "Ch. 8 SmartBook Review & HW"],
  ["2026-11-10", "Ch. 9 SmartBook Review & HW"],
  ["2026-11-17", "Ch. 10 SmartBook Review & HW"],
  ["2026-11-24", "Ch. 11 SmartBook Review & HW"],
  ["2026-12-06", "Ch. 12 SmartBook Review & HW"],
];

const acctWork: ScheduleGroup = {
  key: "acct-weekly",
  courseCode: "ACCT 20000",
  title: "Weekly SmartBook deadlines",
  blurb:
    "From the course schedule table. All due by 11:59 PM — Tuesdays, except " +
    "Ch. 12, which the syllabus puts on Sunday 6 Dec.",
  items: ACCT_DUE.map(([day, title], i) =>
    due(
      `acct-due-${i}`,
      `ACCT — ${title}`,
      day,
      "acct",
      "Due by 11:59 PM (Connect / SmartBook).",
    ),
  ),
};

const acctSI: ScheduleGroup = {
  key: "acct-si",
  courseCode: "ACCT 20000",
  title: "Supplemental Instruction",
  blurb: "SI leader Nyree Ruiz (ruiz165@purdue.edu). Optional — drop in as needed.",
  items: [
    weekly({
      key: "acct-si-sessions",
      title: "ACCT SI — Nyree Ruiz",
      course: "acct",
      category: "optional",
      location: "SCHM 116",
      description: "Supplemental Instruction. Optional drop-in.",
      days: ["TU", "TH"],
      startTime: "16:30",
      endTime: "17:20",
    }),
    weekly({
      key: "acct-si-office",
      title: "ACCT SI office hours — Nyree Ruiz",
      course: "acct",
      category: "optional",
      location: "WILY C215 (Academic Success Center)",
      days: ["TU"],
      startTime: "09:00",
      endTime: "10:00",
    }),
  ],
};

// ---------------------------------------------------------------------------
// MA 16100 — SI timetable from the screenshot. Sessions sharing a time and room
// are folded into one weekly block so they don't clutter the grid.
// ---------------------------------------------------------------------------

const maSI: ScheduleGroup = {
  key: "ma161-si",
  courseCode: "MA 16100",
  title: "Supplemental Instruction",
  blurb:
    "Two SI leaders, so there are more slots than you need — tick the ones " +
    "that fit around your 3:30 lecture and 7:30 AM recitation. Josh's " +
    "Tuesday 10:30 slot is left out: EXPL 10100 has that hour.",
  items: [
    weekly({
      key: "ma-si-shin-sun",
      title: "MA 161 SI — Shin S.",
      course: "ma161",
      category: "optional",
      location: "BRNG 1222",
      days: ["SU"],
      startTime: "17:30",
      endTime: "18:20",
    }),
    weekly({
      key: "ma-si-shin-wedthu",
      title: "MA 161 SI — Shin S.",
      course: "ma161",
      category: "optional",
      location: "SCHM 108",
      days: ["WE", "TH"],
      startTime: "17:30",
      endTime: "18:20",
    }),
    weekly({
      key: "ma-si-josh",
      title: "MA 161 SI — Josh K.",
      course: "ma161",
      category: "optional",
      location: "WALC 2121",
      days: ["MO", "TU", "TH"],
      startTime: "19:30",
      endTime: "20:20",
      note:
        "Runs into the 8:00 PM evening exams on a few nights (ACCT 17 Sep and " +
        "27 Oct, MA 161 23 Sep, 19 Oct and 18 Nov) — delete just those weeks " +
        "once they're on the calendar.",
    }),
    weekly({
      key: "ma-si-shin-hours",
      title: "MA 161 SI office hours — Shin S.",
      course: "ma161",
      category: "optional",
      days: ["TH"],
      startTime: "13:30",
      endTime: "14:30",
      note:
        "The last column of your screenshot has no room next to it. Read as " +
        "office hours, matching how ACCT lists its SI leader — check before you go. " +
        "Nothing else of yours is at this hour.",
    }),
  ],
};

// ---------------------------------------------------------------------------
// SCLA 10100 — the Research Process quiz, plus a weekly slot to work through
// the video modules it covers.
// ---------------------------------------------------------------------------

const sclaResearch: ScheduleGroup = {
  key: "scla-research",
  courseCode: "SCLA 10100",
  title: "Research Process quiz + weekly prep",
  blurb:
    'The syllabus says the quiz covers Purdue\'s "Foundations of the Research ' +
    'Process" video series, watched outside class — it never says how many ' +
    "modules, so the prep slot repeats weekly up to the week before.",
  items: [
    {
      key: "scla-research-quiz",
      title: "SCLA — Foundations of the Research Process Quiz",
      course: "scla",
      category: "exam",
      day: "2026-10-19",
      startTime: null,
      endTime: null,
      description:
        "Covers Purdue's \"Foundations of the Research Process\" video series.",
    },
    weekly({
      key: "scla-research-prep",
      title: "SCLA — Research Process module + notes",
      course: "scla",
      category: "assignment",
      description:
        "Watch the next module of the video series and take notes. Builds " +
        "toward the quiz on 19 Oct.",
      days: ["MO"],
      startTime: "19:00",
      endTime: "19:45",
      // Stops the Monday before the quiz, so the last session is revision.
      untilDay: "2026-10-12",
      note:
        "Monday evenings is a guess — move the first one and the rest follow, " +
        "or untick and add it yourself on a day that suits.",
    }),
  ],
};


// ---------------------------------------------------------------------------
// The classes themselves: where to be, and who's teaching. Every one of these
// is a 50-minute block, which covers the syllabi that gave only a start time.
// ---------------------------------------------------------------------------

const classBlocks: ScheduleGroup = {
  key: "class-meetings",
  courseCode: "All classes",
  title: "Class meetings",
  blurb:
    "Your weekly timetable, with the room in the location field and the " +
    "instructor in the notes, so tapping an event tells you where to go and " +
    "who to email.",
  items: [
    weekly({
      key: "class-acct",
      title: "ACCT 20000 — Intro Accounting",
      course: "acct",
      category: "class",
      location: "FRNY G140",
      description: "Dr. Becky (Rebekha) Bokrand · rbokrand@purdue.edu · Section 001",
      days: ["MO", "WE", "FR"],
      startTime: "08:30",
      endTime: "09:20",
    }),
    weekly({
      key: "class-scla",
      title: "SCLA 10100 — Critical Thinking & Communication I",
      course: "scla",
      category: "class",
      location: "BRNG 1242",
      description: "Raleigh Heth · rheth@purdue.edu",
      days: ["MO", "WE", "FR"],
      startTime: "10:30",
      endTime: "11:20",
    }),
    weekly({
      key: "class-expl",
      title: "EXPL 10100",
      course: "expl",
      category: "class",
      location: "UNIV 201",
      description: "Cara Wetzel · wetzelc@purdue.edu · Office hours by appointment, Young Hall 6th floor",
      days: ["TU", "TH"],
      startTime: "10:30",
      endTime: "11:20",
    }),
    weekly({
      key: "class-ma161-lecture",
      title: "MA 16100 — Lecture",
      course: "ma161",
      category: "class",
      location: "CL50 224",
      description: "Dr. Mahesh Sunkula · msunkula@purdue.edu · Section 100 · Office hours MWF 1:30–2:30",
      days: ["MO", "WE", "FR"],
      startTime: "15:30",
      endTime: "16:20",
    }),
    weekly({
      key: "class-ma161-recitation",
      title: "MA 16100 — Recitation",
      course: "ma161",
      category: "class",
      location: "HAMP 2123",
      description: "K. P. Ashmallah · Quizzes happen here.",
      days: ["TU", "TH"],
      startTime: "07:30",
      endTime: "08:20",
    }),
    weekly({
      key: "class-ma170-tue",
      title: "MA 17000 / STAT 17000 — Lecture",
      course: "ma170",
      category: "class",
      location: "WALC 1055",
      description: "Daniel Rubin · rubin6@purdue.edu · Office hours Wed 10 AM–12 PM",
      days: ["TU"],
      startTime: "15:30",
      endTime: "16:20",
    }),
    weekly({
      key: "class-ma170-thu",
      title: "MA 17000 / STAT 17000 — Lecture or lab",
      course: "ma170",
      category: "class",
      location: "MATH 175 (lecture) / your assigned lab room (lab)",
      description:
        "Daniel Rubin · rubin6@purdue.edu · Thursday is a lecture some weeks " +
        "and a lab others, so both rooms are listed — check which one this " +
        "week is. Different room from Tuesday either way.",
      days: ["TH"],
      startTime: "15:30",
      endTime: "16:20",
    }),
  ],
};


// ---------------------------------------------------------------------------
// MA 16100 — the recurring work. Homework and recitation quizzes are 22% of the
// grade between them and appear nowhere in the key dates, because the syllabus
// states them as a pattern rather than a list.
// ---------------------------------------------------------------------------

const maWeekly: ScheduleGroup = {
  key: "ma161-weekly",
  courseCode: "MA 16100",
  title: "Weekly homework & recitation quizzes",
  blurb:
    "Your syllabus gives these as a rule rather than a list of dates: " +
    "homework from the Fri + Mon lectures is due Tuesday, homework from the " +
    "Wed lecture is due Thursday, and there's a quiz at nearly every " +
    "recitation. Together that's 22% of the grade.",
  items: [
    weekly({
      key: "ma161-homework",
      title: "MA 161 — MyLab homework due",
      course: "ma161",
      category: "assignment",
      description:
        "Due 11:59 PM. Tuesday covers the Fri + Mon lectures; Thursday " +
        "covers the Wed lecture. 36 assignments across the semester = 10% " +
        "of your grade.",
      days: ["TU", "TH"],
      startTime: null,
      endTime: null,
    }),
    weekly({
      key: "ma161-quiz",
      title: "MA 161 — Recitation quiz",
      course: "ma161",
      category: "exam",
      location: "HAMP 2123",
      description: "With K. P. Ashmallah. Quizzes are 12% of your grade.",
      days: ["TU", "TH"],
      startTime: "07:30",
      endTime: "08:20",
      note:
        "Sits on top of the recitation block, so importing both shows two " +
        "entries at 7:30. Skip this one if that's too busy — the recitation " +
        "event already says quizzes happen there. Your syllabus says " +
        "\u201cnearly every\u201d recitation, so a few of these weeks won't have one.",
    }),
  ],
};

// ---------------------------------------------------------------------------
// SCLA 10100 — the biggest gap. Nine graded items in the syllabus, and its
// schedule lists units rather than dates, so almost all of them arrive here
// without one.
// ---------------------------------------------------------------------------

const sclaWork: ScheduleGroup = {
  key: "scla-work",
  courseCode: "SCLA 10100",
  title: "Major assignments",
  blurb:
    "Every graded item from the syllabus's grade breakdown. The SCLA " +
    "schedule is organised by unit (Gilgamesh \u2192 Hebrew Bible \u2192 Odyssey " +
    "\u2192 Prometheus Bound \u2192 Othello) and never gives calendar dates, so these " +
    "come through blank \u2014 get the dates from Brightspace or ask Prof. Heth, " +
    "then type them in. Percentages are in each event's notes.",
  items: [
    weekly({
      key: "scla-response-paper",
      title: "SCLA — Weekly response paper due",
      course: "scla",
      category: "assignment",
      description:
        "300\u2013325 words. 15% of your grade. You may drop some without penalty " +
        "\u2014 check the syllabus for how many.",
      days: ["FR"],
      startTime: null,
      endTime: null,
      note:
        "Friday is a guess: the syllabus says weekly but never names a day. " +
        "Move the first one and the rest follow.",
    }),
    undated("scla-creative", "SCLA \u2014 Creative Writing Project", "scla", "10%",
      "750\u20131,000 words on a character from the course."),
    undated("scla-thesis", "SCLA \u2014 Oral Thesis Presentation", "scla", "10%"),
    undated("scla-annobib", "SCLA \u2014 Annotated Bibliography", "scla", "10%",
      "3\u20134 sources related to your research topic."),
    undated("scla-draft", "SCLA \u2014 Research Paper Draft 1", "scla", "5%"),
    undated("scla-peer", "SCLA \u2014 Peer-Review Session", "scla", "5%"),
    undated("scla-final-paper", "SCLA \u2014 Final Research Paper", "scla", "20%",
      "1,700\u20132,000 words. The single biggest item in the course."),
  ],
};

// ---------------------------------------------------------------------------
// The remaining undated items from the other syllabi, so nothing graded is
// missing from the calendar entirely.
// ---------------------------------------------------------------------------

const otherWork: ScheduleGroup = {
  key: "other-undated",
  courseCode: "EXPL 10100 & MA 17000",
  title: "Graded items with no date yet",
  blurb:
    "Named in the grade breakdowns but never dated. Same deal \u2014 fill in the " +
    "date before importing.",
  items: [
    undated("expl-quizzes", "EXPL \u2014 Quiz", "expl", "50 pts",
      "Five quizzes, 10 pts each. Add one event per quiz as the dates are announced."),
    undated("ma170-lab", "MA 170 \u2014 Excel Lab / Journal due", "ma170", "25%",
      "The largest coursework item in the class \u2014 add one per lab."),
    undated("ma170-presentation", "MA 170 \u2014 Insurance Company Presentation", "ma170", "3%",
      "Two are required across the semester."),
    undated("ma170-meeting-1", "MA 170 \u2014 1:1 Meeting #1", "ma170", "5%",
      "Aug/Sept, and you schedule it yourself."),
    undated("ma170-meeting-2", "MA 170 \u2014 1:1 Meeting #2", "ma170", "5%",
      "Nov/Dec, and you schedule it yourself."),
  ],
};

export function scheduleGroups(): ScheduleGroup[] {
  return [
    classBlocks,
    acctWork,
    maWeekly,
    sclaResearch,
    sclaWork,
    otherWork,
    acctSI,
    maSI,
  ];
}
