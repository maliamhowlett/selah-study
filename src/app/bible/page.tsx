"use client";

import { useState, useCallback, useEffect } from "react";
import BibleVerse from "@/components/BibleVerse";
import {
  READING_PLANS,
  getPlanProgress,
  startPlan,
  toggleDay,
  removePlan,
  type PlanProgress,
} from "@/lib/reading-plans";

export default function BiblePage() {
  const [searchRef, setSearchRef] = useState("");
  const [verseResult, setVerseResult] = useState<{ text: string; reference: string } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [activeTab, setActiveTab] = useState<"verse" | "plans">("verse");
  const [progress, setProgress] = useState<PlanProgress[]>([]);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(getPlanProgress());
    setLoaded(true);
  }, []);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchRef.trim()) return;

      setSearching(true);
      setSearchError("");
      setVerseResult(null);

      try {
        const res = await fetch(
          `https://bible-api.com/${encodeURIComponent(searchRef.trim())}`
        );
        if (!res.ok) throw new Error("Verse not found");
        const data = await res.json();
        setVerseResult({ text: data.text, reference: data.reference });
      } catch {
        setSearchError(
          "Couldn\u2019t find that verse. Try a format like \"John 3:16\" or \"Psalm 23\"."
        );
      } finally {
        setSearching(false);
      }
    },
    [searchRef]
  );

  const handleStartPlan = useCallback((planId: string) => {
    startPlan(planId);
    setProgress(getPlanProgress());
    setExpandedPlan(planId);
  }, []);

  const handleToggleDay = useCallback((planId: string, dayIndex: number) => {
    toggleDay(planId, dayIndex);
    setProgress(getPlanProgress());
  }, []);

  const handleRemovePlan = useCallback((planId: string) => {
    removePlan(planId);
    setProgress(getPlanProgress());
    setExpandedPlan(null);
  }, []);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-extrabold text-foreground">Bible</h1>
      <p className="mb-8 text-muted">
        Look up verses, read daily Scripture, and follow a reading plan.
      </p>

      {/* Daily verse */}
      <div className="mb-10">
        <BibleVerse />
      </div>

      {/* Tab switcher */}
      <div className="mb-8 flex gap-2 rounded-xl bg-surface border border-border p-1">
        <button
          onClick={() => setActiveTab("verse")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-colors ${
            activeTab === "verse"
              ? "gradient-primary text-white shadow"
              : "text-muted hover:text-foreground"
          }`}
        >
          Verse Lookup
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-colors ${
            activeTab === "plans"
              ? "gradient-primary text-white shadow"
              : "text-muted hover:text-foreground"
          }`}
        >
          Reading Plans
        </button>
      </div>

      {/* Verse Lookup */}
      {activeTab === "verse" && (
        <div>
          <form onSubmit={handleSearch} className="mb-6 flex gap-3">
            <input
              type="text"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              placeholder='e.g. "John 3:16" or "Psalm 23:1-6"'
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={searching || !searchRef.trim()}
              className="rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? "..." : "Search"}
            </button>
          </form>

          {searchError && (
            <div className="mb-6 rounded-xl border border-error/30 bg-error/5 p-4 text-sm text-error">
              {searchError}
            </div>
          )}

          {verseResult && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                {verseResult.reference}
              </p>
              <p className="mt-3 text-lg italic leading-relaxed text-foreground">
                &ldquo;{verseResult.text.trim()}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Reading Plans */}
      {activeTab === "plans" && (
        <div className="space-y-4">
          {READING_PLANS.map((plan) => {
            const myProgress = progress.find((p) => p.planId === plan.id);
            const isStarted = !!myProgress;
            const completedCount = myProgress?.completedDays.length || 0;
            const totalDays = plan.days.length;
            const percentage = isStarted
              ? Math.round((completedCount / totalDays) * 100)
              : 0;
            const isExpanded = expandedPlan === plan.id;

            return (
              <div
                key={plan.id}
                className="rounded-2xl border border-border bg-surface overflow-hidden"
              >
                {/* Plan header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{plan.name}</h3>
                      <p className="mt-1 text-sm text-muted">{plan.description}</p>
                    </div>
                    {isStarted ? (
                      <span className="shrink-0 rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary">
                        {percentage}%
                      </span>
                    ) : null}
                  </div>

                  {/* Progress bar */}
                  {isStarted && (
                    <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    {isStarted ? (
                      <>
                        <button
                          onClick={() =>
                            setExpandedPlan(isExpanded ? null : plan.id)
                          }
                          className="rounded-lg bg-primary-light px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                        >
                          {isExpanded ? "Hide Days" : "View Days"}
                        </button>
                        <button
                          onClick={() => handleRemovePlan(plan.id)}
                          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-surface-hover hover:text-error transition-colors"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartPlan(plan.id)}
                        className="rounded-lg gradient-primary px-4 py-2 text-sm font-bold text-white shadow shadow-primary/20 transition-transform hover:scale-105"
                      >
                        Start Plan
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded day list */}
                {isExpanded && myProgress && (
                  <div className="border-t border-border bg-background p-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {plan.days.map((readings, i) => {
                        const isDone = myProgress.completedDays.includes(i);
                        return (
                          <button
                            key={i}
                            onClick={() => handleToggleDay(plan.id, i)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                              isDone
                                ? "bg-success/10 text-success"
                                : "bg-surface text-foreground hover:bg-surface-hover"
                            }`}
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                                isDone
                                  ? "border-success bg-success text-white"
                                  : "border-border"
                              }`}
                            >
                              {isDone ? "\u2713" : ""}
                            </span>
                            <span>
                              <strong>Day {i + 1}:</strong> {readings.join(", ")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
