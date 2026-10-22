"use client";

import { useState } from "react";
import type { PracticeProblem } from "@/lib/study/plans";

interface Props {
  problems: PracticeProblem[];
  /** Tailwind text colour for the course, so these match the rest of the page. */
  accentText: string;
}

/**
 * Answers stay hidden until asked for. Seeing a worked solution before
 * attempting the problem feels like learning and mostly isn't, so the reveal
 * is deliberately a decision rather than a scroll.
 */
export default function PracticeProblems({ problems, accentText }: Props) {
  const [shown, setShown] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setShown((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex flex-col gap-4">
      {problems.map((problem, index) => {
        const open = shown.has(problem.id);
        return (
          <article
            key={problem.id}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <div className="mb-3 flex items-baseline gap-3">
              <span className="text-xs tabular-nums text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={`text-xs uppercase tracking-[0.15em] ${accentText}`}>
                {problem.topic}
              </span>
            </div>

            <p className="leading-relaxed text-foreground">{problem.question}</p>

            <button
              type="button"
              onClick={() => toggle(problem.id)}
              aria-expanded={open}
              className="mt-4 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              {open ? "Hide the answer" : "Show the answer"}
            </button>

            {open && (
              <div className="mt-4 flex flex-col gap-3">
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-background p-4 font-mono text-[13px] leading-relaxed text-foreground">
                  {problem.answer}
                </pre>
                {problem.trap && (
                  <p className="border-l-2 border-exam bg-exam-light px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
                    <span className="font-semibold">Where this goes wrong: </span>
                    {problem.trap}
                  </p>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
