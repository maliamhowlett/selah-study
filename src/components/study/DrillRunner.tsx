"use client";

import { useMemo, useState } from "react";
import {
  CLASSIFICATION_DRILLS,
  DRILL_CHAPTERS,
  ACCOUNT_DRILLS,
  JOURNAL_DRILLS,
  STATEMENT_DRILLS,
  type AccountDrill,
  type ClassificationDrill,
  type EntryLine,
  type JournalDrill,
  type StatementDrill,
} from "@/lib/study/acct-drills";
import { gradeEntry, normalizeAccount, type GradeResult, type SubmittedLine } from "@/lib/study/grade-entry";
import { useStoredValue, writeStoredValue } from "@/lib/study/local-store";
import AskTutor from "./AskTutor";

// "shown" is asking to be taught, which is not the same as getting it wrong —
// conflating them makes the whole record useless for deciding what to study.
type Result = "got" | "missed" | "shown";
type Kind = "account" | "journal" | "classification" | "statement";

/** What was stored per drill. The verdict matters as much as the result:
 * "close" means the accounts were right and the posting wasn't, which is a
 * different problem from not knowing the accounts at all. */
interface Record_ {
  result: Result;
  verdict?: string;
}

const STORE_KEY = "selah:drills:acct-20000";
const BLANK: SubmittedLine = { account: "", debit: "", credit: "" };

function parseResults(raw: string | null): Record<string, Record_> {
  try {
    const parsed = raw ? (JSON.parse(raw) as Record<string, Result | Record_>) : {};
    // Earlier versions stored a bare "got"/"missed" string.
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [
        k,
        typeof v === "string" ? { result: v } : v,
      ]),
    );
  } catch {
    return {};
  }
}

/** Anything not answered correctly on the first go is still to be learned. */
function needsWork(record?: Record_): boolean {
  return record !== undefined && record.result !== "got";
}

const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** A credit followed by a debit means a second entry has begun. */
function splitEntries(lines: EntryLine[]): EntryLine[][] {
  const entries: EntryLine[][] = [];
  let current: EntryLine[] = [];
  let seenCredit = false;
  for (const line of lines) {
    if (line.debit !== undefined && seenCredit) {
      entries.push(current);
      current = [];
      seenCredit = false;
    }
    if (line.credit !== undefined) seenCredit = true;
    current.push(line);
  }
  if (current.length) entries.push(current);
  return entries;
}

