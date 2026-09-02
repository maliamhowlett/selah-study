"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CATEGORY_STYLES } from "@/lib/calendar/categories";
import { COURSE_STYLES } from "@/lib/calendar/courses";
import type { DateProposal } from "@/lib/calendar/import";
import type { EventInput } from "@/lib/calendar/types";

interface ImportGroup {
  courseCode: string;
  title: string;
  /** Present on the hand-transcribed groups: what they are and where from. */
  blurb?: string;
  proposals: DateProposal[];
}

/** The RRULE cut-off, computed here so it lands at local midnight rather than
 * wherever the server happens to be. Mirrors the event form. */
function untilInstant(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d, 23, 59, 59).toISOString();
}

interface ImportPanelProps {
  onImported: () => void;
}

type Row = DateProposal & { selected: boolean };

export default function ImportPanel({ onImported }: ImportPanelProps) {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<ImportGroup[]>([]);
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ created: number; failed: { title: string; reason: string }[] } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/calendar/import");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't read your class dates.");

      const loaded = data.groups as ImportGroup[];
      setGroups(loaded);
      setRows(
        Object.fromEntries(
          loaded.flatMap((group) =>
            group.proposals.map((proposal) => [
              proposal.key,
              // Anything with a readable date starts ticked; entries with no
              // date can't be imported until one is typed in.
              { ...proposal, selected: proposal.day !== null },
            ]),
          ),
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read your class dates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && groups.length === 0 && !loading) load();
  }, [open, groups.length, loading, load]);

  const selectedRows = useMemo(
    () => Object.values(rows).filter((row) => row.selected && row.day),
    [rows],
  );

  const update = (key: string, patch: Partial<Row>) =>
    setRows((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  /** Formats "2026-09-23" as "Wed Sep 23" without tripping over UTC parsing. */
  const prettyDay = (day: string) => {
    const [y, m, d] = day.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const applySuggestion = (row: Row) => {
    if (!row.suggestedDay) return;
    update(row.key, { day: row.suggestedDay, warning: undefined, suggestedDay: undefined, selected: true });
  };

  const shiftWholeGroup = (group: ImportGroup) => {
    setRows((prev) => {
      const next = { ...prev };
      for (const proposal of group.proposals) {
        const row = next[proposal.key];
        if (row?.suggestedDay) {
          next[row.key] = {
            ...row,
            day: row.suggestedDay,
            warning: undefined,
            suggestedDay: undefined,
            selected: true,
          };
        }
      }
      return next;
    });
  };

  const handleImport = async () => {
    setImporting(true);
    setError("");
    setResult(null);

    const events: EventInput[] = selectedRows.map((row) => {
      const allDay = !row.startTime;
      return {
        title: row.title,
        description: row.description,
        location: row.location,
        allDay,
        start: allDay ? row.day! : `${row.day}T${row.startTime}`,
        end: allDay ? row.day! : `${row.day}T${row.endTime ?? row.startTime}`,
        category: row.category,
        course: row.course,
        repeat: row.repeat
          ? {
              days: row.repeat.days,
              until: untilInstant(row.repeat.untilDay),
            }
          : undefined,
      };
    });

    try {
      const res = await fetch("/api/calendar/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok && !data.created) throw new Error(data.error || "Import failed.");

      setResult({ created: (data.created ?? []).length, failed: data.failed ?? [] });
      // Untick what landed so a second run can't duplicate it.
      setRows((prev) => {
        const next = { ...prev };
        for (const row of selectedRows) next[row.key] = { ...next[row.key], selected: false };
        return next;
      });
      onImported();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-3xl border border-dashed border-border bg-surface px-6 py-4 text-left text-sm text-muted transition-colors hover:border-primary hover:text-foreground"
      >
        <span className="text-foreground">Import dates from your classes</span>
        <span className="ml-2">— pull exams and deadlines out of your syllabi</span>
      </button>
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-surface p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl italic text-foreground">import from your classes</h2>
          <p className="mt-1 text-sm text-muted">
            Check each date against your syllabus before importing — these were transcribed
            from your course pages, not read from Google.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close import panel"
          className="rounded-full p-2 text-muted hover:bg-surface-hover hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {loading && <p className="text-sm text-muted">Reading your syllabi…</p>}

      {error && (
        <div className="mb-4 rounded-2xl border border-error/40 bg-error/5 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {result && (
        <div className="mb-4 rounded-2xl border border-success/40 bg-success/10 p-3 text-sm text-foreground">
          Added {result.created} {result.created === 1 ? "date" : "dates"} to your calendar.
          {result.failed.length > 0 && (
            <ul className="mt-2 space-y-1 text-error">
              {result.failed.map((f, i) => (
                <li key={i}>
                  {f.title}: {f.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!loading && groups.length === 0 && !error && (
        <p className="text-sm text-muted">
          None of your classes have key dates saved yet.
        </p>
      )}

      {groups.map((group) => (
        <div key={group.courseCode} className="mb-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-muted">
              {group.courseCode} · {group.title}
            </h3>
            {(() => {
              const flagged = group.proposals.filter((p) => rows[p.key]?.suggestedDay).length;
              if (flagged === 0) return null;
              return (
                <button
                  type="button"
                  onClick={() => shiftWholeGroup(group)}
                  className="rounded-full border border-assignment/50 px-3 py-1 text-[11px] text-assignment hover:bg-assignment-light"
                >
                  Shift all {flagged} to match their weekday
                </button>
              );
            })()}
          </div>

          {group.blurb && (
            <p className="mb-2 max-w-2xl text-xs leading-relaxed text-muted">
              {group.blurb}
            </p>
          )}

          <div className="space-y-1.5">
            {group.proposals.map((proposal) => {
              const row = rows[proposal.key];
              if (!row) return null;
              const style = CATEGORY_STYLES[row.category];
              const courseStyle = COURSE_STYLES[row.course ?? "none"];

              return (
                <div
                  key={row.key}
                  className={`rounded-xl border p-3 ${
                    row.warning ? "border-assignment/50 bg-assignment-light/40" : "border-border"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="checkbox"
                      checked={row.selected}
                      disabled={!row.day}
                      onChange={(e) => update(row.key, { selected: e.target.checked })}
                      aria-label={`Import ${row.label}`}
                      className="h-4 w-4 accent-[var(--primary)] disabled:opacity-40"
                    />

                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${courseStyle.accent}`}
                      title={courseStyle.code}
                      aria-hidden="true"
                    />

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider ${style.badge}`}
                    >
                      {style.label}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {row.label}
                    </span>

                    {row.repeat ? (
                      <span className="shrink-0 text-xs text-muted">{row.raw}</span>
                    ) : (
                      <input
                        type="date"
                        value={row.day ?? ""}
                        onChange={(e) =>
                          update(row.key, {
                            day: e.target.value || null,
                            selected: Boolean(e.target.value),
                            warning: undefined,
                          })
                        }
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground"
                      />
                    )}

                    {row.startTime && (
                      <span className="text-xs text-muted">
                        {row.startTime}–{row.endTime}
                      </span>
                    )}
                  </div>

                  {row.warning && (
                    <div className="mt-2 pl-7">
                      <p className="text-xs text-assignment">⚠ {row.warning}</p>
                      {row.suggestedDay && (
                        <button
                          type="button"
                          onClick={() => applySuggestion(row)}
                          className="mt-1.5 rounded-full border border-assignment/50 px-3 py-1 text-[11px] text-assignment hover:bg-assignment-light"
                        >
                          Use {prettyDay(row.suggestedDay)} instead
                        </button>
                      )}
                    </div>
                  )}
                  {row.note && (
                    <p className="mt-2 pl-7 text-xs text-muted">{row.note}</p>
                  )}
                  {/* Repeating rows already show their pattern on the row
                      itself, so repeating the source line would just be noise. */}
                  {row.raw && !row.repeat && !row.warning && !row.note && (
                    <p className="mt-1 pl-7 text-[11px] text-muted">
                      from your syllabus: &ldquo;{row.raw}&rdquo;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {groups.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={handleImport}
            disabled={importing || selectedRows.length === 0}
            className="rounded-full gradient-primary px-6 py-2.5 text-sm text-white shadow-md hover:scale-[1.02] disabled:opacity-50"
          >
            {importing
              ? "Adding…"
              : `Add ${selectedRows.length} ${selectedRows.length === 1 ? "date" : "dates"} to Google Calendar`}
          </button>
          <span className="text-xs text-muted">
            Nothing is written until you press this.
          </span>
        </div>
      )}
    </section>
  );
}
