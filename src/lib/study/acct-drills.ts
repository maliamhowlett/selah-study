// Rapid-fire mechanics for ACCT 20000. Separate from the multi-step problems
// in plans.ts, because these train a different thing: not "can you reason
// through a scenario" but "can you produce the entry without stalling".
//
// Chapters 1–3 are included even though they aren't on Exam 2. Everything in
// chapters 4–7 is examined through these same entries, so a slow debit/credit
// is a slow answer to every question on the paper.

export interface EntryLine {
  account: string;
  debit?: number;
  credit?: number;
}

export interface JournalDrill {
  id: string;
  chapter: string;
  prompt: string;
  entry: EntryLine[];
  /** One line on the reasoning, shown with the answer. */
  note?: string;
}

export const JOURNAL_DRILLS: JournalDrill[] = [
  // --- Chapters 1–3: the mechanics everything else is built on ---
  {
    id: "d-prepaid-pay",
    chapter: "Ch. 1–3",
    prompt:
      "On 1 January the company pays $2,400 cash for a twelve-month insurance policy. Record the payment.",
    entry: [
      { account: "Prepaid Insurance", debit: 2400 },
      { account: "Cash", credit: 2400 },
    ],
    note: "Nothing has been used up yet, so this buys an asset rather than incurring an expense.",
  },
  {
    id: "d-prepaid-adjust",
    chapter: "Ch. 1–3",
    prompt: "One month later, record the adjusting entry for that insurance policy.",
    entry: [
      { account: "Insurance Expense", debit: 200 },
      { account: "Prepaid Insurance", credit: 200 },
    ],
    note: "$2,400 ÷ 12 months = $200 used up.",
  },
  {
    id: "d-accrued-wages",
    chapter: "Ch. 1–3",
    prompt:
      "At period end employees have earned $3,500 of wages that will not be paid until next month. Record the adjustment.",
    entry: [
      { account: "Salaries Expense", debit: 3500 },
      { account: "Salaries Payable", credit: 3500 },
    ],
    note: "The expense belongs to the period it was earned in, not the period it is paid in.",
  },
  {
    id: "d-deferred-receive",
    chapter: "Ch. 1–3",
    prompt: "The company receives $6,000 cash in advance for services it has not yet performed.",
    entry: [
      { account: "Cash", debit: 6000 },
      { account: "Deferred Revenue", credit: 6000 },
    ],
    note: "Deferred Revenue is a liability — you owe the work, not the money.",
  },
  {
    id: "d-deferred-earn",
    chapter: "Ch. 1–3",
    prompt: "By year end $4,000 of those services have been performed. Record the adjustment.",
    entry: [
      { account: "Deferred Revenue", debit: 4000 },
      { account: "Service Revenue", credit: 4000 },
    ],
  },
  {
    id: "d-service-account",
    chapter: "Ch. 1–3",
    prompt: "The company performs $5,000 of services on account.",
    entry: [
      { account: "Accounts Receivable", debit: 5000 },
      { account: "Service Revenue", credit: 5000 },
    ],
  },

  // --- Chapter 4: cash and internal controls ---
  {
    id: "d-service-charge",
    chapter: "Ch. 4",
    prompt: "The bank statement shows a $45 service charge. Record the entry required.",
    entry: [
      { account: "Service Fee Expense", debit: 45 },
      { account: "Cash", credit: 45 },
    ],
    note: "A book-side reconciling item, so it needs an entry. Bank-side items never do.",
  },
  {
    id: "d-nsf",
    chapter: "Ch. 4",
    prompt: "A customer's $600 check is returned by the bank marked NSF.",
    entry: [
      { account: "Accounts Receivable", debit: 600 },
      { account: "Cash", credit: 600 },
    ],
    note: "The customer still owes you — the receivable comes back to life.",
  },
  {
    id: "d-interest-earned",
    chapter: "Ch. 4",
    prompt: "The bank credits $80 of interest earned on the account balance.",
    entry: [
      { account: "Cash", debit: 80 },
      { account: "Interest Revenue", credit: 80 },
    ],
  },
  {
    id: "d-petty-establish",
    chapter: "Ch. 4",
    prompt: "Establish a $300 petty cash fund.",
    entry: [
      { account: "Petty Cash", debit: 300 },
      { account: "Cash", credit: 300 },
    ],
  },
  {
    id: "d-petty-replenish",
    chapter: "Ch. 4",
    prompt:
      "A $225 petty cash fund has been used for an office lunch of $75 and a notary fee of $10. Record the expenditures.",
    entry: [
      { account: "Office Meals", debit: 75 },
      { account: "Professional Fees", debit: 10 },
      { account: "Cash", credit: 85 },
    ],
    note:
      "This is Activity 3 from your Ch. 4 packet. The expenses are recorded individually and Cash is credited — Petty Cash is not touched, because the fund gets replenished back to $225 either way.",
  },

  // --- Chapter 5: receivables ---
  {
    id: "d-allowance-estimate",
    chapter: "Ch. 5",
    prompt:
      "Accounts Receivable is $80,000. The Allowance for Uncollectible Accounts has a $1,200 CREDIT balance before adjustment. Estimate 6% of receivables uncollectible.",
    entry: [
      { account: "Bad Debt Expense", debit: 3600 },
      { account: "Allowance for Uncollectible Accounts (AUA)", credit: 3600 },
    ],
    note:
      "Target $4,800, already $1,200 there, so the entry is the $3,600 difference. Your packet calls this the POR (percentage-of-receivables) method, and writes the accounts as BDE and AUA.",
  },
  {
    id: "d-allowance-debit-start",
    chapter: "Ch. 5",
    prompt:
      "Same facts, but the allowance has a $1,200 DEBIT balance before adjustment. Record the adjusting entry.",
    entry: [
      { account: "Bad Debt Expense", debit: 6000 },
      { account: "Allowance for Uncollectible Accounts", credit: 6000 },
    ],
    note:
      "You still need to land on $4,800 credit, but you are starting $1,200 the wrong side of zero: 4,800 + 1,200.",
  },
  {
    id: "d-writeoff",
    chapter: "Ch. 5",
    prompt: "A $900 account is determined to be uncollectible. Record the write-off.",
    entry: [
      { account: "Allowance for Uncollectible Accounts", debit: 900 },
      { account: "Accounts Receivable", credit: 900 },
    ],
    note: "No expense here — it was already recorded when the allowance was estimated.",
  },
  {
    id: "d-recovery",
    chapter: "Ch. 5",
    prompt:
      "A customer unexpectedly pays $400 on an account written off last year. Record both entries.",
    entry: [
      { account: "Accounts Receivable", debit: 400 },
      { account: "Allowance for Uncollectible Accounts", credit: 400 },
      { account: "Cash", debit: 400 },
      { account: "Accounts Receivable", credit: 400 },
    ],
    note: "Reverse the write-off first, then record the collection normally.",
  },
  {
    id: "d-note-interest",
    chapter: "Ch. 5",
    prompt:
      "The company holds a $10,000, 6%, three-month note receivable. Two months have passed at year end. Record the accrued interest.",
    entry: [
      { account: "Interest Receivable", debit: 100 },
      { account: "Interest Revenue", credit: 100 },
    ],
    note: "$10,000 × 6% × 2/12 = $100. The rate is always annual unless told otherwise.",
  },
  {
    id: "d-sales-discount",
    chapter: "Ch. 5",
    prompt:
      "A $4,000 sale was made on terms 2/10, n/30. The customer pays within the discount period.",
    entry: [
      { account: "Cash", debit: 3920 },
      { account: "Sales Discounts", debit: 80 },
      { account: "Accounts Receivable", credit: 4000 },
    ],
    note: "2% of $4,000 = $80. Sales Discounts is contra-revenue, so it carries a debit.",
  },

  // --- Chapter 6: inventory ---
  {
    id: "d-purchase-inventory",
    chapter: "Ch. 6",
    prompt: "Purchase $12,000 of inventory on account. Perpetual system.",
    entry: [
      { account: "Inventory", debit: 12000 },
      { account: "Accounts Payable", credit: 12000 },
    ],
    note: "Under perpetual there is no Purchases account — inventory is hit directly.",
  },
  {
    id: "d-sale-perpetual",
    chapter: "Ch. 6",
    prompt:
      "Sell inventory on account for $9,000. It cost $5,400. Perpetual system — record both entries.",
    entry: [
      { account: "Accounts Receivable", debit: 9000 },
      { account: "Sales Revenue", credit: 9000 },
      { account: "Cost of Goods Sold", debit: 5400 },
      { account: "Inventory", credit: 5400 },
    ],
    note: "Every perpetual sale is two entries. Forgetting the second one is a common slip.",
  },
  {
    id: "d-freight-in",
    chapter: "Ch. 6",
    prompt: "Pay $400 cash freight to have purchased inventory delivered. Perpetual system.",
    entry: [
      { account: "Inventory", debit: 400 },
      { account: "Cash", credit: 400 },
    ],
    note: "Freight-IN is a cost of getting the goods ready to sell, so it is capitalized into inventory.",
  },
  {
    id: "d-fifo-lifo-adjust",
    chapter: "Ch. 6",
    prompt:
      "A company tracks inventory internally on FIFO but reports on LIFO. At 31 December, ending inventory is $2,800 under FIFO and would be $1,800 under LIFO. Record the adjustment.",
    entry: [
      { account: "Cost of Goods Sold", debit: 1000 },
      { account: "Inventory", credit: 1000 },
    ],
    note:
      "This is Example 5 from your Ch. 6 notes packet. LIFO inventory is lower, so inventory comes down $1,000 and the difference lands in COGS.",
  },
  {
    id: "d-freight-out",
    chapter: "Ch. 6",
    prompt: "Pay $500 cash to ship goods OUT to a customer.",
    entry: [
      { account: "Selling Expense", debit: 500 },
      { account: "Cash", credit: 500 },
    ],
    note:
      "Freight-OUT is an expense — either selling expense or COGS — and never touches Inventory. Freight-IN is capitalized into Inventory. Your packet puts these side by side for a reason.",
  },
  {
    id: "d-purchase-return",
    chapter: "Ch. 6",
    prompt: "Return $1,500 of damaged inventory bought on account to the supplier.",
    entry: [
      { account: "Accounts Payable", debit: 1500 },
      { account: "Inventory", credit: 1500 },
    ],
    note: "Purchase returns are recorded directly against Inventory under perpetual — there is no separate returns account on the buyer's side.",
  },
  {
    id: "d-lcnrv",
    chapter: "Ch. 6",
    prompt:
      "Inventory costing $12,000 has a net realizable value of $10,500. Record the write-down.",
    entry: [
      { account: "Cost of Goods Sold", debit: 1500 },
      { account: "Inventory", credit: 1500 },
    ],
  },

  // --- Chapter 7: long-term assets ---
  {
    id: "d-asset-cost",
    chapter: "Ch. 7",
    prompt:
      "Buy a machine for $60,000 cash, plus $3,000 freight and $2,000 installation and testing.",
    entry: [
      { account: "Equipment", debit: 65000 },
      { account: "Cash", credit: 65000 },
    ],
    note:
      "Everything needed to get the asset ready for its intended use is capitalized into one figure.",
  },
  {
    id: "d-straight-line",
    chapter: "Ch. 7",
    prompt:
      "Record one year of straight-line depreciation. Cost $50,000, salvage $5,000, five-year life.",
    entry: [
      { account: "Depreciation Expense", debit: 9000 },
      { account: "Accumulated Depreciation", credit: 9000 },
    ],
    note: "($50,000 − $5,000) ÷ 5 = $9,000. Never credit the asset account directly.",
  },
  {
    id: "d-disposal-loss",
    chapter: "Ch. 7",
    prompt:
      "Sell equipment for $9,000 cash. It cost $40,000 and has $28,000 of accumulated depreciation.",
    entry: [
      { account: "Cash", debit: 9000 },
      { account: "Accumulated Depreciation", debit: 28000 },
      { account: "Loss on Sale of Equipment", debit: 3000 },
      { account: "Equipment", credit: 40000 },
    ],
    note: "Book value $12,000 against $9,000 received — a $3,000 loss. Clear out the accumulated depreciation.",
  },
  {
    id: "d-capitalize-engine",
    chapter: "Ch. 7",
    prompt:
      "Pay $18,000 cash to replace the engine in a delivery truck, extending its useful life by three years.",
    entry: [
      { account: "Equipment", debit: 18000 },
      { account: "Cash", credit: 18000 },
    ],
    note:
      "Extends useful life, so it is capitalized into the asset — not Repairs and Maintenance Expense. Two questions on the blueprint ride on this distinction.",
  },
  {
    id: "d-lump-sum",
    chapter: "Ch. 7",
    prompt:
      "Pay $300,000 cash for land and a building together. Appraisals value the land at $120,000 and the building at $280,000.",
    entry: [
      { account: "Land", debit: 90000 },
      { account: "Building", debit: 210000 },
      { account: "Cash", credit: 300000 },
    ],
    note:
      "Appraisals total $400,000. Land is 120/400 = 30% → $90,000; building 280/400 = 70% → $210,000. Split by RELATIVE fair value, never by the appraisal figures themselves.",
  },
  {
    id: "d-aging-adjust",
    chapter: "Ch. 5",
    prompt:
      "An aging schedule puts the required allowance at $16,400. The Allowance for Uncollectible Accounts currently has a $2,000 credit balance. Record the adjustment.",
    entry: [
      { account: "Bad Debt Expense", debit: 14400 },
      { account: "Allowance for Uncollectible Accounts", credit: 14400 },
    ],
    note:
      "Aging gives the required ENDING balance. The expense is whatever closes the gap: 16,400 − 2,000.",
  },
  {
    id: "d-repairs",
    chapter: "Ch. 7",
    prompt: "Pay $1,200 cash for routine maintenance on a delivery truck.",
    entry: [
      { account: "Repairs and Maintenance Expense", debit: 1200 },
      { account: "Cash", credit: 1200 },
    ],
    note: "Routine upkeep is expensed however large the bill. Only improvements get capitalized.",
  },
  {
    id: "d-patent-rd",
    chapter: "Ch. 7",
    prompt:
      "An R&D team spends $200,000 developing new software. On 30 June the company then pays $7,200 cash in legal and registration fees to patent it. Record the patent.",
    entry: [
      { account: "Patent", debit: 7200 },
      { account: "Cash", credit: 7200 },
    ],
    note:
      "Only the $7,200 is capitalized. The $200,000 of R&D was expensed as incurred — it never becomes part of the patent. This is Example 3 from your Ch. 7 packet.",
  },
  {
    id: "d-patent-amortize",
    chapter: "Ch. 7",
    prompt:
      "That $7,200 patent was registered on 30 June. Legal protection runs 20 years but the software's service life is estimated at 8 years. Record amortization at the 31 December year end.",
    entry: [
      { account: "Amortization Expense", debit: 450 },
      { account: "Patent", credit: 450 },
    ],
    note:
      "Amortize over the SHORTER of legal life and service life — 8 years, not 20. $7,200 ÷ 8 = $900 a year, and only six months have run: $900 × 6/12 = $450.",
  },
  {
    id: "d-disposal-partial-year",
    chapter: "Ch. 7",
    prompt:
      "Equipment costing $35,000 was bought on 1 Jan 2023. Seven-year life, no residual, straight-line, December year end. It is sold on 30 June 2025 for $28,000. Record the depreciation in the year of sale, then the disposal.",
    entry: [
      { account: "Depreciation Expense", debit: 2500 },
      { account: "Accumulated Depreciation", credit: 2500 },
      { account: "Cash", debit: 28000 },
      { account: "Accumulated Depreciation", debit: 12500 },
      { account: "Equipment", credit: 35000 },
      { account: "Gain on Sale of Equipment", credit: 5500 },
    ],
    note:
      "$35,000 ÷ 7 = $5,000 a year. 2023 and 2024 give $10,000, plus six months of 2025 = $2,500, so accumulated is $12,500 and book value is $22,500. Sold for $28,000 → a $5,500 gain. Skipping the half-year of depreciation is what makes this one go wrong.",
  },
  {
    id: "d-amortization",
    chapter: "Ch. 7",
    prompt: "Record one year of amortization on a patent costing $20,000 with a ten-year useful life.",
    entry: [
      { account: "Amortization Expense", debit: 2000 },
      { account: "Patent", credit: 2000 },
    ],
    note: "Intangibles are usually credited directly rather than through a contra account.",
  },
];

