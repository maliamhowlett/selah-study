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

/**
 * One item in the time-poor ordering. Ranked by marks per minute, because
 * when there isn't time for everything the question stops being "what should
 * I learn" and becomes "what do I learn first".
 */
export interface TriageItem {
  what: string;
  marks: number;
  minutes: number;
  /** Why it is this cheap — usually "one rule" or "no calculation". */
  why: string;
}

/** One line of the instructor's own exam blueprint. */
export interface BlueprintRow {
  /** Learning objective number, blank when a row continues the one above. */
  lo: string;
  topic: string;
  questions: number;
  /** Set when the practice paper has nothing resembling this row. */
  gap?: string;
}

export interface BlueprintChapter {
  chapter: string;
  title: string;
  rows: BlueprintRow[];
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
  /** The instructor's published question counts, where there are any. */
  blueprint?: BlueprintChapter[];
  /** Highest-return work first, for when time is short. */
  triage?: TriageItem[];
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

const ACCT_BLUEPRINT: BlueprintChapter[] = [
  {
    chapter: "Ch. 4",
    title: "Cash and Internal Controls",
    rows: [
      {
        lo: "1",
        topic: "Role of corporate executives regarding the financial statements",
        questions: 1,
        gap: "Nothing like this on the practice paper. Your note says it: their role is to certify the financial statements.",
      },
      { lo: "2", topic: "Definitions and components of internal control", questions: 3 },
      { lo: "3", topic: "Accounting treatment of different forms of customer payment", questions: 1 },
      { lo: "4", topic: "Controls over cash receipts", questions: 1 },
      { lo: "5", topic: "Reconcile the bank side and book side of the cash balance", questions: 2 },
      { lo: "6", topic: "Record petty cash expenditures", questions: 1 },
      {
        lo: "8",
        topic: "Reporting cash in the financial statements",
        questions: 1,
        gap: "Not on the practice paper. Your note: balance sheet, and statement of cash flows.",
      },
    ],
  },
  {
    chapter: "Ch. 5",
    title: "Receivables and Revenues",
    rows: [
      { lo: "1", topic: "Record credit sales with and without sales discounts", questions: 2 },
      { lo: "2", topic: "Record customer returns", questions: 1 },
      { lo: "", topic: "Determine net revenues", questions: 1 },
      { lo: "3", topic: "Account characteristics of the Allowance for Uncollectible Accounts", questions: 1 },
      { lo: "", topic: "Determine net accounts receivable", questions: 1 },
      { lo: "4", topic: "Effect of bad debt write-offs on the accounting equation", questions: 1 },
      { lo: "5", topic: "Calculate bad debt expense with given allowance information", questions: 1 },
      {
        lo: "",
        topic: "Calculate bad debt expense using the aging method",
        questions: 1,
        gap: "The practice paper never asks this, and it is the hardest thing in the chapter. Work Example 7 and Activity 2 from the review packet.",
      },
      { lo: "7", topic: "Compute notes receivable interest revenue", questions: 1 },
    ],
  },
  {
    chapter: "Ch. 6",
    title: "Inventory and Cost of Goods Sold",
    rows: [
      { lo: "2", topic: "Compute subtotals in a multi-step income statement", questions: 2 },
      { lo: "3", topic: "When to use different inventory methods", questions: 1 },
      {
        lo: "",
        topic: "Compute COGS or ending inventory using FIFO or LIFO",
        questions: 2,
        gap: "Note what this says: FIFO or LIFO. Weighted average is not named anywhere on the blueprint, though the practice paper has one.",
      },
      { lo: "4", topic: "Financial and tax effects of different inventory methods", questions: 2 },
      { lo: "5", topic: "Record purchase and sale of inventory", questions: 2 },
      { lo: "6", topic: "Understand lower of cost and net realizable value", questions: 1 },
    ],
  },
  {
    chapter: "Ch. 7",
    title: "Long-Term Assets",
    rows: [
      { lo: "1", topic: "Record purchase of tangible assets", questions: 1 },
      { lo: "", topic: "Record a lump-sum purchase", questions: 1 },
      { lo: "2", topic: "Characteristics of different intangible assets", questions: 2 },
      {
        lo: "3",
        topic: "Accounting treatment of subsequent expenditures",
        questions: 2,
        gap: "Two marks on capitalise-versus-expense, and the practice paper barely touches it.",
      },
      { lo: "4", topic: "Calculate depreciation or accumulated depreciation, straight-line or DDB", questions: 2 },
      {
        lo: "5",
        topic: "Calculate amortization expense and the carrying value of an intangible",
        questions: 1,
        gap: "The practice paper only asks which intangible does not amortise — never asks you to compute one.",
      },
      { lo: "6", topic: "Determine gain or loss on sale of an asset", questions: 1 },
    ],
  },
];

const ACCT_TRIAGE: TriageItem[] = [
  {
    what: "Internal control: the definitions and the components",
    marks: 3,
    minutes: 20,
    why: "The biggest single topic on the paper and pure memorisation — no calculation, no entries. Ch. 4 packet.",
  },
  {
    what: "Inventory method effects in rising prices",
    marks: 2,
    minutes: 10,
    why: "One rule covers both marks: FIFO gives higher ending inventory and higher net income, LIFO gives higher COGS and lower tax.",
  },
  {
    what: "Which intangible is which, and which one never amortises",
    marks: 2,
    minutes: 15,
    why: "Patent, copyright, trademark, franchise, goodwill. Flashcard material — goodwill is the one that doesn't amortise.",
  },
  {
    what: "Capitalise or expense a subsequent expenditure",
    marks: 2,
    minutes: 15,
    why: "One rule: extends life, adds capacity, or gets it ready to use → capitalise. Routine upkeep → expense.",
  },
  {
    what: "Depreciation: straight-line and double-declining balance",
    marks: 2,
    minutes: 20,
    why: "Two formulas. SL subtracts residual first, DDB ignores it. Units-of-production is not on the blueprint.",
  },
  {
    what: "Bank reconciliation: which side, and which needs an entry",
    marks: 2,
    minutes: 20,
    why: "Bank side: outstanding checks and deposits in transit, no entry ever. Book side: everything else, entry always.",
  },
  {
    what: "Net receivables, net revenues, cash and equivalents",
    marks: 3,
    minutes: 15,
    why: "Three subtractions. Drill tab → Statement figures.",
  },
  {
    what: "Gain or loss on a disposal",
    marks: 1,
    minutes: 10,
    why: "Cash received against BOOK VALUE, never cost. Depreciate to the sale date first.",
  },
  {
    what: "Notes receivable interest",
    marks: 1,
    minutes: 5,
    why: "Principal × rate × months/12. The rate is always annual.",
  },
  {
    what: "Lump-sum purchase allocation",
    marks: 1,
    minutes: 10,
    why: "Split by relative fair value. One percentage, one multiplication.",
  },
  {
    what: "Which inventory method suits which business, FOB terms, merchandisers",
    marks: 2,
    minutes: 10,
    why: "Definitions. FOB shipping point means title passes when it leaves the seller.",
  },
  {
    what: "What the allowance account is, and what a write-off does",
    marks: 2,
    minutes: 10,
    why: "Contra-asset, credit balance. A write-off changes neither net receivables nor net income.",
  },
  {
    what: "Executives certify the statements; cash appears on two statements",
    marks: 2,
    minutes: 5,
    why: "Two facts, two marks.",
  },
];

const ACCT_EXAM_2: ExamPlan = {
  label: "Exam 2",
  date: "2026-10-27",
  when: "Tuesday 27 October, 8:00–9:00 PM",
  where: "WTHR 200",
  covers: "Chapters 4–7 (Module 2)",
  weight: "20% of your grade",
  blueprint: ACCT_BLUEPRINT,
  triage: ACCT_TRIAGE,
  situation: [
    "Exam 2 is worth 20%, more than Exam 1's 15% — and Exam 3 is another 25%. " +
      "Most of the exam weight in this course is still ahead of you.",
    "Dr. Bokrand's review worksheet gives the exact shape of the paper: 40 " +
      "questions, exactly 10 from each chapter. No chapter is worth more than " +
      "another, so there is nothing to skip and nothing to over-invest in.",
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
      emphasis: "high",
      because:
        "Ten questions, same as every other chapter — and three of them are on " +
        "the definitions and components of internal control, the single " +
        "biggest topic on the paper.",
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
      title: "Receivables and Revenues",
      emphasis: "high",
      because:
        "Ten questions. Four of them are allowance-method mechanics, and one of " +
        "those is the aging method, which the practice paper never asks.",
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
        "Ten questions, and eight of them are computational — the chapter where the clock costs people the most.",
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
        "Ten questions spread over seven different objectives — the widest chapter on the paper, so nothing here can be skipped.",
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
        "45 min — Ch. 4 packet Activity 2: a full bank reconciliation and its journal entries. Two questions on the exam.",
        "20 min — Ch. 4 Activity 3, petty cash, and Activity 1, cash and cash equivalents.",
        "25 min — Internal control definitions and components. Three questions ride on this — the biggest single topic on the paper, and it is pure memorisation.",
      ],
    },
    {
      date: "2026-10-23",
      focus: "Chapter 5 — Receivables",
      minutes: 150,
      tasks: [
        "40 min — Packet Examples 6 and 7: the POR method and the aging method, back to back, until the difference is obvious. Four of the ten Ch. 5 marks are here.",
        "25 min — Activity 2, then redo Example 7's aging schedule from scratch. The practice exam never tests aging and the real one will.",
        "25 min — Examples 1 to 4: credit sales, discounts, returns and net revenues. Four more marks.",
        "30 min — Example 8 and Activity 3: notes receivable and the interest accrual.",
        "20 min — Write-offs and their effect on the accounting equation. One mark, and the answer is no net effect.",
      ],
    },
    {
      date: "2026-10-24",
      focus: "Chapter 6 — Inventory",
      minutes: 165,
      tasks: [
        "45 min — Examples 1 and 2 plus Activity 1: COGS and ending inventory under FIFO and LIFO. The blueprint names only these two methods.",
        "20 min — Example 3, weighted average. Lower priority: taught, but the blueprint never names it.",
        "30 min — Example 4 and Activity 4: financial statement and tax effects of each method. Two marks.",
        "30 min — Activity 2 and Example 5: recording purchases and sales, and the FIFO-to-LIFO adjustment.",
        "20 min — Activity 3, lower of cost and net realizable value.",
        "20 min — Multi-step income statement subtotals. Two marks, and operating income excludes interest and tax.",
      ],
    },
    {
      date: "2026-10-25",
      focus: "Chapter 7 — Long-term assets",
      minutes: 165,
      tasks: [
        "30 min — Example 1 and Activity 1: tangible asset cost, and the lump-sum purchase split by relative fair value.",
        "35 min — Example 2 and Activity 2: straight-line and double-declining balance. Skip Activity 3 — units-of-production is not on the blueprint.",
        "30 min — Subsequent expenditures, capitalise versus expense. Two marks, and the practice exam barely covers it.",
        "30 min — Example 3, the patent: R&D expensed, legal fees capitalised, shorter of legal and service life, part-year charge.",
        "30 min — Activity 4, a part-year disposal. Depreciate up to the sale date before computing the gain.",
        "20 min — Characteristics of the different intangibles. Two marks, straight memorisation.",
      ],
    },
    {
      date: "2026-10-26",
      focus: "Sit the practice exam, then work your errors",
      minutes: 150,
      tasks: [
        "60 min — Sit the practice exam on the Practice exam tab. Timed, no notes, paper and calculator only.",
        "40 min — Mark it, then work back through every question you missed from the packet rather than from the answer.",
        "30 min — Empty the missed pile in Drill mode.",
        "20 min — Write a one-page sheet of formulas and traps, in your own hand.",
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
      id: "aging-method",
      topic: "Ch. 5 — Aging method",
      question:
        "Tulin's Aviation uses the aging method. At 31 December:\n\n" +
        "  Credit sales during the year   $300,000\n" +
        "  Ending Accounts Receivable      $50,000\n" +
        "  Unadjusted AUA                   $1,000 Cr.\n\n" +
        "Aging schedule:\n" +
        "  1–30 days    $35,000    2% uncollectible\n" +
        "  31–60 days   $12,000   20%\n" +
        "  over 60 days  $3,000   60%\n\n" +
        "Calculate the ending AUA and record the adjusting entry.",
      answer:
        "Required ending AUA, band by band:\n" +
        "  35,000 × 2%  =   700\n" +
        "  12,000 × 20% = 2,400\n" +
        "   3,000 × 60% = 1,800\n" +
        "  Ending AUA   = 4,900\n\n" +
        "AUA already holds $1,000 credit, so the entry closes the $3,900 gap:\n\n" +
        "Dr Bad Debt Expense (BDE)   3,900\n" +
        "   Cr Allowance for Uncollectible Accounts (AUA)   3,900\n\n" +
        "  AUA T-account:\n" +
        "    Unadjusted balance   1,000\n" +
        "    Bad Debt Expense     3,900\n" +
        "    Ending AUA           4,900\n\n" +
        "Net accounts receivable = $50,000 − $4,900 = $45,100",
      trap:
        "The $300,000 of credit sales is a distractor — aging is a " +
        "percentage-of-RECEIVABLES method and never touches the sales figure. " +
        "The bands give the required ENDING balance, so the expense is whatever " +
        "closes the gap from where AUA already sits. This is Example 7 from your " +
        "Ch. 5 packet; the blueprint has a question on it and the practice exam " +
        "has none.",
    },
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
      id: "amortization-carrying",
      topic: "Ch. 7 — Intangibles and amortization",
      question:
        "From January to May, a company's R&D team spends $200,000 developing " +
        "new software. On 30 June it registers a patent, paying $7,200 cash in " +
        "legal and registration fees. The patent gives 20 years of legal " +
        "protection, but the software's service life is estimated at 8 years. " +
        "The year end is 31 December.\n\n" +
        "Record the patent, then the year-one amortization.",
      answer:
        "The $200,000 of R&D was expensed as incurred and is NOT part of the patent.\n\n" +
        "1. Record the patent — legal and registration fees only:\n\n" +
        "Dr Patent     7,200\n" +
        "   Cr Cash       7,200\n\n" +
        "2. Amortize over the SHORTER of legal life (20) and service life (8):\n" +
        "   $7,200 ÷ 8 years = $900 per year\n" +
        "   Registered 30 June, so only 6 months have run:\n" +
        "   $900 × 6/12 = $450\n\n" +
        "Dr Amortization Expense   450\n" +
        "   Cr Patent                 450\n\n" +
        "Carrying value at 31 December = $7,200 − $450 = $6,750",
      trap:
        "Three separate traps in one question, which is why it is Example 3 in " +
        "your packet: R&D is expensed and never capitalised; you amortise over " +
        "the shorter life, so 8 years and not 20; and a mid-year registration " +
        "means a part-year charge. Your blueprint asks for this calculation and " +
        "the practice exam never does.",
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
