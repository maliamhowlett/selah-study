// Marks a typed journal entry against the expected one.
//
// The point of typing rather than revealing is that recognising an answer and
// producing one are different skills, and only the second is what the exam
// asks for. Revealing first makes almost everything feel familiar.
//
// Feedback is deliberately specific about WHICH part is wrong — right accounts
// on the wrong sides is a different mistake from the wrong accounts entirely,
// and telling someone only "incorrect" throws that away.

import type { EntryLine } from "./acct-drills";

export interface SubmittedLine {
  account: string;
  debit: string;
  credit: string;
}

export type Verdict = "correct" | "close" | "wrong" | "empty";

export interface GradeResult {
  verdict: Verdict;
  /** Human-readable notes, most important first. */
  notes: string[];
  /** True when debits and credits don't agree — worth saying on its own. */
  unbalanced: boolean;
}

/**
 * Abbreviations from the lectures and notes packet, plus the obvious everyday
 * shortenings. Typing "AUA" should not be marked wrong when that is what the
 * instructor writes on the board.
 */
const ALIASES: Record<string, string> = {
  aua: "allowance for uncollectible accounts",
  allowance: "allowance for uncollectible accounts",
  "allowance for doubtful accounts": "allowance for uncollectible accounts",
  ada: "allowance for uncollectible accounts",
  bde: "bad debt expense",
  "bad debts expense": "bad debt expense",
  ar: "accounts receivable",
  "a/r": "accounts receivable",
  "accounts recievable": "accounts receivable", // common misspelling, not a knowledge gap
  ap: "accounts payable",
  "a/p": "accounts payable",
  cogs: "cost of goods sold",
  "cost of good sold": "cost of goods sold",
  "accum dep": "accumulated depreciation",
  "accum depreciation": "accumulated depreciation",
  "accumulated dep": "accumulated depreciation",
  "acc dep": "accumulated depreciation",
  "dep expense": "depreciation expense",
  "depr expense": "depreciation expense",
  "amort expense": "amortization expense",
  "amortisation expense": "amortization expense",
  "deferred rev": "deferred revenue",
  "unearned revenue": "deferred revenue",
  "service rev": "service revenue",
  "sales rev": "sales revenue",
  "int revenue": "interest revenue",
  "int receivable": "interest receivable",
  "equip": "equipment",
  "cash over short": "cash over and short",
};

/** Words that carry no meaning for matching an account name. */
const NOISE = /\b(the|a|an)\b/g;

/** "expenses" -> "expense", so plurals never decide a mark. */
function singularise(text: string): string {
  return text.replace(/\b(\w{3,})s\b/g, "$1");
}

function clean(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ") // drop parentheticals like "(AUA)"
    .replace(/[^a-z/ ]/g, " ")
    .replace(NOISE, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Aliases are resolved AFTER singularising, and their targets are singularised
// too, so both sides of a comparison land on the same string. Resolving first
// was a bug: "AUA" expanded to the plural form, which then never matched the
// singularised expected account.
const ALIAS_LOOKUP: Record<string, string> = Object.fromEntries(
  Object.entries(ALIASES).map(([key, value]) => [
    singularise(clean(key)),
    singularise(clean(value)),
  ]),
);

function normalize(raw: string): string {
  const text = singularise(clean(raw));
  return ALIAS_LOOKUP[text] ?? text;
}

function money(raw: string): number | null {
  // The form always supplies strings, but a number here shouldn't throw.
  const cleaned = String(raw ?? "").replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

type Side = "debit" | "credit";

interface Posting {
  account: string;
  /** As written, for feedback — the normalised form is for matching only. */
  label: string;
  side: Side;
  amount: number;
}

function expectedPostings(entry: EntryLine[]): Posting[] {
  return entry.map((line) => ({
    account: normalize(line.account),
    label: line.account,
    side: line.debit !== undefined ? "debit" : "credit",
    amount: (line.debit ?? line.credit)!,
  }));
}

function submittedPostings(lines: SubmittedLine[]): Posting[] {
  const out: Posting[] = [];
  for (const line of lines) {
    const account = normalize(line.account);
    if (!account) continue;
    const debit = money(line.debit);
    const credit = money(line.credit);
    // A line with both filled in is nonsense; take whichever is larger rather
    // than silently dropping the row.
    const label = line.account.trim();
    if (debit !== null && credit !== null) {
      out.push({ account, label, side: debit >= credit ? "debit" : "credit", amount: Math.max(debit, credit) });
    } else if (debit !== null) {
      out.push({ account, label, side: "debit", amount: debit });
    } else if (credit !== null) {
      out.push({ account, label, side: "credit", amount: credit });
    }
  }
  return out;
}

const pretty = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function gradeEntry(entry: EntryLine[], lines: SubmittedLine[]): GradeResult {
  const expected = expectedPostings(entry);
  const submitted = submittedPostings(lines);

  if (submitted.length === 0) {
    return { verdict: "empty", notes: ["Nothing entered yet."], unbalanced: false };
  }

  const debits = submitted.filter((p) => p.side === "debit").reduce((n, p) => n + p.amount, 0);
  const credits = submitted.filter((p) => p.side === "credit").reduce((n, p) => n + p.amount, 0);
  const unbalanced = Math.abs(debits - credits) > 0.005;

  const remaining = [...expected];
  const notes: string[] = [];
  let matched = 0;
  let sideErrors = 0;
  let amountErrors = 0;

  for (const post of submitted) {
    // Exact match on account, side and amount.
    let i = remaining.findIndex(
      (e) => e.account === post.account && e.side === post.side && Math.abs(e.amount - post.amount) < 0.005,
    );
    if (i >= 0) {
      remaining.splice(i, 1);
      matched += 1;
      continue;
    }

    // Right account and side, wrong number.
    i = remaining.findIndex((e) => e.account === post.account && e.side === post.side);
    if (i >= 0) {
      notes.push(
        `${post.label} is on the right side, but the amount should be ${pretty(remaining[i].amount)}, not ${pretty(post.amount)}.`,
      );
      remaining.splice(i, 1);
      amountErrors += 1;
      continue;
    }

    // Right account, wrong side.
    i = remaining.findIndex((e) => e.account === post.account);
    if (i >= 0) {
      notes.push(
        `${post.label} belongs on the ${remaining[i].side} side, not the ${post.side} side.`,
      );
      remaining.splice(i, 1);
      sideErrors += 1;
      continue;
    }

    notes.push(`${post.label} isn't part of this entry.`);
  }

  for (const miss of remaining) {
    notes.push(
      `Missing: ${miss.label}, ${miss.side} ${pretty(miss.amount)}.`,
    );
  }

  if (unbalanced) {
    notes.unshift(
      `Your debits total ${pretty(debits)} and your credits total ${pretty(credits)} — an entry always balances.`,
    );
  }

  const perfect = matched === expected.length && submitted.length === expected.length;
  if (perfect) {
    return { verdict: "correct", notes: ["Exactly right."], unbalanced: false };
  }

  // Everything named correctly but mis-posted is a different kind of wrong
  // from not knowing the accounts, and worth saying so.
  const verdict: Verdict =
    matched + sideErrors + amountErrors === expected.length && submitted.length === expected.length
      ? "close"
      : "wrong";

  return { verdict, notes, unbalanced };
}
