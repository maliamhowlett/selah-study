// Generates a fresh practice exam on demand.
//
// Deliberately NOT model-generated. An LLM writing accounting questions will
// produce confident wrong answers, and the person revising is the one least
// able to catch them. Every question here is a template whose answer is
// computed in code from the same numbers shown in the prompt, so it cannot
// disagree with itself.
//
// The wrong options are the actual mistakes rather than random numbers —
// forgetting to subtract residual before straight-lining, subtracting it
// during DDB, adjusting BY the allowance target instead of TO it. A distractor
// that nobody would pick teaches nothing.

import type { ExamQuestion, MockExam } from "./acct-exam";

const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];
const between = (lo: number, hi: number, step = 1) =>
  lo + Math.floor(Math.random() * ((hi - lo) / step + 1)) * step;

const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

/**
 * Shuffles the options and reports where the right one landed.
 *
 * Dedupes on the FORMATTED string rather than the raw number: two distractors
 * can be arithmetically different and still print identically once rounded,
 * and a question showing the same figure twice looks broken. Where a
 * distractor collides it is nudged rather than dropped, so there are always
 * four plausible options.
 */
function options(correct: number, wrong: number[]): { choices: string[]; correct: number } {
  const seen = new Map<string, number>();
  seen.set(usd(correct), correct);

  for (const candidate of wrong) {
    if (seen.size >= 4) break;
    if (!Number.isFinite(candidate)) continue;
    const key = usd(candidate);
    if (!seen.has(key)) seen.set(key, candidate);
  }

  // Still short, because distractors collided. Nudge off the correct answer by
  // amounts big enough to read as real alternatives.
  const scales = [0.1, 0.25, 0.5, 1.5, 0.75, 2];
  let i = 0;
  while (seen.size < 4 && i < scales.length * 2) {
    const scale = scales[i % scales.length];
    const sign = i < scales.length ? 1 : -1;
    const magnitude = Math.abs(correct) < 1 ? 100 : Math.abs(correct);
    const candidate = Math.round((correct + sign * magnitude * scale) * 100) / 100;
    i += 1;
    if (candidate === correct || !Number.isFinite(candidate)) continue;
    const key = usd(candidate);
    if (!seen.has(key)) seen.set(key, candidate);
  }

  const values = [...seen.values()].sort(() => Math.random() - 0.5);
  return { choices: values.map(usd), correct: values.indexOf(correct) };
}

type Generator = (id: string) => ExamQuestion;

const CH4 = "Ch. 4 — Cash & internal controls";
const CH5 = "Ch. 5 — Receivables & revenues";
const CH6 = "Ch. 6 — Inventory & COGS";
const CH7 = "Ch. 7 — Long-term assets";

// --- Ch. 4 ----------------------------------------------------------------

const bankRec: Generator = (id) => {
  const bank = between(30000, 70000, 500);
  const outstanding = between(1000, 6000, 250);
  const inTransit = between(1000, 6000, 250);
  const answer = bank - outstanding + inTransit;

  return {
    id,
    number: 0,
    topic: CH4,
    prompt:
      `A company's bank statement shows a balance of ${usd(bank)}. There are ` +
      `${usd(outstanding)} of outstanding checks and ${usd(inTransit)} of deposits ` +
      `in transit. What is the adjusted cash balance?`,
    ...options(answer, [bank, bank + outstanding - inTransit, bank + outstanding + inTransit]),
    answer:
      `  Bank balance            ${usd(bank)}\n` +
      `  Less outstanding checks (${usd(outstanding)})\n` +
      `  Add deposits in transit  ${usd(inTransit)}\n` +
      `  Adjusted balance        ${usd(answer)}\n\n` +
      `Outstanding checks come OFF the bank side, deposits in transit go ON. ` +
      `Both sides must reach the same adjusted figure.`,
  };
};