// ---------------------------------------------------------------------------

export type Statement = "Balance sheet" | "Income statement";

export interface ClassificationDrill {
  id: string;
  account: string;
  statement: Statement;
  /** Where on that statement it sits. */
  section: string;
  normalBalance: "Debit" | "Credit";
  note?: string;
}

export const CLASSIFICATION_DRILLS: ClassificationDrill[] = [
  {
    id: "c-ar",
    account: "Accounts Receivable",
    statement: "Balance sheet",
    section: "Current assets",
    normalBalance: "Debit",
  },
  {
    id: "c-allowance",
    account: "Allowance for Uncollectible Accounts",
    statement: "Balance sheet",
    section: "Current assets — contra, shown as a deduction from Accounts Receivable",
    normalBalance: "Credit",
    note: "Receivables less the allowance is net realizable value, which is what appears on the face of the statement.",
  },
  {
    id: "c-inventory",
    account: "Inventory",
    statement: "Balance sheet",
    section: "Current assets",
    normalBalance: "Debit",
  },
  {
    id: "c-prepaid",
    account: "Prepaid Insurance",
    statement: "Balance sheet",
    section: "Current assets",
    normalBalance: "Debit",
  },
  {
    id: "c-petty",
    account: "Petty Cash",
    statement: "Balance sheet",
    section: "Current assets — part of cash",
    normalBalance: "Debit",
  },
  {
    id: "c-equipment",
    account: "Equipment",
    statement: "Balance sheet",
    section: "Property, plant and equipment",
    normalBalance: "Debit",
  },
  {
    id: "c-accum-dep",
    account: "Accumulated Depreciation",
    statement: "Balance sheet",
    section: "Property, plant and equipment — contra",
    normalBalance: "Credit",
    note: "Cost less accumulated depreciation is book value. The asset account itself is never reduced.",
  },
  {
    id: "c-patent",
    account: "Patent",
    statement: "Balance sheet",
    section: "Intangible assets",
    normalBalance: "Debit",
  },
  {
    id: "c-ap",
    account: "Accounts Payable",
    statement: "Balance sheet",
    section: "Current liabilities",
    normalBalance: "Credit",
  },
  {
    id: "c-deferred",
    account: "Deferred Revenue",
    statement: "Balance sheet",
    section: "Current liabilities",
    normalBalance: "Credit",
    note: "A liability despite the word revenue — you owe the work.",
  },
  {
    id: "c-salaries-payable",
    account: "Salaries Payable",
    statement: "Balance sheet",
    section: "Current liabilities",
    normalBalance: "Credit",
  },
  {
    id: "c-common-stock",
    account: "Common Stock",
    statement: "Balance sheet",
    section: "Stockholders' equity",
    normalBalance: "Credit",
  },
  {
    id: "c-retained",
    account: "Retained Earnings",
    statement: "Balance sheet",
    section: "Stockholders' equity",
    normalBalance: "Credit",
  },
  {
    id: "c-cogs",
    account: "Cost of Goods Sold",
    statement: "Income statement",
    section: "Expense — subtracted from net sales to give gross profit",
    normalBalance: "Debit",
  },
  {
    id: "c-sales-discounts",
    account: "Sales Discounts",
    statement: "Income statement",
    section: "Contra-revenue — deducted to give net sales",
    normalBalance: "Debit",
    note: "Contra-revenue, so a debit, even though it lives in the revenue section.",
  },
  {
    id: "c-bad-debt",
    account: "Bad Debt Expense",
    statement: "Income statement",
    section: "Operating expense",
    normalBalance: "Debit",
  },
  {
    id: "c-dep-expense",
    account: "Depreciation Expense",
    statement: "Income statement",
    section: "Operating expense",
    normalBalance: "Debit",
    note: "Easy to confuse with Accumulated Depreciation, which is the balance sheet contra account.",
  },
  {
    id: "c-cash-equivalents",
    account: "Cash Equivalents",
    statement: "Balance sheet",
    section: "Current assets — combined with cash as 'Cash and cash equivalents'",
    normalBalance: "Debit",
    note: "Investments maturing in three months or less. Cash also drives the statement of cash flows — the blueprint has a question on where cash is reported.",
  },
  {
    id: "c-sales-returns",
    account: "Sales Returns and Allowances",
    statement: "Income statement",
    section: "Contra-revenue — deducted to give net sales",
    normalBalance: "Debit",
  },
  {
    id: "c-gain-sale",
    account: "Gain on Sale of Equipment",
    statement: "Income statement",
    section: "Other revenue, below operating income",
    normalBalance: "Credit",
    note: "Below operating income, so it does not change operating income — a favorite trap on multi-step income statement questions.",
  },
  {
    id: "c-loss-sale",
    account: "Loss on Sale of Equipment",
    statement: "Income statement",
    section: "Other expense, below operating income",
    normalBalance: "Debit",
  },
];

