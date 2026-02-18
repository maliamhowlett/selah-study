"use client";

import type { Transcription } from "@/lib/types";

interface OnePagerProps {
  transcription: Transcription;
}

export default function OnePager({ transcription }: OnePagerProps) {
  if (transcription.highlights.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center text-muted">
        <p>No highlights yet. Select text in a transcription and click &ldquo;Highlight&rdquo; to build your one-pager.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">
          One-Pager Summary
        </h3>
        <button
          disabled
          className="rounded-lg bg-muted/20 px-3 py-1.5 text-xs font-medium text-muted cursor-not-allowed"
          title="Coming soon"
        >
          Generate AI Summary (Coming Soon)
        </button>
      </div>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        {transcription.title}
      </h2>
      <ul className="space-y-2">
        {transcription.highlights.map((h, i) => (
          <li key={i} className="flex gap-2 text-foreground">
            <span className="mt-1 shrink-0 text-primary">&#x2022;</span>
            <span className="leading-relaxed">{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
