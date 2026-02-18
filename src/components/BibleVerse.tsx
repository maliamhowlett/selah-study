"use client";

import { useEffect, useState } from "react";
import { getCachedVerse, setCachedVerse } from "@/lib/storage";
import type { CachedVerse } from "@/lib/types";

export default function BibleVerse() {
  const [verse, setVerse] = useState<CachedVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const cached = getCachedVerse();

    if (cached && cached.date === today) {
      setVerse(cached);
      setLoading(false);
      return;
    }

    fetch("/api/bible")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch verse");
        return res.json();
      })
      .then((data: { text: string; reference: string }) => {
        const newVerse: CachedVerse = {
          text: data.text,
          reference: data.reference,
          date: today,
        };
        setCachedVerse(newVerse);
        setVerse(newVerse);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-3/4 rounded bg-border" />
          <div className="h-4 w-1/2 rounded bg-border" />
          <div className="mt-4 h-3 w-1/4 rounded bg-border" />
        </div>
      </div>
    );
  }

  if (error || !verse) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center text-muted">
        <p className="italic">
          &ldquo;Your word is a lamp to my feet and a light for my path.&rdquo;
        </p>
        <p className="mt-2 text-sm font-bold text-primary">— Psalm 119:105</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">
        Verse of the Day
      </p>
      <p className="mt-3 text-lg leading-relaxed italic text-foreground">
        &ldquo;{verse.text.trim()}&rdquo;
      </p>
      <p className="mt-3 text-sm font-bold text-primary">— {verse.reference}</p>
    </div>
  );
}
