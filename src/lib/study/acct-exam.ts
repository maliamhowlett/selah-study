// The practice exam, transcribed from the scanned copy in course-materials.
//
// The paper Malia was given has the answers circled on it, which makes it
// useless as practice — you cannot sit a paper you can already see the answers
// to. Every circled letter has been lifted out of the question and into
// `correct`, so the questions can be shown blank and marked afterwards.
//
// Source paper is headed MGMT 200 (Maienbrook), the previous code for this
// course, so the wording is not Dr. Bokrand's — but the syllabus for both is
// Spiceland chapters 4–7 and every question maps onto Exam 2's material.
//
// Each `answer` was recomputed from the question rather than read off the
// circles. All forty agreed.

export interface ExamQuestion {
  id: string;
  number: number;
  topic: string;
  prompt: string;
  /** Present for multiple choice; omitted for worked problems. */
  choices?: string[];
  /** Index into `choices`, for multiple choice. */
  correct?: number;
  /** Worked solution, or the reasoning behind the correct choice. */
  answer: string;
}

export interface MockExam {
  title: string;
  /** Where it came from, so it's clear this isn't invented. */
  source: string;
  minutes: number;
  questions: ExamQuestion[];
}

const CH4 = "Ch. 4 — Cash & internal controls";
const CH5 = "Ch. 5 — Receivables & revenues";
const CH6 = "Ch. 6 — Inventory & COGS";
const CH7 = "Ch. 7 — Long-term assets";

