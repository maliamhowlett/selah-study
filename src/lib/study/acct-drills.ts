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
      "Replenish the $300 petty cash fund. Receipts total $240 for supplies, and $55 cash remains in the box.",
    entry: [
      { account: "Supplies Expense", debit: 240 },
      { account: "Cash Over and Short", debit: 5 },
      { account: "Cash", credit: 245 },
    ],
    note:
      "$300 − $55 remaining = $245 to put back. Receipts only account for $240, so $5 is short.",
  },

  // --- Chapter 5: receivables ---
  {
    id: "d-allowance-estimate",
    chapter: "Ch. 5",
    prompt:
      "Accounts Receivable is $80,000. The Allowance for Uncollectible Accounts has a $1,200 CREDIT balance before adjustment. Estimate 6% of receivables uncollectible.",
    entry: [
      { account: "Bad Debt Expense", debit: 3600 },
      { account: "Allowance for Uncollectible Accounts", credit: 3600 },
    ],
    note: "Target $4,800, already $1,200 there, so the entry is the $3,600 difference.",
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
    note: "Freight-IN is a cost of getting the goods ready to sell, so it is capitalised into inventory.",
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
      "Everything needed to get the asset ready for its intended use is capitalised into one figure.",
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
    id: "d-repairs",
    chapter: "Ch. 7",
    prompt: "Pay $1,200 cash for routine maintenance on a delivery truck.",
    entry: [
      { account: "Repairs and Maintenance Expense", debit: 1200 },
      { account: "Cash", credit: 1200 },
    ],
    note: "Routine upkeep is expensed however large the bill. Only improvements get capitalised.",
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
    id: "c-loss-sale",
    account: "Loss on Sale of Equipment",
    statement: "Income statement",
    section: "Other expense, below operating income",
    normalBalance: "Debit",
  },
];

/** Every chapter present in the drills, in the order they are taught. */
export const DRILL_CHAPTERS = [...new Set(JOURNAL_DRILLS.map((d) => d.chapter))];