const pettyCash: Generator = (id) => {
  const fund = between(200, 500, 50);
  const remaining = between(20, 80, 5);
  const receipts = fund - remaining - between(-5, 5, 5);
  const toReplenish = fund - remaining;

  return {
    id,
    number: 0,
    topic: CH4,
    prompt:
      `A ${usd(fund)} petty cash fund is being replenished. Receipts total ` +
      `${usd(receipts)} and ${usd(remaining)} in cash remains in the box. How much ` +
      `cash goes back into the fund?`,
    ...options(toReplenish, [receipts, fund, remaining]),
    answer:
      `  Fund size        ${usd(fund)}\n` +
      `  Less cash left  (${usd(remaining)})\n` +
      `  To replenish     ${usd(toReplenish)}\n\n` +
      `You always top the fund back up to its full size. Receipts of ${usd(receipts)} ` +
      `against ${usd(toReplenish)} of cash means ` +
      (receipts === toReplenish
        ? `it balances exactly.`
        : `${usd(Math.abs(toReplenish - receipts))} goes to Cash Over and Short.`),
  };
};

// --- Ch. 5 ----------------------------------------------------------------

const allowancePOR: Generator = (id) => {
  const ar = between(60000, 140000, 10000);
  const rate = pick([2, 3, 4, 5, 6]);
  const unadjusted = between(500, 2500, 250);
  const isCredit = Math.random() < 0.5;
  const target = (ar * rate) / 100;
  const answer = isCredit ? target - unadjusted : target + unadjusted;

  return {
    id,
    number: 0,
    topic: CH5,
    prompt:
      `Accounts Receivable is ${usd(ar)}. The company estimates ${rate}% will be ` +
      `uncollectible. Before adjustment the Allowance for Uncollectible Accounts has ` +
      `a ${usd(unadjusted)} ${isCredit ? "CREDIT" : "DEBIT"} balance. What is bad debt expense?`,
    ...options(answer, [target, isCredit ? target + unadjusted : target - unadjusted, unadjusted]),
    answer:
      `  Target allowance = ${rate}% × ${usd(ar)} = ${usd(target)} credit\n` +
      `  Already there: ${usd(unadjusted)} ${isCredit ? "credit" : "DEBIT"}\n` +
      `  Entry = ${usd(target)} ${isCredit ? "−" : "+"} ${usd(unadjusted)} = ${usd(answer)}\n\n` +
      `Dr Bad Debt Expense   ${usd(answer)}\n` +
      `   Cr AUA                ${usd(answer)}\n\n` +
      `Percentage-of-receivables adjusts TO the target, not BY it. A DEBIT ` +
      `starting balance means you have further to travel, so you add.`,
  };
};

const notesInterest: Generator = (id) => {
  const principal = between(10000, 90000, 5000);
  const rate = pick([4, 5, 6, 8, 9, 10]);
  const months = pick([3, 4, 6, 8, 9]);
  const answer = (principal * rate * months) / 1200;

  return {
    id,
    number: 0,
    topic: CH5,
    prompt:
      `A company holds a ${usd(principal)}, ${rate}% note receivable. ${months} months ` +
      `have passed at year end. How much interest revenue should be accrued?`,
    ...options(answer, [
      (principal * rate) / 100,
      (principal * rate * months) / 100,
      (principal * rate * (12 - months)) / 1200,
    ]),
    answer:
      `  Principal × rate × time\n` +
      `  ${usd(principal)} × ${rate}% × ${months}/12 = ${usd(answer)}\n\n` +
      `The rate is ALWAYS annual unless told otherwise, so the months fraction ` +
      `is what scales it. Forgetting it gives ${usd((principal * rate) / 100)}.`,
  };
};

const netAR: Generator = (id) => {
  const ar = between(50000, 150000, 5000);
  const allowance = between(2000, 9000, 500);
  const answer = ar - allowance;

  return {
    id,
    number: 0,
    topic: CH5,
    prompt:
      `Accounts Receivable is ${usd(ar)} and the Allowance for Uncollectible Accounts ` +
      `has a ${usd(allowance)} credit balance. What is net accounts receivable?`,
    ...options(answer, [ar, ar + allowance, allowance]),
    answer:
      `  ${usd(ar)} − ${usd(allowance)} = ${usd(answer)}\n\n` +
      `Net realizable value — what the company actually expects to collect. ` +
      `This is the figure that appears on the balance sheet.`,
  };
};

// --- Ch. 6 ----------------------------------------------------------------

function inventoryLayers() {
  const u1 = between(100, 300, 50);
  const u2 = between(100, 300, 50);
  const u3 = between(100, 300, 50);
  const p1 = between(5, 11);
  const p2 = p1 + between(1, 4);
  const p3 = p2 + between(1, 4);
  const total = u1 + u2 + u3;
  const sold = between(Math.round(total * 0.4), Math.round(total * 0.75), 10);
  const available = u1 * p1 + u2 * p2 + u3 * p3;
  return { u1, u2, u3, p1, p2, p3, total, sold, available, ending: total - sold };
}