export const ACCT_MOCK_EXAM: MockExam = {
  title: "Sample Exam 2",
  source:
    "The practice paper you were given, with the circled answers moved into a key.",
  minutes: 60,
  questions: [
    {
      id: "q1",
      number: 1,
      topic: CH4,
      prompt:
        "The component of internal control that includes the policies and procedures that help ensure that management's directives are being carried out is:",
      choices: ["Monitoring.", "Information and communication.", "Risk assessment.", "Control activities."],
      correct: 3,
      answer:
        "Control activities are the policies and procedures themselves — approvals, authorizations, separation of duties. Monitoring is checking the controls still work; risk assessment is deciding what to control in the first place.",
    },
    {
      id: "q2",
      number: 2,
      topic: CH4,
      prompt: "Which of the following is not an example of preventive controls?",
      choices: ["Separation of duties", "Physical controls", "Proper authorization", "Reconciliations"],
      correct: 3,
      answer:
        "Reconciliations are DETECTIVE — they find a problem after it has happened. The other three stop it happening at all.",
    },
    {
      id: "q3",
      number: 3,
      topic: CH4,
      prompt:
        "McGregor Company allows customers to pay with credit cards. The credit card company charges McGregor 3% of the sale. When a customer uses a credit card to pay McGregor $200 for services provided, McGregor would:",
      choices: [
        "Debit Cash for $200.",
        "Credit Service Revenue for $194.",
        "Credit Service Fee Expense for $6.",
        "Credit Service Revenue for $200.",
      ],
      correct: 3,
      answer:
        "The full entry:\n\n" +
        "Dr Cash                   194\n" +
        "Dr Service Fee Expense      6\n" +
        "   Cr Service Revenue       200\n\n" +
        "Revenue is the full $200 — the fee is an expense, not a reduction of revenue. Cash is only $194, so (a) is wrong, and the fee is a DEBIT, so (c) is wrong.",
    },
    {
      id: "q4",
      number: 4,
      topic: CH4,
      prompt:
        "When reconciling the bank statement, which of the following items should be added to the bank balance?",
      choices: [
        "Outstanding checks",
        "Bank service charges",
        "Outstanding deposits",
        "Deposits collected by the bank",
      ],
      correct: 2,
      answer:
        "Outstanding deposits (deposits in transit) are money you have that the bank hasn't recorded yet — so add them to the bank side. Outstanding checks are subtracted from the bank side. Service charges and bank collections are BOOK-side items.",
    },
    {
      id: "q5",
      number: 5,
      topic: CH4,
      prompt:
        "Which of the following is considered a weakness in internal controls over cash receipts?",
      choices: [
        "Limit the amount of cash employees handle by accepting credit and debit cards",
        "Cash receipts are deposited daily",
        "Only one person handles all incoming cash payments and makes the deposit",
        "Verify cash receipts by comparing bank deposits with accounting records",
      ],
      correct: 2,
      answer:
        "One person handling the cash AND making the deposit is a failure of separation of duties — nobody is checking them.",
    },
    {
      id: "q6",
      number: 6,
      topic: CH4,
      prompt:
        "The bookkeeper discovered an error when reviewing the bank statement. The bank correctly recorded a deposit of $1,500 but the bookkeeper recorded it as $1,400. How will the bank reconciliation be affected?",
      choices: [
        "The bank balance will need to be adjusted",
        "The company balance will need to be adjusted",
        "No adjustment is needed",
        "Both the bank and book balances will need to be adjusted",
      ],
      correct: 1,
      answer:
        "The BANK got it right and the company got it wrong, so the company's books are the side that needs fixing. Add $100 to the book balance and journal it.",
    },
    {
      id: "q7",
      number: 7,
      topic: CH4,
      prompt:
        "On March 31, a company's bank statement shows a balance of $50,000. The company's records show $48,200. After reconciling the bank statement, the company finds that there are $3,000 of outstanding checks and $4,000 of deposits in transit. What is the adjusted cash balance on March 31?",
      choices: ["$50,000", "$48,200", "$51,000", "$49,200"],
      correct: 2,
      answer:
        "Work the bank side:\n\n" +
        "  Bank balance            50,000\n" +
        "  Less outstanding checks (3,000)\n" +
        "  Add deposits in transit   4,000\n" +
        "  Adjusted balance        51,000\n\n" +
        "Both sides must end at the same adjusted figure, so $51,000 is the answer regardless of which side you work.",
    },
    {
      id: "q8",
      number: 8,
      topic: CH4,
      prompt:
        "When preparing a bank reconciliation, which of the following is subtracted from the Company balance?",
      choices: [
        "Bank service charges",
        "Deposits in transit",
        "Outstanding checks",
        "Bank errors in favor of the company",
      ],
      correct: 0,
      answer:
        "Service charges are money the bank has already taken that you haven't recorded — subtract from the book side, and journal it. Deposits in transit and outstanding checks are both BANK-side.",
    },
    {
      id: "q9",
      number: 9,
      topic: CH4,
      prompt:
        "Which of the following should not be an internal control procedure for cash disbursements?",
      choices: [
        "Requiring two signatures for larger checks",
        "Periodically comparing receipts with debit and credit card transactions",
        "Allowing one employee to approve and sign checks",
        "Setting purchase limits for employees",
      ],
      correct: 2,
      answer:
        "Approving and signing are the two halves that must be kept apart. One person doing both can pay themselves.",
    },
    {
      id: "q10",
      number: 10,
      topic: CH4,
      prompt: "What happens when the petty cash fund is replenished?",
      choices: [
        "The petty cash account increases",
        "The expenses are recorded, and cash is replenished",
        "The petty cash account is closed",
        "The company issues stock to cover petty cash",
      ],
      correct: 1,
      answer:
        "Replenishing is when the expenses finally hit the books:\n\n" +
        "Dr various expenses      xxx\n" +
        "   Cr Cash                 xxx\n\n" +
        "The Petty Cash account itself does NOT move — it only changes if you resize the fund.",
    },
    {
      id: "q11",
      number: 11,
      topic: CH5,
      prompt: "Which of the following best describes accounts receivable?",
      choices: [
        "Amounts owed to suppliers",
        "Amounts a company expects to collect from customers",
        "Cash on hand for future payments",
        "Loans taken by a company",
      ],
      correct: 1,
      answer: "Amounts owed TO you by customers. Amounts owed BY you to suppliers are accounts payable.",
    },
    {
      id: "q12",
      number: 12,
      topic: CH5,
      prompt: 'What type of account is "Allowance for Uncollectible Accounts"?',
      choices: ["Liability", "Expense", "Contra Asset", "Contra Revenue"],
      correct: 2,
      answer:
        "A contra asset — it sits against Accounts Receivable and reduces it, with a credit normal balance. Receivables less the allowance is net realizable value.",
    },
    {
      id: "q13",
      number: 13,
      topic: CH5,
      prompt:
        "Which of the following is NOT an approved method for estimating uncollectible accounts under GAAP?",
      choices: [
        "Percentage of sales method",
        "Direct write-off method",
        "Aging of accounts receivable method",
        "Allowance method",
      ],
      correct: 1,
      answer:
        "The direct write-off method waits until an account actually goes bad, which breaks matching — the expense lands in a different period from the sale. Not GAAP (though it is required for tax).",
    },
    {
      id: "q14",
      number: 14,
      topic: CH5,
      prompt: "Which of the following is true about the allowance method?",
      choices: [
        "It follows the matching principle by estimating bad debts in the same period as sales",
        "It only records bad debts when accounts are determined to be uncollectible",
        "It does not require adjusting journal entries",
        "It is only allowed for tax purposes",
      ],
      correct: 0,
      answer:
        "Matching is the whole reason the allowance method exists: the cost of selling on credit is recognized in the period of the sale, not whenever the customer eventually defaults. (b) describes direct write-off.",
    },
    {
      id: "q15",
      number: 15,
      topic: CH5,
      prompt:
        "A company estimates that 5% of its $100,000 accounts receivable will be uncollectible. What journal entry should it record if the Allowance for Uncollectible Account has a debit balance of $1,000 before the adjustment?",
      choices: [
        "Debit Bad Debt Expense $6,000; Credit Allowance for Uncollectible Accounts $6,000",
        "Debit Allowance for Uncollectible Accounts $6,000; Credit Bad Debt Expense $6,000",
        "Debit Bad Debt Expense $5,000; Credit Accounts Receivable $5,000",
        "Debit Bad Debt Expense $4,000; Credit Accounts Receivable $4,000",
      ],
      correct: 0,
      answer:
        "Target allowance = 5% × $100,000 = $5,000 CREDIT.\n" +
        "You are starting at $1,000 DEBIT — on the wrong side of zero.\n" +
        "To get from −1,000 to +5,000 you need $6,000.\n\n" +
        "Dr Bad Debt Expense                        6,000\n" +
        "   Cr Allowance for Uncollectible Accounts   6,000\n\n" +
        "Note the credit is to the ALLOWANCE, never to Accounts Receivable — which rules out (c) and (d) on sight.",
    },
    {
      id: "q16",
      number: 16,
      topic: CH5,
      prompt:
        "When an account is written off under the allowance method, what is the effect on net accounts receivable?",
      choices: ["Increases", "Decreases", "No effect", "Depends on the method used"],
      correct: 2,
      answer:
        "Dr Allowance / Cr Accounts Receivable.\n\n" +
        "Both the asset and its contra account fall by the same amount, so NET receivables is unchanged. Net income is unaffected too — the expense was recorded back when the allowance was estimated.",
    },
    {
      id: "q17",
      number: 17,
      topic: CH5,
      prompt:
        "What does it mean if the organization ends the year with a credit balance in their Allowance for Uncollectible Account?",
      choices: [
        "The Allowance account always has a credit balance",
        "They underestimated the amount uncollectible for the year",
        "They overestimated the amount uncollectible for the year",
        "They wrote off more than they expected",
      ],
      correct: 2,
      answer:
        "Write-offs debit the allowance. If a credit balance survives to year end, the estimate was larger than the write-offs that actually came — an overestimate. A leftover DEBIT balance would mean the opposite.",
    },
    {
      id: "q18",
      number: 18,
      topic: CH5,
      prompt:
        "A company sells goods for $10,000 with credit terms of 2/10, net 30. If the customer pays within the discount period, what is the amount of net revenue recognized?",
      choices: ["$10,000", "$9,800", "$9,200", "$10,200"],
      correct: 1,
      answer:
        "2% of $10,000 = $200 discount. Net revenue = $9,800.\n\n" +
        "Dr Cash              9,800\n" +
        "Dr Sales Discounts     200\n" +
        "   Cr Accounts Receivable  10,000\n\n" +
        '"2/10, net 30" = 2% off if paid within 10 days, otherwise the full amount in 30.',
    },
    {
      id: "q19",
      number: 19,
      topic: CH5,
      prompt:
        "When a customer returns goods due to defects, what is the correct journal entry under the perpetual inventory system?",
      choices: [
        "Debit Sales Returns and Allowances, Credit Accounts Receivable",
        "Debit Sales Revenue, Credit Accounts Receivable",
        "Debit Accounts Receivable, Credit Sales Revenue",
        "Debit Cost of Goods Sold, Credit Sales Returns and Allowances",
      ],
      correct: 0,
      answer:
        "Returns go to the contra-revenue account rather than reversing Sales Revenue directly, so the gross figure stays visible. Defective goods are not restocked, so there is no second entry putting them back into inventory.",
    },
    {
      id: "q20",
      number: 20,
      topic: CH5,
      prompt:
        "On October 1, 2024, Rose, Incorporated lends $100,000 to another company and accepts a 24-month, 6% note. What is the amount of interest revenue Rose will report in its 2026 income statement?",
      choices: ["$4,500", "$750", "$2,250", "$1,500"],
      correct: 0,
      answer:
        "The note runs 1 Oct 2024 → 1 Oct 2026. The question asks only about 2026, which contains Jan–Oct = 9 months.\n\n" +
        "$100,000 × 6% × 9/12 = $4,500\n\n" +
        "The trap is answering for a full year or for the whole note. Read which period is being asked about.",
    },
    {
      id: "q21",
      number: 21,
      topic: CH5,
      prompt:
        "A company reported the following amounts in its income statement:\n\n" +
        "  Sales revenue                 $440,000\n" +
        "  Advertising expense             60,000\n" +
        "  Interest expense                10,000\n" +
        "  Salaries expense                55,000\n" +
        "  Utilities expense               25,000\n" +
        "  Income tax expense              45,000\n" +
        "  Cost of goods sold             180,000\n" +
        "  Sales Returns and Allowances    20,000\n\n" +
        "What is operating income?",
      choices: ["$100,000", "$45,000", "$260,000", "$120,000"],
      correct: 0,
      answer:
        "  Sales revenue            440,000\n" +
        "  Less returns             (20,000)\n" +
        "  Net sales                420,000\n" +
        "  Less COGS               (180,000)\n" +
        "  Gross profit             240,000\n" +
        "  Less advertising         (60,000)\n" +
        "  Less salaries            (55,000)\n" +
        "  Less utilities           (25,000)\n" +
        "  Operating income         100,000\n\n" +
        "Interest expense and income tax are NON-operating — they sit below operating income. Leaving them in gives $45,000, which is why (b) is there.",
    },
    {
      id: "q22",
      number: 22,
      topic: CH6,
      prompt:
        "In a period of rising prices, which inventory valuation method typically results in the lowest taxable income?",
      choices: ["FIFO", "LIFO", "Weighted Average", "Specific Identification"],
      correct: 1,
      answer:
        "Rising prices means the newest units cost the most. LIFO expenses those newest, dearest units first → highest COGS → lowest net income → lowest tax. FIFO does the reverse.",
    },
    {
      id: "q23",
      number: 23,
      topic: CH6,
      prompt:
        "The lower of cost and net realizable value rule causes losses in the value of inventory to be recognized in the period when:",
      choices: [
        "The inventory is sold.",
        "The value of inventory declines below cost.",
        "The inventory is purchased.",
        "Cash collection from the customer fails to occur.",
      ],
      correct: 1,
      answer:
        "The loss is recognized as soon as value falls below cost, without waiting for a sale — conservatism. The rule only ever works downward: if NRV rises above cost you do nothing.",
    },
    {
      id: "q24",
      number: 24,
      topic: CH6,
      prompt:
        "FIFO Ending Inventory Calculation:\n\n" +
        "  Beginning Inventory: 200 units @ $5 each\n" +
        "  Purchase: 300 units @ $6 each\n" +
        "  Purchase: 500 units @ $7 each\n" +
        "  Sales: 700 units\n\n" +
        "Using FIFO, what is the ending inventory value?",
      choices: ["$2,100", "$2,600", "$3,200", "$3,600"],
      correct: 0,
      answer:
        "Units available = 200 + 300 + 500 = 1,000. Sold 700, so 300 remain.\n\n" +
        "FIFO leaves the NEWEST units in inventory:\n" +
        "  300 units × $7 = $2,100\n\n" +
        "Check: goods available = 1,000 + 1,800 + 3,500 = $6,300, so COGS = 6,300 − 2,100 = $4,200.",
    },
    {
      id: "q25",
      number: 25,
      topic: CH6,
      prompt:
        "LIFO Cost of Goods Sold Calculation:\n\n" +
        "  Beginning Inventory: 100 units @ $10 each\n" +
        "  Purchase: 200 units @ $12 each\n" +
        "  Purchase: 300 units @ $15 each\n" +
        "  Sales: 400 units\n\n" +
        "Using LIFO, what is the Cost of Goods Sold?",
      choices: ["$5,400", "$5,700", "$4,800", "$4,600"],
      correct: 1,
      answer:
        "LIFO sells the NEWEST units first:\n" +
        "  300 units × $15 = 4,500\n" +
        "  100 units × $12 = 1,200\n" +
        "  400 units        = $5,700\n\n" +
        "Check: goods available = 1,000 + 2,400 + 4,500 = $7,900, so ending inventory = 7,900 − 5,700 = $2,200 (200 units: 100@$10 + 100@$12).",
    },
    {
      id: "q26",
      number: 26,
      topic: CH6,
      prompt:
        "Weighted Average Cost Calculation:\n\n" +
        "  Beginning Inventory: 50 units @ $8 each\n" +
        "  Purchase: 150 units @ $10 each\n" +
        "  Purchase: 100 units @ $12 each\n" +
        "  Sales: 200 units\n\n" +
        "What is the ending inventory value?",
      choices: ["$800", "$900", "$1,033", "$1,100"],
      correct: 2,
      answer:
        "Goods available = (50×8) + (150×10) + (100×12) = 400 + 1,500 + 1,200 = $3,100 across 300 units.\n\n" +
        "Average cost = 3,100 ÷ 300 = $10.3333 per unit\n" +
        "Ending units = 300 − 200 = 100\n" +
        "Ending inventory = 100 × 10.3333 = $1,033\n\n" +
        "Average the TOTAL cost over the TOTAL units — not the three unit prices, which would give $10 and the wrong answer.",
    },
    {
      id: "q27",
      number: 27,
      topic: CH6,
      prompt:
        "On May 1, a company purchased inventory costing $2,000 on account with terms 2/10, n/30. On May 18, the company pays for this inventory and records which of the following using a perpetual inventory system?",
      choices: [
        "Dr Accounts Payable 2,000 / Cr Cash 2,000",
        "Dr Accounts Payable 1,960, Dr Inventory 40 / Cr Cash 2,000",
        "Dr Accounts Payable 2,000 / Cr Inventory 40, Cr Cash 1,960",
        "Dr Cash 2,000 / Cr Accounts Payable 2,000",
      ],
      correct: 0,
      answer:
        "Count the days. Purchased 1 May, paid 18 May — that is 17 days, and the discount window closed on 11 May.\n\n" +
        "No discount, so the full $2,000 is paid:\n" +
        "Dr Accounts Payable   2,000\n" +
        "   Cr Cash              2,000\n\n" +
        "Option (c) is what you WOULD record paying within 10 days. The entire question turns on the date.",
    },
    {
      id: "q28",
      number: 28,
      topic: CH6,
      prompt: "Which company is most likely to use specific identification for their inventory?",
      choices: ["Jim's Paper Co.", "Tom's Used Cars", "Marie's Water Bottling Co.", "Mega Blocks Mass Production"],
      correct: 1,
      answer:
        "Specific identification suits small numbers of high-value, individually distinguishable items — each used car has its own VIN and its own cost. Interchangeable mass-produced units make it impractical.",
    },
    {
      id: "q29",
      number: 29,
      topic: CH6,
      prompt:
        "Companies that purchase inventories that are primarily in finished form for resale to customers are known as:",
      choices: [
        "Manufacturing companies.",
        "Service companies.",
        "Delivering companies.",
        "Merchandising companies.",
      ],
      correct: 3,
      answer:
        "Merchandisers buy finished goods and resell them. Manufacturers make theirs from raw materials; service companies hold no inventory of goods at all.",
    },
    {
      id: "q30",
      number: 30,
      topic: CH6,
      prompt:
        "A company purchases inventory with FOB Shipping Point terms. When does the buyer take ownership of the inventory?",
      choices: [
        "When the goods arrive at the buyer's location.",
        "When the goods leave the seller's shipping dock.",
        "When the invoice is paid in full.",
        "When the buyer inspects and accepts the goods.",
      ],
      correct: 1,
      answer:
        "FOB Shipping POINT — title passes at the shipping point, so the buyer owns the goods in transit and pays the freight. FOB Destination is the opposite. Goods in transit at year end belong to whoever holds title.",
    },
    {
      id: "q31",
      number: 31,
      topic: CH7,
      prompt:
        "Blossom Corp. purchased land for $90,000 cash. Additional costs included $6,000 in commissions to the real estate agent, $7,500 in property taxes, and $1,200 for title insurance. The property tax amount includes $6,000 in back taxes paid on behalf of the seller and $1,500 due for the current year after the purchase date. For what amount should Blossom report the land?",
      choices: ["$96,000", "$97,200", "$90,000", "$103,200"],
      correct: 3,
      answer:
        "  Purchase price            90,000\n" +
        "  Commissions                6,000\n" +
        "  Back taxes owed by seller  6,000\n" +
        "  Title insurance            1,200\n" +
        "  Capitalized cost         103,200\n\n" +
        "The $1,500 of CURRENT-year taxes falling after the purchase date is an ordinary operating expense, not a cost of acquiring the land. Back taxes are capitalized because clearing the seller's debt was necessary to get title.",
    },
    {
      id: "q32",
      number: 32,
      topic: CH7,
      prompt:
        "A company acquired a warehouse, two acres of land, and equipment for a lump-sum price of $3,000,000. Independent appraisals estimated the fair values as $1,584,000 for the warehouse, $900,000 for the land, and $816,000 for equipment. What amount should be recorded for the warehouse?",
      choices: ["$1,584,000", "$1,440,000", "$1,000,000", "None of these answer choices are correct."],
      correct: 1,
      answer:
        "Total appraised value = 1,584,000 + 900,000 + 816,000 = $3,300,000\n" +
        "Warehouse share = 1,584,000 ÷ 3,300,000 = 48%\n" +
        "Allocated cost = 48% × $3,000,000 = $1,440,000\n\n" +
        "A basket purchase is split by RELATIVE fair value. The appraisal total exceeds what was paid, so every asset comes in below its appraisal — recording the warehouse at $1,584,000 is the trap.",
    },
    {
      id: "q33",
      number: 33,
      topic: CH7,
      prompt: "An exclusive 20-year right to manufacture a product or to use a process is a:",
      choices: ["Franchise.", "Patent.", "Trademark.", "Copyright."],
      correct: 1,
      answer:
        "Patent — 20 years, and it covers an invention or process. Copyright protects creative work for far longer; a trademark is a name or symbol; a franchise is a contractual right to operate someone else's business model.",
    },
    {
      id: "q34",
      number: 34,
      topic: CH7,
      prompt:
        "During the current year, a company spends $50,000 on research and development for a new drug to cure liver damage. By the end of the year, management feels confident that the new drug will gain FDA approval and lead to higher future sales. What impact will this $50,000 transaction have on this year's financial statements?",
      choices: ["Increase expenses", "Increase revenues", "Decrease revenues", "Increase assets"],
      correct: 0,
      answer:
        "R&D is expensed as incurred under US GAAP, full stop. Management's confidence about future benefit changes nothing — the rule exists precisely because that confidence is unverifiable.",
    },
    {
      id: "q35",
      number: 35,
      topic: CH7,
      prompt:
        "Bouquet Enterprises purchased equipment for $72,500 on January 1, 2024. The equipment is expected to have a ten-year service life, with a residual value of $7,950 at the end of ten years.\n\nUsing the straight-line method, the book value at December 31, 2024, would be:",
      choices: ["$58,095.", "$66,045.", "$65,250.", "$64,550."],
      correct: 1,
      answer:
        "Annual depreciation = (72,500 − 7,950) ÷ 10 = 64,550 ÷ 10 = $6,455\n" +
        "Book value = 72,500 − 6,455 = $66,045\n\n" +
        "The question asks for BOOK VALUE, not depreciation expense. Option (d) is the depreciable base and (c) is cost less one year of depreciation computed without subtracting residual — both are the answers to questions that weren't asked.",
    },
    {
      id: "q36",
      number: 36,
      topic: CH7,
      prompt:
        "Bouquet Enterprises purchased equipment for $75,000 on January 1, 2024. The equipment is expected to have a ten-year service life, with a residual value of $7,800 at the end of ten years.\n\nUsing the double-declining balance method, depreciation expense for 2024 would be: (Do not round your intermediate calculations)",
      choices: ["$15,000.", "$7,200.", "$13,440.", "$7,500."],
      correct: 0,
      answer:
        "DDB rate = 2 × (1 ÷ 10) = 20%\n" +
        "Year 1 = $75,000 × 20% = $15,000\n\n" +
        "Residual value is IGNORED in the DDB calculation — you apply the rate to full book value. Option (c) is what you get by wrongly subtracting the $7,800 first. You only use residual to know when to stop.",
    },
    {
      id: "q37",
      number: 37,
      topic: CH7,
      prompt:
        "Pumpkin Products purchased equipment that cost $120,000. It had an estimated service life of four years and no residual value. The equipment was depreciated by the straight-line method and was sold at the end of the second year of use. What is the amount of the gain or loss if Alliance sells the equipment for $65,000?",
      choices: [
        "Neither a gain nor a loss since the gain would not be recognized",
        "Gain of $5,000",
        "Loss of $5,000",
        "Neither a gain nor a loss since the equipment was sold at its book value",
      ],
      correct: 1,
      answer:
        "Annual depreciation = 120,000 ÷ 4 = $30,000\n" +
        "After two years, accumulated = $60,000\n" +
        "Book value = 120,000 − 60,000 = $60,000\n" +
        "Sold for 65,000 → GAIN of $5,000\n\n" +
        "Dr Cash                      65,000\n" +
        "Dr Accumulated Depreciation  60,000\n" +
        "   Cr Equipment                120,000\n" +
        "   Cr Gain on Sale               5,000",
    },
    {
      id: "q38",
      number: 38,
      topic: CH7,
      prompt: "Which of the following intangible assets does not amortize?",
      choices: ["Franchise", "Patent", "Goodwill", "Copyright"],
      correct: 2,
      answer:
        "Goodwill has an indefinite life, so it is never amortized — it is tested for impairment instead. Everything with a finite life gets amortized over it.",
    },
    {
      id: "q39",
      number: 39,
      topic: CH7,
      prompt: "How does the concept of materiality apply to long-term assets?",
      choices: [
        "All long-term assets, regardless of cost, must be capitalized and depreciated over their useful lives.",
        "A company may expense the cost of a low-value long-term asset immediately if the amount is immaterial to financial statement users.",
        "Materiality requires that all repairs and maintenance costs be capitalized as part of a long-term asset's value.",
        "The materiality concept does not apply to long-term assets, as they must always be reported at historical cost.",
      ],
      correct: 1,
      answer:
        "Materiality lets companies set a capitalization threshold — a $40 stapler lasting ten years is expensed because nobody reading the statements would decide differently either way. Tracking it as an asset would cost more than it is worth.",
    },
    {
      id: "q40",
      number: 40,
      topic: CH7,
      prompt: "Which of the following is not a long-term asset:",
      choices: ["Supplies", "Buildings", "Land Improvements", "Equipment"],
      correct: 0,
      answer:
        "Supplies are a CURRENT asset — consumed within a year. The other three are property, plant and equipment.",
    },
  ],
};
