"use client";

import { useState, useCallback } from "react";
import type { Transcription } from "@/lib/types";

interface OnePagerProps {
  transcription: Transcription;
}

export default function OnePager({ transcription }: OnePagerProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSummary = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transcription.text,
          title: transcription.title,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate summary");
      }

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [transcription]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
          One-Pager Summary
        </h3>
        {!summary && (
          <button
            onClick={generateSummary}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-xs font-bold text-white transition-all ${
              loading
                ? "bg-muted cursor-not-allowed"
                : "gradient-primary shadow shadow-primary/20 hover:scale-105"
            }`}
          >
            {loading ? "Generating..." : "Generate AI Summary"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-error/30 bg-error/5 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-3/4 rounded bg-border" />
          <div className="h-4 w-full rounded bg-border" />
          <div className="h-4 w-5/6 rounded bg-border" />
          <div className="h-4 w-2/3 rounded bg-border" />
        </div>
      )}

      {summary && (
        <div>
          <h2 className="mb-3 text-lg font-bold text-foreground">
            {transcription.title}
          </h2>
          <div className="prose-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {summary}
          </div>
          <div className="mt-6 flex gap-2">
            <button
              onClick={generateSummary}
              disabled={loading}
              className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(summary);
              }}
              className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {!summary && !loading && !error && (
        <div>
          {transcription.highlights.length > 0 ? (
            <div>
              <h2 className="mb-3 text-lg font-bold text-foreground">
                {transcription.title}
              </h2>
              <p className="mb-3 text-xs text-muted">
                Your highlights are listed below. Click &ldquo;Generate AI Summary&rdquo; for a full one-pager.
              </p>
              <ul className="space-y-2">
                {transcription.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-foreground">
                    <span className="mt-1 shrink-0 text-primary">&#x2022;</span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Click &ldquo;Generate AI Summary&rdquo; to create a one-pager from this transcription.
              You can also highlight key text in the Full Text view first.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