function fifoEnding(d: ReturnType<typeof inventoryLayers>): number {
  let left = d.ending;
  let value = 0;
  for (const [u, p] of [[d.u3, d.p3], [d.u2, d.p2], [d.u1, d.p1]] as const) {
    const take = Math.min(left, u);
    value += take * p;
    left -= take;
  }
  return value;
}

function lifoEnding(d: ReturnType<typeof inventoryLayers>): number {
  let left = d.ending;
  let value = 0;
  for (const [u, p] of [[d.u1, d.p1], [d.u2, d.p2], [d.u3, d.p3]] as const) {
    const take = Math.min(left, u);
    value += take * p;
    left -= take;
  }
  return value;
}

const costFlow: Generator = (id) => {
  const d = inventoryLayers();
  const method = pick(["FIFO", "LIFO"] as const);
  const wants = pick(["ending inventory", "cost of goods sold"] as const);

  const fifo = fifoEnding(d);
  const lifo = lifoEnding(d);
  const ending = method === "FIFO" ? fifo : lifo;
  const cogs = d.available - ending;
  const answer = wants === "ending inventory" ? ending : cogs;
  const other = method === "FIFO" ? lifo : fifo;

  return {
    id,
    number: 0,
    topic: CH6,
    prompt:
      `Periodic inventory system.\n\n` +
      `  Beginning inventory: ${d.u1} units @ ${usd(d.p1)}\n` +
      `  Purchase:            ${d.u2} units @ ${usd(d.p2)}\n` +
      `  Purchase:            ${d.u3} units @ ${usd(d.p3)}\n` +
      `  Units sold:          ${d.sold}\n\n` +
      `Using ${method}, what is ${wants}?`,
    ...options(answer, [
      wants === "ending inventory" ? cogs : ending,
      wants === "ending inventory" ? other : d.available - other,
      d.available,
    ]),
    answer:
      `  Units available = ${d.u1} + ${d.u2} + ${d.u3} = ${d.total}\n` +
      `  Goods available = ${usd(d.available)}\n` +
      `  Sold ${d.sold}, so ending units = ${d.ending}\n\n` +
      `  ${method} ending inventory = ${usd(ending)}\n` +
      `  COGS = ${usd(d.available)} − ${usd(ending)} = ${usd(cogs)}\n\n` +
      `${method === "FIFO" ? "FIFO leaves the NEWEST units in inventory." : "LIFO leaves the OLDEST units in inventory."} ` +
      `Find goods available first — it is the control total, and ending inventory ` +
      `plus COGS must come back to it.`,
  };
};

const weightedAverage: Generator = (id) => {
  const d = inventoryLayers();
  const unit = d.available / d.total;
  const answer = Math.round(d.ending * unit * 100) / 100;

  return {
    id,
    number: 0,
    topic: CH6,
    prompt:
      `Periodic, weighted average cost.\n\n` +
      `  Beginning inventory: ${d.u1} units @ ${usd(d.p1)}\n` +
      `  Purchase:            ${d.u2} units @ ${usd(d.p2)}\n` +
      `  Purchase:            ${d.u3} units @ ${usd(d.p3)}\n` +
      `  Units sold:          ${d.sold}\n\n` +
      `What is ending inventory?`,
    ...options(answer, [
      Math.round(d.sold * unit * 100) / 100,
      Math.round((d.ending * (d.p1 + d.p2 + d.p3)) / 3 * 100) / 100,
      d.available,
    ]),
    answer:
      `  Goods available = ${usd(d.available)} across ${d.total} units\n` +
      `  Average cost = ${usd(d.available)} ÷ ${d.total} = ${usd(Math.round(unit * 10000) / 10000)} per unit\n` +
      `  Ending units = ${d.ending}\n` +
      `  Ending inventory = ${d.ending} × ${usd(Math.round(unit * 10000) / 10000)} = ${usd(answer)}\n\n` +
      `Average the TOTAL cost over the TOTAL units. Averaging the three unit ` +
      `prices instead is the usual wrong turn.`,
  };
};

// --- Ch. 7 ----------------------------------------------------------------

