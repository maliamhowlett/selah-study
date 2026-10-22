"use client";

import { useMemo, useState } from "react";
import {
  CLASSIFICATION_DRILLS,
  DRILL_CHAPTERS,
  JOURNAL_DRILLS,
  type EntryLine,
  type JournalDrill,
} from "@/lib/study/acct-drills";
import { useStoredValue, writeStoredValue } from "@/lib/study/local-store";

type Result = "got" | "missed";
type Kind = "journal" | "classification";

const STORE_KEY = "selah:drills:acct-20000";

function parseResults(raw: string | null): Record<string, Result> {
  try {
    return raw ? (JSON.parse(raw) as Record<string, Result>) : {};
  } catch {
    return {};
  }
}

const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Splits a drill's lines into separate journal entries. A credit followed by a
 * debit means the first entry has closed — which is how the two-entry answers
 * (a recovery, a perpetual sale) get ruled apart instead of running together.
 */
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
  const [revealed, setRevealed] = useState(false);

  const raw = useStoredValue(STORE_KEY);
  const results = useMemo(() => parseResults(raw), [raw]);

  const deck = useMemo(() => {
    if (kind === "classification") {
      return CLASSIFICATION_DRILLS.filter(
        (d) => !missedOnly || results[d.id] === "missed",
      );
    }
    return JOURNAL_DRILLS.filter(
      (d) =>
        (chapter === "all" || d.chapter === chapter) &&
        (!missedOnly || results[d.id] === "missed"),
    );
  }, [kind, chapter, missedOnly, results]);

  // Changing a filter can leave the cursor past the end of the new deck.
  const safeIndex = deck.length === 0 ? 0 : Math.min(index, deck.length - 1);
  const current = deck[safeIndex];

  const missedCount = Object.values(results).filter((r) => r === "missed").length;
  const gotCount = Object.values(results).filter((r) => r === "got").length;

  const grade = (result: Result) => {
    if (!current) return;
    writeStoredValue(
      STORE_KEY,
      JSON.stringify({ ...results, [current.id]: result }),
    );
    setRevealed(false);
    setIndex(safeIndex + 1 >= deck.length ? 0 : safeIndex + 1);
  };

  const reset = (next: Partial<{ kind: Kind; chapter: string; missedOnly: boolean }>) => {
    if (next.kind !== undefined) setKind(next.kind);
    if (next.chapter !== undefined) setChapter(next.chapter);
    if (next.missedOnly !== undefined) setMissedOnly(next.missedOnly);
    setIndex(0);
    setRevealed(false);
  };

  const chipOff =
    "rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:bg-surface-hover hover:text-foreground";
  const chipOn = `rounded-full border px-3 py-1.5 text-xs ${accentBorder} ${accentTint} ${accentText}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => reset({ kind: "journal" })}
          className={kind === "journal" ? chipOn : chipOff}
        >
          Journal entries
        </button>
        <button
          type="button"
          onClick={() => reset({ kind: "classification" })}
          className={kind === "classification" ? chipOn : chipOff}
        >
          Where does it go
        </button>

        {missedCount > 0 && (
          <button
            type="button"
            onClick={() => reset({ missedOnly: !missedOnly })}
            className={`ml-auto ${missedOnly ? chipOn : chipOff}`}
          >
            Only what I missed ({missedCount})
          </button>
        )}
      </div>

      {kind === "journal" && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => reset({ chapter: "all" })}
            className={chapter === "all" ? chipOn : chipOff}
          >
            All chapters
          </button>
          {DRILL_CHAPTERS.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => reset({ chapter: ch })}
              className={chapter === ch ? chipOn : chipOff}
            >
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
              {kind === "journal"
                ? (current as JournalDrill).chapter
                : "Account classification"}
            </span>
            <span className="text-xs tabular-nums text-muted">
              {safeIndex + 1} of {deck.length}
            </span>
          </div>

          {kind === "journal" ? (
            <p className="leading-relaxed text-foreground">
              {(current as JournalDrill).prompt}
            </p>
          ) : (
            <div>
              <p className="text-sm text-muted">
                Which statement, which section, and what is its normal balance?
              </p>
              <p className="mt-2 text-2xl italic text-foreground">
                {"account" in current ? current.account : ""}
              </p>
            </div>
          )}

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-5 rounded-full gradient-primary px-6 py-2.5 text-sm text-white shadow-md hover:scale-[1.02]"
            >
              Check my answer
            </button>
          ) : (
            <>
              <div className="mt-5 rounded-xl bg-background p-4">
                {kind === "journal" ? (
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
                  "statement" in current && (
                    <dl className="flex flex-col gap-2 text-sm">
                      <div className="flex gap-3">
                        <dt className="w-32 shrink-0 text-muted">Statement</dt>
                        <dd className="text-foreground">{current.statement}</dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="w-32 shrink-0 text-muted">Section</dt>
                        <dd className="text-foreground">{current.section}</dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="w-32 shrink-0 text-muted">Normal balance</dt>
                        <dd className="text-foreground">{current.normalBalance}</dd>
                      </div>
                    </dl>
                  )
                )}
              </div>

              {current.note && (
                <p className="mt-3 text-sm leading-relaxed text-muted">{current.note}</p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => grade("got")}
                  className="rounded-full border border-success px-5 py-2.5 text-sm text-success hover:bg-success/10"
                >
                  I got it
                </button>
                <button
                  type="button"
                  onClick={() => grade("missed")}
                  className="rounded-full border border-exam px-5 py-2.5 text-sm text-exam hover:bg-exam-light"
                >
                  I missed it
                </button>
              </div>
            </>
          )}
        </article>
      )}

      {(gotCount > 0 || missedCount > 0) && (
        <p className="text-sm text-muted">
          <span className="font-semibold text-success">{gotCount}</span> right ·{" "}
          <span className="font-semibold text-exam">{missedCount}</span> to come back to
          {missedCount > 0 && " — Monday's job is this pile, emptied."}
        </p>
      )}
    </div>
  );
}
