// A revision reference for ACCT 20000 Exam 2.
//
// Written against Dr. Bokrand's blueprint rather than extracted from the notes
// packets — several of the highest-value topics (the internal control
// components especially) are illustrations in the PDF, so there is no text to
// pull. Where the packets did state something exactly, that wording is used:
// the three-month cash equivalent test, AUA and BDE, the POR method.
//
// Ordered by what the blueprint pays for, not by what the textbook covers.

export interface ReferencePoint {
  /** The thing to remember, stated as a claim rather than a topic. */
  point: string;
  /** Detail, an example, or the mistake it prevents. */
  detail?: string;
  /** Items that need to be seen as a set rather than read as a sentence. */
  list?: { term: string; gloss: string }[];
}

export interface ReferenceSection {
  id: string;
  chapter: string;
  title: string;
  /** Questions this section is worth on the blueprint. */
  questions: number;
  points: ReferencePoint[];
}

export const ACCT_REFERENCE: ReferenceSection[] = [
  // -------------------------------------------------------------------------
  // Chapter 8 — taken from the slide deck, in teaching order rather than
  // exam order. There is no blueprint for this one yet, so the counts are
  // omitted rather than invented; `questions` carries the number of learning
  // objectives covered instead.
  // -------------------------------------------------------------------------
  {
    id: "r8-current",
    chapter: "Ch. 8",
    title: "LO 8.1 — Current vs long-term liabilities",
    questions: 1,
    points: [
      {
        point:
          "A liability is an obligation to transfer some economic benefit in the future.",
        detail:
          "Usually cash — accounts payable, notes payable, salaries payable. But deferred revenue is a liability too, and what it owes is goods or services rather than money.",
      },
      {
        point: "Current = due within one year of the balance sheet date. Long-term = more than a year.",
      },
      {
        point:
          "Unless the operating cycle is longer than a year, in which case the cycle defines it.",
        detail:
          "The operating cycle runs from spending cash to provide goods until collecting cash from the customer. A winery with a 15-month cycle calls anything due within 15 months current.",
      },
    ],
  },
  {
    id: "r8-notes",
    chapter: "Ch. 8",
    title: "LO 8.2 — Notes payable and interest",
    questions: 1,
    points: [
      {
        point: "Interest = face value × annual rate × fraction of the year.",
        detail: "Same formula as notes RECEIVABLE in chapter 5 — only the side changes.",
      },
      {
        point:
          "Count the months inclusively. September 1 to December 31 is FOUR months, not three.",
        detail:
          "The deck flags this as Common Mistake 1: subtracting month 9 from month 12 gives three and is wrong, because both September and December count.",
      },
      {
        point: "Interest is recorded in the period it is INCURRED, not the period it is paid.",
        detail:
          "So a note signed in September needs an adjusting entry at the December year end even though no cash has moved.",
      },
      {
        point: "Line of credit: borrow up to a prearranged limit, and interest only starts when funds are drawn.",
      },
      {
        point: "Commercial paper: borrowing from another company rather than a bank, 30 to 270 days, usually a lower rate.",
      },
    ],
  },
  {
    id: "r8-payroll",
    chapter: "Ch. 8",
    title: "LO 8.3 — Payroll liabilities",
    questions: 1,
    points: [
      {
        point: "FICA is 7.65% — and BOTH sides pay it.",
        detail:
          "6.2% Social Security up to a maximum base, plus 1.45% Medicare with no maximum. Common Mistake 2 in the deck: people think only the employee pays. The employer matches it, doubling what reaches Social Security.",
      },
      {
        point: "Unemployment taxes (FUTA and SUTA) are paid by the EMPLOYER only.",
        detail:
          "Never withheld from a paycheck. This is the concept-check answer: asked which item the employer alone pays, it is unemployment tax.",
      },
      {
        point: "Withheld from the employee: income taxes, their half of FICA, their insurance and retirement contributions.",
        detail: "Withholding does not reduce Salaries Expense — the full gross pay is the expense, and the withholdings become payables.",
      },
      {
        point: "Paid on top by the employer: matching FICA, unemployment taxes, and fringe benefits.",
        detail:
          "Employer fringe benefits go to Salaries Expense; employer taxes go to Payroll Tax Expense. Two different expense accounts.",
      },
      {
        point: "A full payroll is three separate entries.",
        list: [
          { term: "Employee salary and withholdings", gloss: "Dr Salaries Expense" },
          { term: "Employer fringe benefits", gloss: "Dr Salaries Expense" },
          { term: "Employer payroll taxes", gloss: "Dr Payroll Tax Expense" },
        ],
      },
    ],
  },
  {
    id: "r8-other",
    chapter: "Ch. 8",
    title: "LO 8.4 — Other current liabilities",
    questions: 1,
    points: [
      {
        point: "Deferred Revenue is a LIABILITY, not a revenue account.",
        detail:
          "Common Mistake 3 in the deck, and the word in the title is what causes it. You owe the customer goods or services, so it is credited when cash comes in and debited as you earn it.",
      },
      {
        point: "Sales tax collected is not an expense — it is money held for the government.",
        detail:
          "Sell something for $15 with 10% tax: Cash 16.50 debited, Sales Revenue 15.00 and Sales Tax Payable 1.50 credited. Revenue is the price, never the total collected.",
      },
      {
        point:
          "The current portion of long-term debt moves to current liabilities, by reclassification rather than payment.",
        detail:
          "Dr Notes Payable (long-term) / Cr Notes Payable (short-term). Nothing is paid and no expense arises — it only changes where it sits on the balance sheet.",
      },
    ],
  },
  {
    id: "r8-contingencies",
    chapter: "Ch. 8",
    title: "LO 8.5 — Contingencies and warranties",
    questions: 1,
    points: [
      {
        point:
          "Record a contingent liability only when a loss is BOTH probable AND reasonably estimable.",
        detail:
          "Likelihood runs probable (likely) → reasonably possible (more than remote, less than probable) → remote (slight). Both tests have to pass before anything is recorded.",
      },
      {
        point: "Contingent GAINS are never recorded until the gain is certain.",
        detail:
          "In a lawsuit the defendant has a contingent liability and the plaintiff has a contingent gain — and only one of them books anything. Conservatism.",
      },
      {
        point: "Warranties are the most common contingent liability, and they take two entries at different times.",
        list: [
          { term: "At the sale, estimated", gloss: "Dr Warranty Expense / Cr Warranty Liability" },
          { term: "When repairs happen", gloss: "Dr Warranty Liability / Cr Cash" },
        ],
      },
      {
        point: "Warranty Expense and Warranty Liability are almost never equal.",
        detail:
          "Common Mistake 4. The liability goes UP by the estimate and DOWN by actual claims. Estimate 5% of $300,000 sales = $15,000, pay out $10,400, and the liability ends at $4,600 — while the expense was $15,000.",
      },
      {
        point: "Warranty expense belongs to the period of the SALE, not the period of the repair.",
      },
    ],
  },
  {
    id: "r8-liquidity",
    chapter: "Ch. 8",
    title: "LO 8.6 — Liquidity ratios",
    questions: 1,
    points: [
      {
        point: "Three measures, all about paying debts that are about to come due:",
        list: [
          { term: "Working capital", gloss: "current assets − current liabilities" },
          { term: "Current ratio", gloss: "current assets ÷ current liabilities" },
          { term: "Acid-test ratio", gloss: "quick assets ÷ current liabilities" },
        ],
      },
      {
        point:
          "Quick assets are cash, current investments and accounts receivable — and nothing else.",
        detail:
          "Inventory and prepaid rent are excluded, because they can't be turned into cash quickly. That exclusion is the whole difference between the current ratio and the acid-test.",
      },
      {
        point: "A higher current ratio is usually better, but not always.",
        detail:
          "Common Mistake 5: a company failing to collect its receivables or sitting on unsold inventory also shows a high current ratio. Both of those are problems.",
      },
      {
        point: "Working capital is a poor way to compare two different companies.",
        detail: "It is an absolute number, so size dominates. The ratios scale, which is why they compare better.",
      },
    ],
  },

  {
    id: "r-internal-control",
    chapter: "Ch. 4",
    title: "Internal control and Sarbanes-Oxley",
    questions: 4,
    points: [
      {
        point:
          "The pyramid has FOUR layers, with Information & Communication running up the side.",
        detail:
          "Bottom to top: Control Environment → Risk Assessment → Control Activities → Monitoring. Information & Communication is drawn alongside rather than stacked because it cuts across all four — it still counts as a component, which is why the framework is usually described as five.",
      },
      {
        point: "The four layers, bottom to top, with what each one is for:",
        list: [
          { term: "Control environment", gloss: "tone" },
          { term: "Risk assessment", gloss: "threats" },
          { term: "Control activities", gloss: "mitigation of threats" },
          { term: "Monitoring", gloss: "reporting / accountability" },
        ],
        detail:
          "These are your own margin notes from the packet, and they are the fastest way to hold the four apart under time pressure.",
      },
      {
        point:
          "Control ACTIVITIES are the policies and procedures that carry out management's directives.",
        detail:
          "Authorizations, reconciliations, separation of duties. This exact wording is question 1 on your practice exam.",
      },
      {
        point:
          "Internal control is a company's plans to minimize THEFT and enhance the ACCURACY of accounting information.",
        detail: "Those are the two blanks you filled in on page 2 of the packet.",
      },
      {
        point: "Section 404 of Sarbanes-Oxley requires internal controls for public corporations.",
        detail: "Corporate executives are responsible for them. Investors value them as a reason to rely on the financials.",
      },
      {
        point:
          "Sarbanes-Oxley applies ONLY to companies that file financial statements with the SEC.",
        detail:
          "Public companies. A private business is not covered — that limit is the point of the question when it gets asked.",
      },
      {
        point:
          "Sarbanes-Oxley (2002): the CEO and CFO must personally certify the financial statements.",
        detail:
          "It also reduced conflicts of interest, set a 7-year workpaper retention rule, and created the PCAOB.",
      },
      {
        point: "Preventive controls stop problems. Detective controls find them afterwards.",
        detail:
          "Preventive: separation of duties, physical controls, proper authorization. Detective: reconciliations. Exam questions usually ask which one a reconciliation is — it is detective.",
      },
      {
        point: "Separation of duties means nobody both authorizes and records the same transaction.",
        detail:
          "One person handling cash and also making the deposit is the classic weakness, as is one employee who both approves and signs checks.",
      },
      {
        point: "Internal control reduces fraud; it cannot eliminate it.",
        detail: "Collusion and management override defeat any system. Reasonable assurance, never a guarantee.",
      },
    ],
  },
  {
    id: "r-cash",
    chapter: "Ch. 4",
    title: "Cash, bank reconciliation, petty cash",
    questions: 4,
    points: [
      {
        point:
          "A cash equivalent matures in three months or less, measured at the time of purchase.",
        detail:
          "Your packet states it exactly that way. A six-month CD is a short-term investment, not cash. Receivables are not cash. Stamps are supplies.",
      },
      {
        point:
          "Bank side: deposits outstanding (add), checks outstanding (subtract), and BANK errors (either way). None of these ever gets a journal entry.",
        detail:
          "Deposits outstanding and deposits in transit are the same thing — the practice exam calls them outstanding deposits.",
      },
      {
        point:
          "Book side: service charges, NSF checks, bank collections, interest earned, and COMPANY errors. Every one of these needs a journal entry.",
        detail:
          "Two tests. Whose error was it? — whoever made it is the side that gets corrected. And: did the bank already know while you didn't? — then it is yours to record.",
      },
      {
        point:
          "You only journalise your own side. A bank error is the bank's to fix, so it adjusts the bank column and nothing else.",
        detail:
          "The practice exam asks this in reverse: the bank recorded a $1,500 deposit correctly and the bookkeeper wrote $1,400, so the COMPANY balance is the one adjusted.",
      },
      {
        point: "Both sides must finish at the same adjusted balance.",
        detail: "If they don't, something is on the wrong side.",
      },
      {
        point:
          "Petty cash expenditures are recorded as the individual expenses, crediting Cash. The Petty Cash account itself never moves.",
        detail:
          "Your packet asks why, and your answer is the reason: the fund is replenished back to its set amount, so the balance in Petty Cash is always that amount. It only changes if you resize the fund.",
      },
      {
        point: "Establishing the fund is the one entry that touches Petty Cash.",
        detail: "Dr Petty Cash Fund / Cr Cash. A voucher is a receipt.",
      },
      {
        point: "Cash is reported on the balance sheet and on the statement of cash flows.",
      },
    ],
  },
  {
    id: "r-receivables",
    chapter: "Ch. 5",
    title: "Receivables and the allowance",
    questions: 6,
    points: [
      {
        point:
          "AUA is a contra-asset with a credit normal balance. Accounts receivable less AUA is net realizable value.",
      },
      {
        point:
          "POR and aging both adjust the allowance TO a target balance. Percentage-of-sales adjusts BY an amount.",
        detail:
          "This is the most commonly lost question in the chapter. Target minus what's already there — and if the existing balance is a DEBIT you add it instead of subtracting.",
      },
      {
        point:
          "The aging method gives the required ENDING allowance. The expense is whatever closes the gap.",
        detail:
          "Multiply each age band by its rate, total them — that total is the ending AUA, not the entry.",
      },
      {
        point:
          "A write-off changes neither net receivables nor net income.",
        detail:
          "Dr AUA / Cr Accounts Receivable. Both move by the same amount so net is unchanged, and the expense was already recorded when the allowance was estimated.",
      },
      {
        point:
          "A leftover CREDIT balance in AUA at year end means the estimate was too high; a debit balance means too low.",
      },
      {
        point: "Interest = principal × annual rate × months ÷ 12.",
        detail: "The rate is always annual unless told otherwise. Read which period is being asked about.",
      },
      {
        point: "2/10, n/30 means 2% off within 10 days, otherwise the full amount in 30.",
        detail:
          "Count the days — paying on day 17 gets no discount, and that is usually the whole question. Sales Discounts and Sales Returns are contra-revenue, so both carry debits.",
      },
    ],
  },
  {
    id: "r-inventory",
    chapter: "Ch. 6",
    title: "Inventory and cost of goods sold",
    questions: 6,
    points: [
      {
        point:
          "In rising prices: FIFO gives higher ending inventory and higher net income. LIFO gives higher COGS, lower income, lower tax.",
        detail: "One rule, two questions. If prices are falling, everything flips.",
      },
      {
        point: "Goods available for sale = beginning inventory + purchases. It is the control total.",
        detail: "Ending inventory + COGS must come back to it. Work it out first and you can check yourself.",
      },
      {
        point: "FIFO leaves the newest units in inventory; LIFO leaves the oldest.",
        detail: "Your blueprint names only FIFO and LIFO. Weighted average is taught but not listed.",
      },
      {
        point: "Weighted average = total cost ÷ total units.",
        detail: "Average the totals, never the three unit prices.",
      },
      {
        point: "Lower of cost and NRV only ever writes inventory DOWN, through COGS.",
        detail: "If NRV is above cost you do nothing.",
      },
      {
        point: "Freight-IN is capitalized into Inventory. Freight-OUT is an expense.",
        detail: "Freight-out never touches inventory — it goes to selling expense or COGS.",
      },
      {
        point: "FOB shipping point: title passes when it leaves the seller. FOB destination: when it arrives.",
        detail: "Decides who owns goods in transit at year end, and who pays the freight.",
      },
      {
        point:
          "Multi-step order: net sales → gross profit → operating income → income before tax → net income.",
        detail:
          "Interest expense and income tax are NOT operating expenses. Subtracting them above the operating income line is the standard way that question is lost.",
      },
    ],
  },
  {
    id: "r-longterm",
    chapter: "Ch. 7",
    title: "Long-term assets",
    questions: 6,
    points: [
      {
        point:
          "Capitalize anything that extends useful life, adds capacity, or was needed to get the asset ready for use.",
        detail:
          "Freight-in, installation, testing, back taxes owed by the seller, a new engine. Routine repairs and repainting are expensed however large.",
      },
      {
        point: "Straight-line subtracts residual first: (cost − residual) ÷ life.",
      },
      {
        point: "Double-declining balance IGNORES residual in the formula. Rate = 2 ÷ life, applied to book value.",
        detail:
          "You stop once book value reaches residual, but you never subtract it in the calculation. Subtracting it first is the distractor on every DDB question.",
      },
      {
        point: "A lump-sum purchase splits by RELATIVE fair value.",
        detail:
          "Each asset's appraisal ÷ total appraisals × price paid. Recording the appraisal figure itself ignores what was paid.",
      },
      {
        point: "On a disposal, compare proceeds to BOOK VALUE, never to cost.",
        detail: "And depreciate up to the sale date first — a part-year disposal is where this goes wrong.",
      },
      {
        point: "Amortize an intangible over the SHORTER of its legal life and its service life.",
        detail: "A 20-year patent with an 8-year service life amortizes over 8.",
      },
      {
        point: "Goodwill has an indefinite life and is never amortized — it is tested for impairment.",
      },
      {
        point: "R&D is expensed as incurred. Only the legal and registration fees of a patent are capitalized.",
        detail: "Management's confidence about future benefit changes nothing.",
      },
      {
        point: "Patent 20 years; copyright much longer; trademark a name or symbol; franchise a contractual right.",
      },
    ],
  },
];