const straightLine: Generator = (id) => {
  const cost = between(40000, 120000, 2500);
  const life = pick([4, 5, 8, 10]);
  const residual = between(2000, 10000, 500);
  const annual = (cost - residual) / life;
  const years = between(1, Math.min(3, life - 1));
  const wants = pick(["one year of depreciation expense", "the book value"] as const);
  const bookValue = cost - annual * years;
  const answer = wants === "the book value" ? bookValue : annual;

  return {
    id,
    number: 0,
    topic: CH7,
    prompt:
      `Equipment costs ${usd(cost)} with a ${life}-year life and a ${usd(residual)} ` +
      `residual value, depreciated straight-line. ` +
      (wants === "the book value"
        ? `What is the book value after ${years} year${years === 1 ? "" : "s"}?`
        : `What is one year of depreciation expense?`),
    ...options(answer, [
      wants === "the book value" ? cost - (cost / life) * years : cost / life,
      wants === "the book value" ? annual : cost - residual,
      wants === "the book value" ? cost - annual * (years + 1) : residual,
    ]),
    answer:
      `  Depreciable base = ${usd(cost)} − ${usd(residual)} = ${usd(cost - residual)}\n` +
      `  Annual = ${usd(cost - residual)} ÷ ${life} = ${usd(annual)}\n` +
      (wants === "the book value"
        ? `  After ${years} year${years === 1 ? "" : "s"}: ${usd(cost)} − ${usd(annual * years)} = ${usd(bookValue)}\n\n` +
          `Book value is cost less ACCUMULATED depreciation, not one year of it.`
        : `\nStraight-line subtracts residual BEFORE dividing. Forgetting to gives ${usd(cost / life)}.`),
  };
};

const decliningBalance: Generator = (id) => {
  const cost = between(40000, 120000, 2500);
  const life = pick([4, 5, 8, 10]);
  const residual = between(2000, 10000, 500);
  const rate = 2 / life;
  const year1 = cost * rate;
  const year2 = (cost - year1) * rate;
  const which = pick([1, 2] as const);
  const answer = which === 1 ? year1 : year2;

  return {
    id,
    number: 0,
    topic: CH7,
    prompt:
      `Equipment costs ${usd(cost)} with a ${life}-year life and a ${usd(residual)} ` +
      `residual value. Using double-declining balance, what is depreciation expense ` +
      `in year ${which}?`,
    ...options(answer, [
      (cost - residual) * rate,
      (cost - residual) / life,
      which === 1 ? year2 : year1,
    ]),
    answer:
      `  Rate = 2 × (1 ÷ ${life}) = ${Math.round(rate * 1000) / 10}%\n` +
      `  Year 1 = ${usd(cost)} × ${Math.round(rate * 1000) / 10}% = ${usd(year1)}\n` +
      (which === 2
        ? `  Book value = ${usd(cost - year1)}\n  Year 2 = ${usd(cost - year1)} × ${Math.round(rate * 1000) / 10}% = ${usd(year2)}\n\n`
        : `\n`) +
      `DDB IGNORES residual value in the formula — you apply the rate to full ` +
      `book value. Subtracting it first gives ${usd((cost - residual) * rate)}, ` +
      `which is why that option is there. Residual only tells you when to stop.`,
  };
};

const disposal: Generator = (id) => {
  const cost = between(30000, 90000, 2500);
  const life = pick([4, 5, 8]);
  const annual = cost / life;
  const years = between(1, life - 1);
  const accumulated = annual * years;
  const bookValue = cost - accumulated;
  const swing = between(1000, 8000, 500) * pick([1, -1]);
  const proceeds = bookValue + swing;
  const answer = Math.abs(swing);

  return {
    id,
    number: 0,
    topic: CH7,
    prompt:
      `Equipment cost ${usd(cost)} with a ${life}-year life and no residual value, ` +
      `depreciated straight-line. After ${years} year${years === 1 ? "" : "s"} it is ` +
      `sold for ${usd(proceeds)}. What is the gain or loss?`,
    ...options(answer, [Math.abs(cost - proceeds), bookValue, accumulated]),
    answer:
      `  Annual depreciation = ${usd(cost)} ÷ ${life} = ${usd(annual)}\n` +
      `  Accumulated after ${years} year${years === 1 ? "" : "s"} = ${usd(accumulated)}\n` +
      `  Book value = ${usd(cost)} − ${usd(accumulated)} = ${usd(bookValue)}\n` +
      `  Proceeds ${usd(proceeds)} vs book value ${usd(bookValue)}\n` +
      `  → ${swing > 0 ? "GAIN" : "LOSS"} of ${usd(answer)}\n\n` +
      `Compare proceeds to BOOK VALUE, never to the ${usd(cost)} cost — doing that ` +
      `gives ${usd(Math.abs(cost - proceeds))}.`,
  };
};

