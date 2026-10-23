"use client";

import { useState } from "react";

interface Props {
  /** What's on screen, so "why is that a credit?" has a referent. */
  context?: string;
  accentText: string;
  accentBorder: string;
  accentTint: string;
}

const SUGGESTIONS = [
  "Why is this a credit and not a debit?",
  "How do I know which account to use?",
  "Explain this like I've never seen it before",
];

export default function AskTutor({ context, accentText, accentBorder, accentTint }: Props) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [asking, setAsking] = useState(false);

  const ask = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || asking) return;

    setAsking(true);
    setError("");
    setAnswer("");

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, context }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "The tutor couldn't answer that.");
      setAnswer(data.answer as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAsking(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`self-start rounded-full border px-4 py-2 text-sm ${accentBorder} ${accentText} hover:opacity-80`}
      >
        Ask why
      </button>
    );
  }

  return (
    <div className={`rounded-2xl border p-5 ${accentBorder} ${accentTint}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className={`text-sm font-medium ${accentText}`}>Ask about this</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-muted hover:text-foreground"
        >
          Close
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
      >
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          placeholder="Why does this go on the credit side?"
          className="w-full resize-y rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={asking || !question.trim()}
            className="rounded-full gradient-primary px-5 py-2 text-sm text-white shadow-md hover:scale-[1.02] disabled:opacity-50"
          >
            {asking ? "Thinking…" : "Ask"}
          </button>
          {!answer &&
            !asking &&
            SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQuestion(s);
                  ask(s);
                }}
                className="rounded-full border border-border px-3 py-2 text-xs text-muted hover:bg-surface-hover hover:text-foreground"
              >
                {s}
              </button>
            ))}
        </div>
      </form>

      {error && (
        <p className="mt-4 border-l-2 border-error bg-error/5 px-3.5 py-2.5 text-sm text-error">
          {error}
        </p>
      )}

      {answer && (
        <>
          <div className="mt-4 flex flex-col gap-3">
            {answer.split(/\n\n+/).map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground">
                {para}
              </p>
            ))}
          </div>
          <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted">
            This is an AI answer and it can be wrong. If it contradicts your
            notes packet, the packet is right — and worth asking Dr. Bokrand
            about.
          </p>
          <button
            type="button"
            onClick={() => {
              setAnswer("");
              setQuestion("");
            }}
            className="mt-3 text-xs text-muted underline underline-offset-4 hover:text-foreground"
          >
            Ask something else
          </button>
        </>
      )}
    </div>
  );
}
