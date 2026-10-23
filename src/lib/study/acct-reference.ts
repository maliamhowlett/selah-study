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
          "Sarbanes-Oxley (2002): the CEO and CFO must personally certify the financial statements.",
        detail:
          "It also reduced conflicts of interest, set a 7-year workpaper retention rule, and created the PCAOB. It applies to companies filing with the SEC.",
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
        point: "Replenishing petty cash records the expenses; the Petty Cash account itself does not move.",
        detail:
          "Cash returned = fund size − cash remaining. If receipts don't match that, the difference is Cash Over and Short.",
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
