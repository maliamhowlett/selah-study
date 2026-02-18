"use client";

import { useState, useCallback } from "react";

interface FlashcardFormProps {
  initialFront?: string;
  initialBack?: string;
  onSave: (front: string, back: string) => void;
  onCancel: () => void;
}

export default function FlashcardForm({
  initialFront = "",
  initialBack = "",
  onSave,
  onCancel,
}: FlashcardFormProps) {
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!front.trim()) return;
      onSave(front.trim(), back.trim());
      setFront("");
      setBack("");
    },
    [front, back, onSave]
  );

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary">
        New Flashcard
      </h3>
      <div className="mb-4">
        <label htmlFor="fc-front" className="mb-1 block text-sm font-medium text-foreground">
          Front (question or term)
        </label>
        <textarea
          id="fc-front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          placeholder="What is the main theme of Romans 8?"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="fc-back" className="mb-1 block text-sm font-medium text-foreground">
          Back (answer or definition)
        </label>
        <textarea
          id="fc-back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          placeholder="Life in the Spirit — no condemnation for those in Christ Jesus"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!front.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Card
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-surface-hover"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
