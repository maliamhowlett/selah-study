// Study material, one entry per course.
//
// Deliberately static rather than read from Supabase: the point of this page is
// to be usable the night before an exam, and a database outage shouldn't be
// able to take your revision with it. Course facts come from CLASSES, which is
// also static; everything here is the part a syllabus doesn't give you.

export type Emphasis = "high" | "medium";

export interface PracticeProblem {
  id: string;
  topic: string;
  question: string;
  /** Worked solution, not just the number — the working is the point. */
  answer: string;
  /** The specific mistake this problem exists to catch. */
  trap?: string;
}

export interface StudyTopic {
  chapter: string;
  title: string;
  emphasis: Emphasis;
  /** Why it earns that emphasis — stated so it can be argued with. */
  because: string;
  mustKnow: string[];
  traps: string[];
}

export interface StudyDay {
  /** YYYY-MM-DD, so the page can tell which day you're on. */
  date: string;
  focus: string;
  minutes: number;
  tasks: string[];
  /** Something time-bound that only exists on this day. */
  fixture?: string;
}

export interface ExamPlan {
  label: string;
  /** YYYY-MM-DD of the exam. */
  date: string;
  when: string;
  where: string;
  covers: string;
  weight: string;
  /** Opening read on where you stand, and what it implies for this exam. */
  situation: string[];
  topics: StudyTopic[];
  days: StudyDay[];
  problems: PracticeProblem[];
}

export interface HelpSource {
  label: string;
  detail: string;
  /** Weekday numbers (0 = Sunday) this is available, for "today" highlighting. */
  days?: number[];
}

export interface CourseStudy {
  slug: string;
  /** One line on how to study for this particular course. */
  approach: string;
  examPlan?: ExamPlan;
  help: HelpSource[];
}

// ---------------------------------------------------------------------------
// ACCT 20000 — Exam 2
// ---------------------------------------------------------------------------

