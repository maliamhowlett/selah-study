"use client";

import { useEffect, useState } from "react";
import { getTranscriptions } from "@/lib/storage";
import type { Transcription } from "@/lib/types";

export default function ClassRecordings({ classSlug }: { classSlug: string }) {
  const [recordings, setRecordings] = useState<Transcription[] | null>(null);

  useEffect(() => {
    const all = getTranscriptions();
    setRecordings(all.filter((t) => t.classSlug === classSlug));
  }, [classSlug]);

  if (recordings === null) {
    return <p className="text-sm text-muted">Loading recordings…</p>;
  }

  if (recordings.length === 0) {
    return (
      <p className="text-sm text-muted">
        No recordings yet for this class.{" "}
        <a href="/record" className="text-primary hover:underline">
          Record a lecture →
        </a>
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {recordings.map((r) => (
        <div
          key={r.id}
          className="rounded-2xl border border-border bg-surface p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-foreground">{r.title}</div>
              <div className="mt-1 text-xs text-muted">
                {new Date(r.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                {r.generatedNotes && " · has notes"}
              </div>
            </div>
          </div>
          {r.generatedNotes && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs uppercase tracking-[0.15em] text-primary">
                Show notes
              </summary>
              <div className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
                {r.generatedNotes}
              </div>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}