/** Every chapter present in the drills, in the order they are taught. */
export const DRILL_CHAPTERS = [...new Set(JOURNAL_DRILLS.map((d) => d.chapter))];

// ---------------------------------------------------------------------------
// Statement subtotals.
//
// The Connect homework asks for whole statements; the exam is forty multiple
// choice, so it asks for one number out of a statement — net sales, gross
// profit, operating income, net receivables, cash and cash equivalents. That
// is five questions on the blueprint, it is pure arithmetic, and none of it needs
// a journal entry.
// ---------------------------------------------------------------------------

export interface StatementDrill {
  id: string;
  chapter: string;
  /** The data, shown as a block above the question. */
  scenario: string;
  question: string;
  answer: number;
  working: string;
  trap?: string;
}

const MULTI_STEP = `  Sales revenue                   $520,000
  Sales returns and allowances      15,000
  Sales discounts                    5,000
  Cost of goods sold               300,000
  Salaries expense                  70,000
  Rent expense                      36,000
  Depreciation expense              14,000
  Interest expense                   8,000
  Income tax expense                20,000`;

export const STATEMENT_DRILLS: StatementDrill[] = [
  {
    id: "s-net-sales",
    chapter: "Ch. 6",
    scenario: MULTI_STEP,
    question: "What is net sales?",
    answer: 500000,
    working:
      "  Sales revenue              520,000\n" +
      "  Less returns & allowances  (15,000)\n" +
      "  Less sales discounts        (5,000)\n" +
      "  Net sales                  500,000",
    trap:
      "Returns and discounts are contra-revenue — they come off the top before anything else happens.",
  },
  {
    id: "s-gross-profit",
    chapter: "Ch. 6",
    scenario: MULTI_STEP,
    question: "What is gross profit?",
    answer: 200000,
    working:
      "  Net sales      500,000\n" +
      "  Less COGS     (300,000)\n" +
      "  Gross profit   200,000",
    trap:
      "Gross profit uses NET sales, not the $520,000 headline. Only cost of goods sold comes off here — no operating expenses yet.",
  },
  {
    id: "s-operating-income",
    chapter: "Ch. 6",
    scenario: MULTI_STEP,
    question: "What is operating income?",
    answer: 80000,
    working:
      "  Gross profit            200,000\n" +
      "  Less salaries            (70,000)\n" +
      "  Less rent                (36,000)\n" +
      "  Less depreciation        (14,000)\n" +
      "  Operating income         80,000",
    trap:
      "Interest expense and income tax are NOT operating expenses — they sit below this line. Subtracting them here is the single most common mistake on this question.",
  },
  {
    id: "s-net-income",
    chapter: "Ch. 6",
    scenario: MULTI_STEP,
    question: "What is net income?",
    answer: 52000,
    working:
      "  Operating income      80,000\n" +
      "  Less interest expense (8,000)\n" +
      "  Income before tax     72,000\n" +
      "  Less income tax      (20,000)\n" +
      "  Net income            52,000",
    trap: "Interest first, then tax. Income before tax is a subtotal they can ask for on its own.",
  },
  {
    id: "s-net-revenues",
    chapter: "Ch. 5",
    scenario: `  Sales revenue                   $250,000
  Sales returns and allowances      12,000
  Sales discounts                    5,000`,
    question: "What are net revenues?",
    answer: 233000,
    working: "  250,000 − 12,000 − 5,000 = 233,000",
    trap:
      "Both contra-revenue accounts come off. Your blueprint has this as its own question in Ch. 5.",
  },
  {
    id: "s-net-ar",
    chapter: "Ch. 5",
    scenario: `  Accounts receivable                        $90,000
  Allowance for uncollectible accounts         6,500 Cr.`,
    question: "What is net accounts receivable?",
    answer: 83500,
    working: "  90,000 − 6,500 = 83,500",
    trap:
      "Net realizable value — what you actually expect to collect. This is the figure that appears on the balance sheet, not the gross $90,000.",
  },
  {
    id: "s-cash-equivalents",
    chapter: "Ch. 4",
    scenario: `  Checking account                     $12,400
  Petty cash                               300
  Treasury bill, matures in 60 days      5,000
  Certificate of deposit, 6-month       10,000
  Accounts receivable                    8,000
  Postage stamps on hand                    75`,
    question: "What is reported as cash and cash equivalents?",
    answer: 17700,
    working:
      "  Checking account        12,400\n" +
      "  Petty cash                 300\n" +
      "  60-day Treasury bill     5,000\n" +
      "  Cash & equivalents      17,700",
    trap:
      "A cash equivalent matures in THREE MONTHS OR LESS, so the 6-month CD is a short-term investment instead. Receivables are not cash, and stamps are supplies.",
  },
];