const ACCT_EXAM_2: ExamPlan = {
  label: "Exam 2",
  date: "2026-10-27",
  when: "Tuesday 27 October, 8:00–9:00 PM",
  where: "WTHR 200",
  covers: "Chapters 4–7 (Module 2)",
  weight: "20% of your grade",
  situation: [
    "Exam 2 is worth 20%, more than Exam 1's 15% — and Exam 3 is another 25%. " +
      "Most of the exam weight in this course is still ahead of you.",
    "Chapters 1–3 were the accounting cycle itself. Chapters 4–7 are four new " +
      "topics, but every one of them is tested *through* journal entries. " +
      "Whatever cost points last time will show up again unless it gets fixed " +
      "first — which is why day one is a mechanics check, not new material.",
    "The single highest-value hour this week is getting Exam 1 back and finding " +
      "out exactly which questions you lost. Guessing at it is much slower than " +
      "asking.",
  ],
  topics: [
    {
      chapter: "Ch. 4",
      title: "Cash and Internal Controls",
      emphasis: "medium",
      because:
        "Procedural and self-contained — the most reliably earnable points on " +
        "the exam once the format is familiar.",
      mustKnow: [
        "Bank reconciliation: which items adjust the bank side, which adjust the book side",
        "Journal entries from a reconciliation",
        "Petty cash: establishing, replenishing, over/short",
        "Internal control principles and their limitations",
      ],
      traps: [
        "Only book-side items produce journal entries. Outstanding checks and deposits in transit never do.",
        "An NSF check reduces the book balance — it is not a bank error.",
      ],
    },
    {
      chapter: "Ch. 5",
      title: "Receivables and Sales",
      emphasis: "high",
      because:
        "The allowance method is the most commonly missed topic in the whole course.",
      mustKnow: [
        "Allowance method: percentage-of-receivables vs percentage-of-sales",
        "Aging schedules",
        "Writing off an account, and recovering one previously written off",
        "Notes receivable: interest = principal × rate × time",
        "Net realizable value of receivables",
      ],
      traps: [
        "Percentage-of-receivables adjusts TO a target balance; percentage-of-sales adjusts BY an amount. Mixing these up is the classic error.",
        "A write-off has no effect on total assets and no effect on net income — the expense was already recorded when the allowance was estimated.",
        "Check whether the unadjusted allowance balance is a debit or a credit before computing the adjustment.",
      ],
    },
    {
      chapter: "Ch. 6",
      title: "Inventory and Cost of Goods Sold",
      emphasis: "high",
      because:
        "Purely computational, which makes it easy to examine and easy to lose points on under time pressure.",
      mustKnow: [
        "FIFO, LIFO and weighted average — periodic and perpetual",
        "Cost of goods available for sale = beginning inventory + purchases",
        "Lower of cost and net realizable value",
        "Inventory turnover and days in inventory",
        "Effects of an inventory error on this year and next",
      ],
      traps: [
        "In rising prices: FIFO gives higher ending inventory and higher net income; LIFO gives higher COGS and lower tax.",
        "Weighted average is recomputed per purchase under perpetual, once for the period under periodic.",
      ],
    },
    {
      chapter: "Ch. 7",
      title: "Long-Term Assets",
      emphasis: "high",
      because:
        "Three depreciation methods plus disposals means the most distinct calculations of any chapter on this exam.",
      mustKnow: [
        "Capitalize vs expense",
        "Straight-line, double-declining-balance, activity-based depreciation",
        "Partial-year depreciation",
        "Disposals: gain or loss against book value",
        "Intangibles and amortization; goodwill is not amortized",
      ],
      traps: [
        "Double-declining-balance ignores salvage value in the formula, but you stop once book value reaches salvage.",
        "On a disposal, compare cash received to BOOK VALUE, never to original cost — and update depreciation to the disposal date first.",
      ],
    },
  ],
  days: [
    {
      date: "2026-10-22",
      focus: "Fix the mechanics, then Chapter 4",
      minutes: 150,
      fixture:
        "Both of these are today: Dr. Bokrand's virtual office hours 2:00–4:00 PM, " +
        "and SI with Nyree Ruiz 4:30–5:20 PM in SCHM 116. Bring Exam 1 to one of them.",
      tasks: [
        "30 min — Re-do three Ch. 1–3 journal entry and adjusting entry problems cold. If these feel slow, that is the thing to fix first; everything this week sits on top of them.",
        "Get Exam 1 back and write down every question you lost, by topic.",
        "60 min — Ch. 4: work three complete bank reconciliations, including the journal entries.",
        "30 min — Ch. 4 notes packet and SmartBook review questions.",
      ],
    },
    {
      date: "2026-10-23",
      focus: "Chapter 5 — Receivables",
      minutes: 150,
      tasks: [
        "45 min — Allowance method both ways. Do the same scenario under percentage-of-receivables and percentage-of-sales until the difference is obvious.",
        "30 min — Three problems where the unadjusted allowance starts with a DEBIT balance.",
        "30 min — Write-offs and recoveries. State the effect on assets and on net income each time.",
        "30 min — Notes receivable and interest accruals.",
      ],
    },
    {
      date: "2026-10-24",
      focus: "Chapter 6 — Inventory",
      minutes: 165,
      tasks: [
        "60 min — Take one dataset and compute ending inventory and COGS under FIFO, LIFO and weighted average. Repeat with a second dataset without looking back.",
        "30 min — The same thing perpetual rather than periodic.",
        "30 min — Lower of cost and net realizable value.",
        "45 min — Re-do anything from Ch. 5 you got wrong yesterday.",
      ],
    },
    {
      date: "2026-10-25",
      focus: "Chapter 7 — Long-term assets",
      minutes: 165,
      tasks: [
        "30 min — Capitalize vs expense: sort twenty items into the two piles.",
        "45 min — All three depreciation methods on one asset, then a partial-year version.",
        "45 min — Disposals at a gain, at a loss, and at exactly book value.",
        "30 min — Intangibles and amortization.",
      ],
    },
    {
      date: "2026-10-26",
      focus: "Mixed practice, timed, no notes",
      minutes: 150,
      tasks: [
        "60 min — A mixed problem set across all four chapters, timed, closed-book. This is the day to find out what is actually still shaky.",
        "45 min — Re-do every problem you missed this week. These are worth more than new ones.",
        "30 min — Re-run the Ch. 4–7 SmartBook questions in Connect.",
        "15 min — Write a one-page sheet of the formulas and the traps, in your own hand.",
      ],
    },
    {
      date: "2026-10-27",
      focus: "Exam day — light only",
      minutes: 60,
      fixture:
        "SI session 4:30–5:20 PM in SCHM 116, three hours before the exam. " +
        "Exam is 8:00–9:00 PM in WTHR 200.",
      tasks: [
        "45 min — Read your one-page sheet and your error list. Nothing new.",
        "Bring a calculator. Eat something before 8 PM.",
        "No cramming after about 5 PM — it costs more in accuracy than it adds in recall.",
      ],
    },
  ],
  problems: [
    {
      id: "allowance-receivables",
      topic: "Ch. 5 — Allowance method",
      question:
        "At 31 December, Accounts Receivable is $80,000. Before adjustment, " +
        "Allowance for Uncollectible Accounts has a CREDIT balance of $1,200. " +
        "The company estimates 6% of receivables will prove uncollectible. " +
        "Record the adjusting entry.",
      answer:
        "Target allowance = 6% × $80,000 = $4,800 (credit).\n" +
        "Already there: $1,200 credit.\n" +
        "Adjustment needed = $4,800 − $1,200 = $3,600.\n\n" +
        "Dr Bad Debt Expense       3,600\n" +
        "   Cr Allowance for Uncollectible Accounts   3,600",
      trap:
        "You adjust TO $4,800, not BY $4,800. And if that unadjusted balance had " +
        "been a $1,200 DEBIT instead, the entry would be $4,800 + $1,200 = $6,000.",
    },
    {
      id: "write-off-effect",
      topic: "Ch. 5 — Write-offs",
      question:
        "Under the allowance method, a company writes off a $900 account as " +
        "uncollectible. What is the effect on total assets and on net income?",
      answer:
        "Dr Allowance for Uncollectible Accounts   900\n" +
        "   Cr Accounts Receivable                    900\n\n" +
        "Total assets: NO CHANGE. Accounts Receivable falls $900 and the contra " +
        "account falls $900, so net realizable value is unchanged.\n" +
        "Net income: NO CHANGE. The expense was recognised when the allowance " +
        "was estimated, not now.",
      trap:
        "A write-off never touches Bad Debt Expense. If your entry has an expense " +
        "in it, you have used the direct write-off method by mistake.",
    },
    {
      id: "cost-flow",
      topic: "Ch. 6 — Cost flow assumptions",
      question:
        "Beginning inventory: 100 units @ $10. Purchases: 200 @ $12, then " +
        "100 @ $15. 250 units are sold. Periodic system. Find ending inventory " +
        "and COGS under FIFO, LIFO and weighted average.",
      answer:
        "Goods available = (100×10) + (200×12) + (100×15) = $4,900 across 400 units.\n" +
        "Units sold 250, so ending inventory = 150 units.\n\n" +
        "FIFO — ending is the newest: (100×15) + (50×12) = $2,100.\n" +
        "   COGS = 4,900 − 2,100 = $2,800\n\n" +
        "LIFO — ending is the oldest: (100×10) + (50×12) = $1,600.\n" +
        "   COGS = 4,900 − 1,600 = $3,300\n\n" +
        "Weighted average — $4,900 ÷ 400 = $12.25/unit.\n" +
        "   Ending = 150 × 12.25 = $1,837.50\n" +
        "   COGS   = 250 × 12.25 = $3,062.50",
      trap:
        "Costs are rising here, so FIFO gives the highest ending inventory and " +
        "the highest net income, LIFO the highest COGS and the lowest tax. " +
        "Always find goods available first — it is the control total.",
    },
    {
      id: "ddb",
      topic: "Ch. 7 — Depreciation",
      question:
        "Equipment costs $50,000, salvage value $5,000, useful life 5 years. " +
        "Compute Year 1 and Year 2 depreciation under double-declining-balance. " +
        "Then compare to straight-line.",
      answer:
        "DDB rate = 2 × (1/5) = 40%.\n" +
        "Year 1 = $50,000 × 40% = $20,000. Book value now $30,000.\n" +
        "Year 2 = $30,000 × 40% = $12,000. Book value now $18,000.\n\n" +
        "Straight-line = (50,000 − 5,000) ÷ 5 = $9,000 per year.",
      trap:
        "DDB does NOT subtract salvage value in the formula — but you stop " +
        "depreciating once book value hits $5,000. Straight-line subtracts it " +
        "up front. Mixing the two is a common and expensive slip.",
    },
    {
      id: "disposal",
      topic: "Ch. 7 — Disposals",
      question:
        "Equipment cost $40,000 with accumulated depreciation of $28,000 is " +
        "sold for $9,000 cash. Gain or loss, and what is the entry?",
      answer:
        "Book value = $40,000 − $28,000 = $12,000.\n" +
        "Cash received $9,000 < book value $12,000 → LOSS of $3,000.\n\n" +
        "Dr Cash                        9,000\n" +
        "Dr Accumulated Depreciation   28,000\n" +
        "Dr Loss on Sale of Equipment   3,000\n" +
        "   Cr Equipment                   40,000",
      trap:
        "Compare the cash to BOOK VALUE, never to the $40,000 cost. And if the " +
        "sale happens mid-year, record depreciation up to the disposal date first " +
        "— otherwise the book value, and therefore the gain or loss, is wrong.",
    },
    {
      id: "bank-rec",
      topic: "Ch. 4 — Bank reconciliation",
      question:
        "Which side of the reconciliation does each belong on, and which " +
        "require a journal entry? (a) outstanding checks (b) NSF check from a " +
        "customer (c) deposit in transit (d) bank service charge (e) interest " +
        "earned on the account",
      answer:
        "BANK side — no journal entry:\n" +
        "   (a) outstanding checks   — subtract\n" +
        "   (c) deposit in transit   — add\n\n" +
        "BOOK side — journal entry required:\n" +
        "   (b) NSF check            — subtract\n" +
        "   (d) service charge       — subtract\n" +
        "   (e) interest earned      — add",
      trap:
        "Only the book side generates entries. A quick test: if the bank already " +
        "knows about it and you didn't, it's a book-side item and needs an entry.",
    },
    {
      id: "capitalize",
      topic: "Ch. 7 — Capitalize vs expense",
      question:
        "Which of these are capitalized? (a) routine oil change on a delivery " +
        "truck (b) a new engine that extends the truck's useful life (c) freight " +
        "paid to have a new machine delivered (d) installation and testing of " +
        "that machine (e) repainting the office",
      answer:
        "CAPITALIZE: (b) new engine, (c) freight-in, (d) installation and testing.\n" +
        "EXPENSE: (a) oil change, (e) repainting.\n\n" +
        "The rule: capitalize if it extends useful life, increases capacity or " +
        "efficiency, or was necessary to get the asset ready for its intended use.",
      trap:
        "Ordinary repairs and maintenance that merely keep an asset running are " +
        "expensed, however large the bill.",
    },
    {
      id: "lcnrv",
      topic: "Ch. 6 — Lower of cost and NRV",
      question:
        "Inventory has a cost of $12,000 and a net realizable value of $10,500. " +
        "What entry, if any, is required?",
      answer:
        "NRV is below cost, so write the inventory down by $1,500.\n\n" +
        "Dr Cost of Goods Sold   1,500\n" +
        "   Cr Inventory            1,500\n\n" +
        "Inventory is now carried at $10,500.",
      trap:
        "The write-down goes to COGS. And it only ever runs one way — if NRV is " +
        "above cost you do nothing at all.",
    },
  ],
};