const lumpSum: Generator = (id) => {
  const paid = between(1000000, 4000000, 100000);
  const a = between(600000, 1600000, 50000);
  const b = between(400000, 1200000, 50000);
  const c = between(300000, 900000, 50000);
  const total = a + b + c;
  const answer = Math.round((a / total) * paid);

  return {
    id,
    number: 0,
    topic: CH7,
    prompt:
      `A building, land and equipment are bought together for ${usd(paid)}. ` +
      `Independent appraisals value them at ${usd(a)}, ${usd(b)} and ${usd(c)} ` +
      `respectively. What amount is recorded for the building?`,
    ...options(answer, [a, Math.round(paid / 3), Math.round((b / total) * paid)]),
    answer:
      `  Total appraised = ${usd(a)} + ${usd(b)} + ${usd(c)} = ${usd(total)}\n` +
      `  Building share = ${usd(a)} ÷ ${usd(total)} = ${Math.round((a / total) * 1000) / 10}%\n` +
      `  Recorded = ${Math.round((a / total) * 1000) / 10}% × ${usd(paid)} = ${usd(answer)}\n\n` +
      `A basket purchase splits by RELATIVE fair value. Recording the appraisal ` +
      `figure itself (${usd(a)}) ignores what was actually paid.`,
  };
};

const amortization: Generator = (id) => {
  const fees = between(6000, 24000, 600);
  const legal = 20;
  const service = pick([4, 5, 6, 8, 10]);
  const annual = fees / service;
  const months = pick([3, 6, 9]);
  const answer = (annual * months) / 12;

  return {
    id,
    number: 0,
    topic: CH7,
    prompt:
      `A company pays ${usd(fees)} in legal and registration fees for a patent, ` +
      `${months} months before its year end. The patent has ${legal} years of legal ` +
      `protection but an estimated service life of ${service} years. What is year-one ` +
      `amortization expense?`,
    ...options(answer, [annual, fees / legal, (fees / legal / 12) * months]),
    answer:
      `  Amortise over the SHORTER of legal (${legal}) and service (${service}) life\n` +
      `  Annual = ${usd(fees)} ÷ ${service} = ${usd(annual)}\n` +
      `  Only ${months} months have run: ${usd(annual)} × ${months}/12 = ${usd(answer)}\n\n` +
      `Two traps: using the ${legal}-year legal life gives ${usd(fees / legal)}, and ` +
      `forgetting the part-year gives ${usd(annual)}.`,
  };
};

// Grouped by chapter so a paper can be drawn the shape the real one is —
// ten questions from each — rather than clustering wherever the draw lands.
const BY_CHAPTER: Generator[][] = [
  [bankRec, pettyCash],
  [allowancePOR, notesInterest, netAR],
  [costFlow, weightedAverage],
  [straightLine, decliningBalance, disposal, lumpSum, amortization],
];

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

/**
 * A fresh paper, drawn evenly across the four chapters because that is how
 * Dr. Bokrand's blueprint weights the real one.
 */
export function generateExam(count = 16): MockExam {
  const perChapter = Math.ceil(count / BY_CHAPTER.length);
  const drawn: Generator[] = [];

  for (const chapter of BY_CHAPTER) {
    for (let i = 0; i < perChapter; i += 1) {
      // Cycle a reshuffled chapter so the same template doesn't repeat
      // back-to-back when a chapter has fewer templates than slots.
      if (i % chapter.length === 0) drawn.push(...shuffled(chapter).slice(0, Math.min(chapter.length, perChapter - i)));
    }
  }

  return {
    title: "Generated practice exam",
    source:
      "Fresh numbers every time, computed in code rather than written by a model, so the answers are right by construction.",
    minutes: Math.max(10, Math.round(Math.min(drawn.length, count) * 1.5)),
    questions: shuffled(drawn)
      .slice(0, count)
      .map((make, i) => ({ ...make(`g${i}`), number: i + 1 })),
  };
}