// ---------------------------------------------------------------------------
// Account vocabulary.
//
// The full journal-entry drills ask two things at once: which accounts, and
// which side. When almost every miss comes back as "wrong accounts" rather
// than "wrong posting", the second question is not the problem and asking both
// at once just hides that.
//
// These ask one account at a time. It is a vocabulary problem, and vocabulary
// is the fastest kind of gap to close.
// ---------------------------------------------------------------------------

export interface AccountDrill {
  id: string;
  chapter: string;
  /** The situation in ordinary words, never naming the account. */
  situation: string;
  account: string;
  side: "Debit" | "Credit";
  why?: string;
}

export const ACCOUNT_DRILLS: AccountDrill[] = [
  // Ch. 1–3 — the ones underneath everything else
  {
    id: "a-prepaid",
    chapter: "Ch. 1–3",
    situation: "The company pays cash now for twelve months of insurance it hasn't used yet.",
    account: "Prepaid Insurance",
    side: "Debit",
    why: "Unused insurance is still something of value you hold — an asset. It only becomes an expense as the months pass.",
  },
  {
    id: "a-insurance-exp",
    chapter: "Ch. 1–3",
    situation: "One month of that insurance has now been used up.",
    account: "Insurance Expense",
    side: "Debit",
    why: "The used-up portion moves out of the asset and into an expense.",
  },
  {
    id: "a-salaries-payable",
    chapter: "Ch. 1–3",
    situation: "Employees have earned wages the company hasn't paid yet. What do you credit?",
    account: "Salaries Payable",
    side: "Credit",
    why: "Owed but unpaid is a liability. The matching debit is Salaries Expense.",
  },
  {
    id: "a-salaries-expense",
    chapter: "Ch. 1–3",
    situation: "Same situation — employees earned wages not yet paid. What do you debit?",
    account: "Salaries Expense",
    side: "Debit",
    why: "The cost belongs to the period the work was done in, not the period it gets paid in.",
  },
  {
    id: "a-deferred",
    chapter: "Ch. 1–3",
    situation: "A customer pays cash up front for work the company hasn't done yet.",
    account: "Deferred Revenue",
    side: "Credit",
    why: "A liability despite the word revenue — you owe the work, not the money.",
  },
  {
    id: "a-ar",
    chapter: "Ch. 1–3",
    situation: "The company finishes a job and the customer will pay next month.",
    account: "Accounts Receivable",
    side: "Debit",
    why: "A promise to be paid is an asset.",
  },
  {
    id: "a-service-rev",
    chapter: "Ch. 1–3",
    situation: "That job is complete, so the company has earned the income.",
    account: "Service Revenue",
    side: "Credit",
    why: "Revenue increases with a credit. Earned is what matters, not paid.",
  },

  // Ch. 4
  {
    id: "a-service-fee",
    chapter: "Ch. 4",
    situation: "The bank takes a monthly fee out of the account.",
    account: "Service Fee Expense",
    side: "Debit",
    why: "A cost of banking. Book-side reconciling item, so it needs an entry.",
  },
  {
    id: "a-nsf",
    chapter: "Ch. 4",
    situation: "A customer's check bounces. What comes back onto the books?",
    account: "Accounts Receivable",
    side: "Debit",
    why: "They still owe you — the receivable comes back to life, and Cash is credited.",
  },
  {
    id: "a-interest-rev",
    chapter: "Ch. 4",
    situation: "The bank pays the company interest on its balance.",
    account: "Interest Revenue",
    side: "Credit",
  },
  {
    id: "a-petty",
    chapter: "Ch. 4",
    situation: "The company sets aside a small amount of cash in the office for minor costs.",
    account: "Petty Cash",
    side: "Debit",
    why: "Only touched when the fund is set up or resized — never when it is replenished.",
  },

  // Ch. 5
  {
    id: "a-aua",
    chapter: "Ch. 5",
    situation: "The company estimates how much of its receivables will never be collected.",
    account: "Allowance for Uncollectible Accounts",
    side: "Credit",
    why: "AUA — a contra-asset sitting against Accounts Receivable, so it carries a credit.",
  },
  {
    id: "a-bde",
    chapter: "Ch. 5",
    situation: "The cost of making that estimate, on the income statement.",
    account: "Bad Debt Expense",
    side: "Debit",
    why: "BDE. Expenses increase with debits.",
  },
  {
    id: "a-sales-discount",
    chapter: "Ch. 5",
    situation: "A customer pays early and takes 2% off under 2/10, n/30.",
    account: "Sales Discounts",
    side: "Debit",
    why: "Contra-revenue — it reduces revenue, so it carries a debit.",
  },
  {
    id: "a-sales-returns",
    chapter: "Ch. 5",
    situation: "A customer sends goods back because they were defective.",
    account: "Sales Returns and Allowances",
    side: "Debit",
    why: "Also contra-revenue. You don't reverse Sales Revenue directly.",
  },
  {
    id: "a-notes-receivable",
    chapter: "Ch. 5",
    situation: "Someone signs a formal written promise to repay the company with interest.",
    account: "Notes Receivable",
    side: "Debit",
  },
  {
    id: "a-interest-receivable",
    chapter: "Ch. 5",
    situation: "Interest on that note has been earned but not yet received.",
    account: "Interest Receivable",
    side: "Debit",
    why: "Earned and owed to you — an asset, same logic as Accounts Receivable.",
  },

  // Ch. 6
  {
    id: "a-inventory",
    chapter: "Ch. 6",
    situation: "The company buys goods intending to resell them.",
    account: "Inventory",
    side: "Debit",
    why: "Under perpetual there is no Purchases account — it goes straight to Inventory.",
  },
  {
    id: "a-cogs",
    chapter: "Ch. 6",
    situation: "Those goods are sold, and their cost has to be recorded.",
    account: "Cost of Goods Sold",
    side: "Debit",
    why: "COGS. The second of the two entries every perpetual sale needs.",
  },
  {
    id: "a-ap",
    chapter: "Ch. 6",
    situation: "The company owes a supplier for inventory bought on account.",
    account: "Accounts Payable",
    side: "Credit",
  },
  {
    id: "a-selling-expense",
    chapter: "Ch. 6",
    situation: "The company pays to ship goods OUT to a customer.",
    account: "Selling Expense",
    side: "Debit",
    why: "Freight-out is an expense and never touches Inventory. Freight-IN does.",
  },

  // Ch. 7
  {
    id: "a-equipment",
    chapter: "Ch. 7",
    situation: "A machine is bought, including its freight and installation.",
    account: "Equipment",
    side: "Debit",
    why: "Everything needed to get it ready for use is capitalized into one figure.",
  },
  {
    id: "a-accum-dep",
    chapter: "Ch. 7",
    situation: "All the depreciation recorded on an asset since it was bought.",
    account: "Accumulated Depreciation",
    side: "Credit",
    why: "A contra-asset. You never credit the asset account itself for depreciation.",
  },
  {
    id: "a-dep-expense",
    chapter: "Ch. 7",
    situation: "This year's share of an asset's cost, on the income statement.",
    account: "Depreciation Expense",
    side: "Debit",
    why: "Easy to confuse with Accumulated Depreciation — that one is the balance sheet contra account.",
  },
  {
    id: "a-patent",
    chapter: "Ch. 7",
    situation: "Legal and registration fees paid to protect an invention.",
    account: "Patent",
    side: "Debit",
    why: "Only the fees are capitalized. The R&D that created it was expensed as incurred.",
  },
  {
    id: "a-repairs",
    chapter: "Ch. 7",
    situation: "Routine maintenance on a delivery truck that doesn't extend its life.",
    account: "Repairs and Maintenance Expense",
    side: "Debit",
    why: "Ordinary upkeep is expensed however large the bill.",
  },
  {
    id: "a-gain",
    chapter: "Ch. 7",
    situation: "An asset is sold for more than its book value.",
    account: "Gain on Sale of Equipment",
    side: "Credit",
    why: "Below operating income on the income statement, so it doesn't change operating income.",
  },
  {
    id: "a-loss",
    chapter: "Ch. 7",
    situation: "An asset is sold for less than its book value.",
    account: "Loss on Sale of Equipment",
    side: "Debit",
  },
];
