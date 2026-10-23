"use client";

import { useState } from "react";
import { ACCT_REFERENCE } from "@/lib/study/acct-reference";
import AskTutor from "./AskTutor";

interface Props {
  accentText: string;
  accentBorder: string;
  accentTint: string;
}

export default function LearnPanel({ accentText, accentBorder, accentTint }: Props) {
  // Everything starts open: this is for skimming, and a page of collapsed
  // headings hides the thing you came to find.
  const [closed, setClosed] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const totalMarks = ACCT_REFERENCE.reduce((n, s) => n + s.questions, 0);

  return (
    <div className="flex flex-col gap-6">
      <AskTutor
        accentText={accentText}
        accentBorder={accentBorder}
        accentTint={accentTint}
      />

      <div>
        <h3 className="text-2xl italic text-foreground">What to know</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          The rules behind roughly {totalMarks} of the 40 questions, ordered by what
          Dr. Bokrand&apos;s blueprint pays for. Written against that blueprint
          rather than copied out of the packets — several of the highest-value
          topics are illustrations in the PDF with no text to pull. Where a
          packet stated something exactly, that wording is kept.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ACCT_REFERENCE.map((section) => {
          const open = !closed.has(section.id);
          return (
            <section key={section.id} className="rounded-2xl border border-border bg-surface">
              <button
                type="button"
                onClick={() => toggle(section.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 p-5 text-left"
              >
                <span className={`text-xs uppercase tracking-[0.15em] ${accentText}`}>
                  {section.chapter}
                </span>
                <span className="min-w-0 flex-1 text-lg text-foreground">{section.title}</span>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${accentBorder} ${accentText}`}
                >
                  {section.questions} questions
                </span>
                <span aria-hidden="true" className="shrink-0 text-muted">
                  {open ? "−" : "+"}
                </span>
              </button>

              {open && (
                <ul className="flex flex-col gap-4 border-t border-border p-5">
                  {section.points.map((p) => (
                    <li key={p.point} className="flex gap-3">
                      <span aria-hidden="true" className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accentBorder.replace("border-", "bg-")}`} />
                      <div className="min-w-0 flex-1">
                        <p className="leading-relaxed text-foreground">{p.point}</p>
                        {p.detail && (
                          <p className="mt-1 text-sm leading-relaxed text-muted">{p.detail}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