function JournalEntry({ lines }: { lines: EntryLine[] }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {lines.map((line, i) => (
          <tr key={`${line.account}-${i}`}>
            <td
              className={`py-1 pr-4 ${line.credit !== undefined ? "pl-6 text-muted" : "text-foreground"}`}
            >
              {line.account}
            </td>
            <td className="w-24 py-1 text-right tabular-nums text-foreground">
              {line.debit !== undefined ? money(line.debit) : ""}
            </td>
            <td className="w-24 py-1 text-right tabular-nums text-foreground">
              {line.credit !== undefined ? money(line.credit) : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface Props {
  accentText: string;
  accentBorder: string;
  accentTint: string;
}

export default function DrillRunner({ accentText, accentBorder, accentTint }: Props) {
  const [kind, setKind] = useState<Kind>("journal");
  const [chapter, setChapter] = useState<string>("all");
  const [missedOnly, setMissedOnly] = useState(false);
  const [index, setIndex] = useState(0);

  // Journal attempt state
  const [rows, setRows] = useState<SubmittedLine[]>([{ ...BLANK }, { ...BLANK }]);
  const [grade, setGrade] = useState<GradeResult | null>(null);

  // Classification attempt state
  const [pickStatement, setPickStatement] = useState<string | null>(null);
  const [pickBalance, setPickBalance] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  // Statement attempt state — a single typed number.
  const [figure, setFigure] = useState("");

  // Account-vocabulary attempt state.
  const [guess, setGuess] = useState("");
  const [guessSide, setGuessSide] = useState<string | null>(null);

  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const raw = useStoredValue(STORE_KEY);
  const results = useMemo(() => parseResults(raw), [raw]);

  const deck = useMemo(() => {
    if (kind === "account") {
      return ACCOUNT_DRILLS.filter(
        (d) =>
          (chapter === "all" || d.chapter === chapter) &&
          (!missedOnly || needsWork(results[d.id])),
      );
    }
    if (kind === "statement") {
      return STATEMENT_DRILLS.filter((d) => !missedOnly || needsWork(results[d.id]));
    }
    if (kind === "classification") {
      return CLASSIFICATION_DRILLS.filter((d) => !missedOnly || needsWork(results[d.id]));
    }
    return JOURNAL_DRILLS.filter(
      (d) =>
        (chapter === "all" || d.chapter === chapter) &&
        (!missedOnly || needsWork(results[d.id])),
    );
  }, [kind, chapter, missedOnly, results]);

  const safeIndex = deck.length === 0 ? 0 : Math.min(index, deck.length - 1);
  const current = deck[safeIndex];

  const missedCount = Object.values(results).filter((r) => r.result === "missed").length;
  const gotCount = Object.values(results).filter((r) => r.result === "got").length;
  const shownCount = Object.values(results).filter((r) => r.result === "shown").length;
  const needWork = missedCount + shownCount;

  /** Where the misses are concentrated, so a weak chapter is visible as one. */
  const weakSpots = useMemo(() => {
    const byChapter = new Map<string, { missed: number; total: number }>();
    for (const drill of JOURNAL_DRILLS) {
      const result = results[drill.id];
      if (!result) continue;
      const row = byChapter.get(drill.chapter) ?? { missed: 0, total: 0 };
      row.total += 1;
      if (result.result !== "got") row.missed += 1;
      byChapter.set(drill.chapter, row);
    }
    return [...byChapter.entries()]
      .filter(([, v]) => v.missed > 0)
      .sort((a, b) => b[1].missed / b[1].total - a[1].missed / a[1].total);
  }, [results]);

  const record = (id: string, result: Result, verdict?: string) => {
    // Only the first attempt counts, so a second look can't launder a miss.
    if (results[id]) return;
    writeStoredValue(STORE_KEY, JSON.stringify({ ...results, [id]: { result, verdict } }));
  };

  const resetAttempt = () => {
    setRows([{ ...BLANK }, { ...BLANK }]);
    setGrade(null);
    setPickStatement(null);
    setPickBalance(null);
    setFigure("");
    setGuess("");
    setGuessSide(null);
    setChecked(false);
    setRevealed(false);
  };

  const goNext = () => {
    resetAttempt();
    setIndex(safeIndex + 1 >= deck.length ? 0 : safeIndex + 1);
  };

  const reset = (next: Partial<{ kind: Kind; chapter: string; missedOnly: boolean }>) => {
    if (next.kind !== undefined) setKind(next.kind);
    if (next.chapter !== undefined) setChapter(next.chapter);
    if (next.missedOnly !== undefined) setMissedOnly(next.missedOnly);
    setIndex(0);
    resetAttempt();
  };

  const checkJournal = () => {
    const drill = current as JournalDrill;
    const result = gradeEntry(drill.entry, rows);
    setGrade(result);
    if (result.verdict !== "empty") {
      record(drill.id, result.verdict === "correct" ? "got" : "missed", result.verdict);
    }
  };

  const checkClassification = () => {
    const drill = current as ClassificationDrill;
    setChecked(true);
    const right =
      pickStatement === drill.statement && pickBalance === drill.normalBalance;
    record(drill.id, right ? "got" : "missed", right ? "correct" : "wrong");
  };

  const checkStatement = () => {
    const drill = current as StatementDrill;
    setChecked(true);
    const typed = Number(figure.replace(/[$,\s]/g, ""));
    const right = Number.isFinite(typed) && Math.abs(typed - drill.answer) < 0.005;
    record(drill.id, right ? "got" : "missed", right ? "correct" : "wrong");
  };

  const statementRight = () => {
    const drill = current as StatementDrill;
    const typed = Number(figure.replace(/[$,\s]/g, ""));
    return Number.isFinite(typed) && Math.abs(typed - drill.answer) < 0.005;
  };

  const accountRight = () => {
    const drill = current as AccountDrill;
    return (
      normalizeAccount(guess) === normalizeAccount(drill.account) &&
      guessSide === drill.side
    );
  };

  const checkAccount = () => {
    const drill = current as AccountDrill;
    setChecked(true);
    const right = accountRight();
    record(drill.id, right ? "got" : "missed", right ? "correct" : "wrong");
  };

  /** Reveal without being marked wrong for not knowing it yet. */
  const showMe = () => {
    setRevealed(true);
    if (current) record(current.id, "shown", "shown");
  };

  const copyResults = async () => {
    const lines = ["ACCT 20000 drill results", ""];
    for (const [label, list] of [
      ["Journal entries", JOURNAL_DRILLS as { id: string; chapter?: string; prompt?: string; account?: string }[]],
      ["Account classification", CLASSIFICATION_DRILLS as { id: string; chapter?: string; prompt?: string; account?: string }[]],
      ["Which account", ACCOUNT_DRILLS.map((d) => ({ id: d.id, chapter: d.chapter, prompt: d.situation })) as { id: string; chapter?: string; prompt?: string; account?: string }[]],
      ["Statement subtotals", STATEMENT_DRILLS.map((d) => ({ id: d.id, chapter: d.chapter, prompt: d.question })) as { id: string; chapter?: string; prompt?: string; account?: string }[]],
    ] as const) {
      const done = list.filter((d) => results[d.id]);
      if (done.length === 0) continue;
      lines.push(`${label}:`);
      for (const d of done) {
        const stored = results[d.id];
        const mark =
          stored.result === "got"
            ? "correct"
            : stored.result === "shown"
              ? "SHOWN ME (didn't attempt)"
              : stored.verdict === "close"
                ? "WRONG (right accounts, wrong posting)"
                : "WRONG";
        lines.push(`  [${mark}] ${d.chapter ?? ""} ${d.prompt ?? d.account ?? d.id}`.slice(0, 140));
      }
      lines.push("");
    }
    lines.push(`Totals: ${gotCount} right, ${missedCount} missed.`);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be blocked; the counts on screen still tell the story.
    }
  };

  const chipOff =
    "rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:bg-surface-hover hover:text-foreground";
  const chipOn = `rounded-full border px-3 py-1.5 text-xs ${accentBorder} ${accentTint} ${accentText}`;
  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";

  const tutorContext = !current
    ? undefined
    : kind === "journal"
      ? `Journal entry drill (${(current as JournalDrill).chapter}): ${(current as JournalDrill).prompt}\nCorrect entry: ${(current as JournalDrill).entry
          .map((l) => `${l.account} ${l.debit !== undefined ? `debit ${l.debit}` : `credit ${l.credit}`}`)
          .join("; ")}`
      : kind === "account"
        ? `Which-account drill. Situation: ${(current as AccountDrill).situation}\nAnswer: ${(current as AccountDrill).account}, ${(current as AccountDrill).side}.`
      : kind === "statement"
        ? `Statement figure drill. Data:\n${(current as StatementDrill).scenario}\nQuestion: ${(current as StatementDrill).question}\nAnswer: ${(current as StatementDrill).answer}`
        : `Account classification drill. Account: ${(current as ClassificationDrill).account}. It belongs on the ${(current as ClassificationDrill).statement}, in ${(current as ClassificationDrill).section}, normal balance ${(current as ClassificationDrill).normalBalance}.`;

  const showMeButton = (
    <button
      type="button"
      onClick={showMe}
      className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
    >
      I don&apos;t know this one — show me
    </button>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => reset({ kind: "account" })} className={kind === "account" ? chipOn : chipOff}>
          Which account
        </button>
        <button type="button" onClick={() => reset({ kind: "journal" })} className={kind === "journal" ? chipOn : chipOff}>
          Journal entries
        </button>
        <button
          type="button"
          onClick={() => reset({ kind: "classification" })}
          className={kind === "classification" ? chipOn : chipOff}
        >
          Where does it go
        </button>
        <button
          type="button"
          onClick={() => reset({ kind: "statement" })}
          className={kind === "statement" ? chipOn : chipOff}
        >
          Statement figures
        </button>
        {needWork > 0 && (
          <button
            type="button"
            onClick={() => reset({ missedOnly: !missedOnly })}
            className={`ml-auto ${missedOnly ? chipOn : chipOff}`}
          >
            Only what needs work ({needWork})
          </button>
        )}
      </div>

      {(kind === "journal" || kind === "account") && (
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => reset({ chapter: "all" })} className={chapter === "all" ? chipOn : chipOff}>
            All chapters
          </button>
          {DRILL_CHAPTERS.map((ch) => (
            <button key={ch} type="button" onClick={() => reset({ chapter: ch })} className={chapter === ch ? chipOn : chipOff}>
              {ch}
            </button>
          ))}
        </div>
      )}

      {!current ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-foreground">
            {missedOnly
              ? "Nothing left in the missed pile — that's the whole point of it."
              : "No drills match that filter."}
          </p>
          {missedOnly && (
            <button
              type="button"
              onClick={() => reset({ missedOnly: false })}
              className="mt-4 rounded-full border border-border px-5 py-2.5 text-sm text-foreground hover:bg-surface-hover"
            >
              Back to all of them
            </button>
          )}
        </div>
      ) : (
        <article className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <span className={`text-xs uppercase tracking-[0.15em] ${accentText}`}>
              {kind === "account"
                ? `${(current as AccountDrill).chapter} · which account`
                : kind === "journal"
                ? (current as JournalDrill).chapter
                : kind === "statement"
                  ? `${(current as StatementDrill).chapter} · statement figure`
                  : "Account classification"}
            </span>
            <span className="text-xs tabular-nums text-muted">
              {safeIndex + 1} of {deck.length}
            </span>
          </div>

          {kind === "account" ? (
            <>
              <p className="leading-relaxed text-foreground">
                {(current as AccountDrill).situation}
              </p>
              <p className="mt-2 text-sm text-muted">
                Name the account, and say which side it goes on.
              </p>

              <input
                value={guess}
                disabled={checked || revealed}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Account name"
                aria-label="Account name"
                className={`${inputClass} mt-4 max-w-sm`}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {(["Debit", "Credit"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={checked || revealed}
                    onClick={() => setGuessSide(option)}
                    className={guessSide === option ? chipOn : chipOff}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {!checked && !revealed && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={!guess.trim() || !guessSide}
                    onClick={checkAccount}
                    className="rounded-full gradient-primary px-6 py-2 text-sm text-white shadow-md hover:scale-[1.02] disabled:opacity-50"
                  >
                    Check it
                  </button>
                  {showMeButton}
                </div>
              )}
            </>
          ) : kind === "statement" ? (
            <>
              <pre className="overflow-x-auto whitespace-pre rounded-xl bg-background p-4 font-mono text-[13px] leading-relaxed text-foreground">
                {(current as StatementDrill).scenario}
              </pre>
              <p className="mt-4 text-lg text-foreground">
                {(current as StatementDrill).question}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-muted">$</span>
                <input
                  value={figure}
                  inputMode="decimal"
                  disabled={checked}
                  onChange={(e) => setFigure(e.target.value)}
                  placeholder="0"
                  aria-label="Your answer"
                  className={`${inputClass} max-w-[12rem] text-right tabular-nums`}
                />
                {!checked && !revealed && (
                  <button
                    type="button"
                    disabled={!figure.trim()}
                    onClick={checkStatement}
                    className="rounded-full gradient-primary px-6 py-2 text-sm text-white shadow-md hover:scale-[1.02] disabled:opacity-50"
                  >
                    Check it
                  </button>
                )}
              </div>
              {!checked && !revealed && <div className="mt-3">{showMeButton}</div>}
            </>
          ) : kind === "journal" ? (
            <>
              <p className="leading-relaxed text-foreground">{(current as JournalDrill).prompt}</p>
              {splitEntries((current as JournalDrill).entry).length > 1 && (
                <p className="mt-2 text-xs text-muted">
                  This answer is more than one entry — put every line in the grid.
                </p>
              )}

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[26rem] text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-muted">
                        Account
                      </th>
                      <th className="w-28 pb-2 pl-2 text-right text-[10px] font-medium uppercase tracking-[0.15em] text-muted">
                        Debit
                      </th>
                      <th className="w-28 pb-2 pl-2 text-right text-[10px] font-medium uppercase tracking-[0.15em] text-muted">
                        Credit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}>
                        <td className="py-1 pr-2">
                          <input
                            value={row.account}
                            disabled={grade !== null && grade.verdict !== "empty"}
                            onChange={(e) =>
                              setRows((r) => r.map((x, j) => (j === i ? { ...x, account: e.target.value } : x)))
                            }
                            placeholder="Account name"
                            aria-label={`Account, line ${i + 1}`}
                            className={inputClass}
                          />
                        </td>
                        <td className="py-1 pl-2">
                          <input
                            value={row.debit}
                            inputMode="decimal"
                            disabled={grade !== null && grade.verdict !== "empty"}
                            onChange={(e) =>
                              setRows((r) => r.map((x, j) => (j === i ? { ...x, debit: e.target.value } : x)))
                            }
                            aria-label={`Debit, line ${i + 1}`}
                            className={`${inputClass} text-right tabular-nums`}
                          />
                        </td>
                        <td className="py-1 pl-2">
                          <input
                            value={row.credit}
                            inputMode="decimal"
                            disabled={grade !== null && grade.verdict !== "empty"}
                            onChange={(e) =>
                              setRows((r) => r.map((x, j) => (j === i ? { ...x, credit: e.target.value } : x)))
                            }
                            aria-label={`Credit, line ${i + 1}`}
                            className={`${inputClass} text-right tabular-nums`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(grade === null || grade.verdict === "empty") && !revealed && (
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setRows((r) => [...r, { ...BLANK }])}
                    className="rounded-full border border-border px-4 py-2 text-xs text-muted hover:bg-surface-hover hover:text-foreground"
                  >
                    + Another line
                  </button>
                  <button
                    type="button"
                    onClick={checkJournal}
                    className="rounded-full gradient-primary px-6 py-2 text-sm text-white shadow-md hover:scale-[1.02]"
                  >
                    Check it
                  </button>
                  {showMeButton}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-muted">Which statement, and what is its normal balance?</p>
              <p className="mt-2 text-2xl italic text-foreground">
                {(current as ClassificationDrill).account}
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {(["Balance sheet", "Income statement"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      disabled={checked}
                      onClick={() => setPickStatement(option)}
                      className={pickStatement === option ? chipOn : chipOff}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["Debit", "Credit"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      disabled={checked}
                      onClick={() => setPickBalance(option)}
                      className={pickBalance === option ? chipOn : chipOff}
                    >
                      {option} balance
                    </button>
                  ))}
                </div>
              </div>

              {!checked && !revealed && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={!pickStatement || !pickBalance}
                    onClick={checkClassification}
                    className="rounded-full gradient-primary px-6 py-2 text-sm text-white shadow-md hover:scale-[1.02] disabled:opacity-50"
                  >
                    Check it
                  </button>
                  {showMeButton}
                </div>
              )}
            </>
          )}

          {/* --- marked --- */}
          {(revealed ||
            (kind === "journal" && grade && grade.verdict !== "empty") ||
            ((kind === "classification" || kind === "statement" || kind === "account") &&
              checked)) && (
            <div className="mt-5 flex flex-col gap-4">
              {!revealed && kind === "journal" && grade && (
                <>
                  <p
                    className={`text-lg ${
                      grade.verdict === "correct" ? "text-success" : grade.verdict === "close" ? "text-assignment" : "text-exam"
                    }`}
                  >
                    {grade.verdict === "correct"
                      ? "Correct."
                      : grade.verdict === "close"
                        ? "Right accounts, wrong posting."
                        : "Not right."}
                  </p>
                  {grade.verdict !== "correct" && (
                    <ul className="flex flex-col gap-1.5">
                      {grade.notes.map((note) => (
                        <li key={note} className="text-sm leading-relaxed text-foreground">
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {!revealed && kind === "account" && (
                <p className={`text-lg ${accountRight() ? "text-success" : "text-exam"}`}>
                  {accountRight() ? "Correct." : "Not right."}
                </p>
              )}

              {!revealed && kind === "statement" && (
                <p className={`text-lg ${statementRight() ? "text-success" : "text-exam"}`}>
                  {statementRight()
                    ? "Correct."
                    : `Not right — the answer is $${(current as StatementDrill).answer.toLocaleString("en-US")}.`}
                </p>
              )}

              {!revealed && kind === "classification" && (
                <p
                  className={`text-lg ${
                    pickStatement === (current as ClassificationDrill).statement &&
                    pickBalance === (current as ClassificationDrill).normalBalance
                      ? "text-success"
                      : "text-exam"
                  }`}
                >
                  {pickStatement === (current as ClassificationDrill).statement &&
                  pickBalance === (current as ClassificationDrill).normalBalance
                    ? "Correct."
                    : "Not right."}
                </p>
              )}

              <div className="rounded-xl bg-background p-4">
                {kind === "account" ? (
                  <p className="text-sm">
                    <span className="text-foreground">
                      {(current as AccountDrill).account}
                    </span>
                    <span className="text-muted">
                      {" — "}
                      {(current as AccountDrill).side.toLowerCase()}
                    </span>
                  </p>
                ) : kind === "statement" ? (
                  <pre className="overflow-x-auto whitespace-pre font-mono text-[13px] leading-relaxed text-foreground">
                    {(current as StatementDrill).working}
                  </pre>
                ) : kind === "journal" ? (
                  <div className="flex flex-col gap-4">
                    {splitEntries((current as JournalDrill).entry).map((lines, i, all) => (
                      <div key={i}>
                        {all.length > 1 && (
                          <p className="mb-1 text-[10px] uppercase tracking-[0.15em] text-muted">
                            Entry {i + 1}
                          </p>
                        )}
                        <JournalEntry lines={lines} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <dl className="flex flex-col gap-2 text-sm">
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-muted">Statement</dt>
                      <dd className="text-foreground">{(current as ClassificationDrill).statement}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-muted">Section</dt>
                      <dd className="text-foreground">{(current as ClassificationDrill).section}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-muted">Normal balance</dt>
                      <dd className="text-foreground">{(current as ClassificationDrill).normalBalance}</dd>
                    </div>
                  </dl>
                )}
              </div>

              {(() => {
                const aside =
                  kind === "statement"
                    ? (current as StatementDrill).trap
                    : kind === "account"
                      ? (current as AccountDrill).why
                      : (current as JournalDrill | ClassificationDrill).note;
                return aside ? (
                  <p className="text-sm leading-relaxed text-muted">{aside}</p>
                ) : null;
              })()}

              {revealed && (
                <p className="text-sm text-muted">
                  Filed as one to come back to, not as a wrong answer.
                </p>
              )}

              <AskTutor
                context={tutorContext}
                accentText={accentText}
                accentBorder={accentBorder}
                accentTint={accentTint}
              />

              <button
                type="button"
                onClick={goNext}
                className="self-start rounded-full border border-border px-5 py-2.5 text-sm text-foreground hover:bg-surface-hover"
              >
                Next →
              </button>
            </div>
          )}
        </article>
      )}

      {(gotCount > 0 || missedCount > 0) && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-foreground">
            <span className="font-semibold text-success">{gotCount}</span> right ·{" "}
            <span className="font-semibold text-exam">{missedCount}</span> wrong
            {shownCount > 0 && (
              <>
                {" · "}
                <span className="font-semibold text-assignment">{shownCount}</span> to learn
              </>
            )}
          </p>

          {weakSpots.length > 0 && (
            <>
              <p className="mt-4 mb-2 text-[10px] uppercase tracking-[0.2em] text-muted">
                Where the misses are
              </p>
              <ul className="flex flex-col gap-1.5">
                {weakSpots.map(([ch, v]) => (
                  <li key={ch} className="flex items-center gap-3 text-sm">
                    <span className="w-16 shrink-0 text-foreground">{ch}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-background">
                      <span
                        className="block h-full rounded-full bg-exam"
                        style={{ width: `${Math.round((v.missed / v.total) * 100)}%` }}
                      />
                    </span>
                    <span className="shrink-0 tabular-nums text-muted">
                      {v.missed}/{v.total}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <button
            type="button"
            onClick={copyResults}
            className="mt-5 rounded-full border border-border px-4 py-2 text-xs text-muted hover:bg-surface-hover hover:text-foreground"
          >
            {copied ? "Copied — paste it to Claude" : "Copy my results"}
          </button>
        </div>
      )}
    </div>
  );
}