// ---------------------------------------------------------------------------

export const COURSE_STUDY: Record<string, CourseStudy> = {
  "acct-20000": {
    slug: "acct-20000",
    approach:
      "Accounting is a doing subject. Reading the notes packet feels like " +
      "studying and mostly isn't — the points come from working problems with " +
      "your hand, then checking.",
    examPlan: ACCT_EXAM_2,
    help: [
      {
        label: "SI with Nyree Ruiz",
        detail: "Tue & Thu 4:30–5:20 PM, SCHM 116. Bring your ID, notes and questions.",
        days: [2, 4],
      },
      {
        label: "Nyree's office hours",
        detail: "Tuesdays 9:00–10:00 AM, WILY C215 (Academic Success Center).",
        days: [2],
      },
      {
        label: "Dr. Bokrand's office hours",
        detail:
          "Wed 11:00 AM–12:30 PM in KRAN 428 or virtual; Thu 2:00–4:00 PM virtual only. Book via Calendly.",
        days: [3, 4],
      },
      {
        label: "Piazza",
        detail: "The fastest route to a homework answer, per the syllabus.",
      },
      {
        label: "Connect SmartBook",
        detail: "Re-runnable practice on every chapter — the closest thing to the exam's question style.",
      },
    ],
  },

  "scla-10100": {
    slug: "scla-10100",
    approach:
      "Graded on writing and on talking, not on recall: 20% is contribution in " +
      "discussion. Reading with a few quotations marked in advance is what makes " +
      "that 20% straightforward.",
    help: [
      {
        label: "Prof. Heth's office hours",
        detail: "Tue & Thu 2:00–4:00 PM, Beering 6165, or by appointment. Zoom also possible.",
        days: [2, 4],
      },
      {
        label: "Purdue OWL",
        detail: "Writing help — this course asks for at least 8,000 words of polished writing.",
      },
    ],
  },

  "ma-16100": {
    slug: "ma-16100",
    approach:
      "There is a quiz at nearly every recitation, so the work is continuous " +
      "rather than crammable. Exams are machine-graded with no partial credit, " +
      "which makes accuracy worth as much as method.",
    help: [
      {
        label: "SI with Shin S.",
        detail: "Sun 5:30–6:20 PM (BRNG 1222); Wed & Thu 5:30–6:20 PM (SCHM 108). Office hours Thu 1:30–2:30 PM.",
        days: [0, 3, 4],
      },
      {
        label: "SI with Josh K.",
        detail: "Mon, Tue & Thu 7:30–8:20 PM, WALC 2121.",
        days: [1, 2, 4],
      },
      {
        label: "Dr. Sunkula's office hours",
        detail: "Mon, Wed & Fri 1:30–2:30 PM.",
        days: [1, 3, 5],
      },
      {
        label: "K. P. Ashmallah (recitation TA)",
        detail: "Tue & Thu 7:30–8:20 AM, HAMP 2123. Ask your TA first — quizzes and grading go through them.",
        days: [2, 4],
      },
    ],
  },

  "expl-10100": {
    slug: "expl-10100",
    approach:
      "Nearly 40% of the grade is simply preparing for and participating in the " +
      "26 class meetings. Showing up ready is most of the work; the reflections " +
      "want your own voice, not a researched answer.",
    help: [
      {
        label: "Cara Wetzel",
        detail: "By appointment — office on the 6th floor of Young Hall. 765-494-0843.",
      },
    ],
  },

  "ma-17000": {
    slug: "ma-17000",
    approach:
      "A quarter of the grade is Excel labs and journals, which are coursework " +
      "rather than exam material — they are the most controllable marks in the " +
      "course, so don't let them slip.",
    help: [
      {
        label: "Daniel Rubin's office hours",
        detail: "Wednesdays 10:00 AM–12:00 PM, or by appointment. 614-309-6576.",
        days: [3],
      },
      {
        label: "Your two 1:1 meetings",
        detail: "Worth 5% and you schedule them yourself — one Aug/Sept, one Nov/Dec.",
      },
    ],
  },
};

export function studyFor(slug: string): CourseStudy | undefined {
  return COURSE_STUDY[slug];
}

// Every date here is a campus date. Vercel runs in UTC, so asking the server
// for "today" without naming a zone gets the wrong answer for five hours each
// evening — long enough to matter for an 8 PM exam.
const CAMPUS_ZONE = "America/Indiana/Indianapolis";

/** Today on campus, as YYYY-MM-DD. en-CA formats in exactly that shape. */
export function campusToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CAMPUS_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Day of the week on campus, 0 = Sunday, to match Date.getDay(). */
export function campusWeekday(): number {
  const [y, m, d] = campusToday().split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

/** Whole days from today on campus until `date`, both as YYYY-MM-DD. */
export function daysUntil(date: string, from: string = campusToday()): number {
  const [ty, tm, td] = date.split("-").map(Number);
  const [fy, fm, fd] = from.split("-").map(Number);
  const target = Date.UTC(ty, tm - 1, td);
  const start = Date.UTC(fy, fm - 1, fd);
  return Math.round((target - start) / 86_400_000);
}
