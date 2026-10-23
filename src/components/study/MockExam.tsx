"use client";

import { useEffect, useMemo, useState } from "react";
import type { MockExam as MockExamData } from "@/lib/study/acct-exam";

interface Props {
  exam: MockExamData | null;
  accentText: string;
  accentBorder: string;
  accentTint: string;
}

type Phase = "ready" | "sitting" | "marking";

function clock(seconds: number): string {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MockExam({
  exam,
  accentText,
  accentBorder,
  accentTint,
}: Props) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [left, setLeft] = useState(0);
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [marks, setMarks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (phase !== "sitting") return;
    const tick = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(tick);
          setPhase("marking");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [phase]);

  const scored = useMemo(() => {
    if (!exam) return { right: 0, total: 0 };
    let right = 0;
    for (const q of exam.questions) {
      // Multiple choice marks itself; worked problems are marked by hand.
      if (q.correct !== undefined) {
        if (picked[q.id] === q.correct) right += 1;
      } else if (marks[q.id]) {
        right += 1;
      }
    }
    return { right, total: exam.questions.length };
  }, [exam, picked, marks]);

  if (!exam) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8">
        <h3 className="text-xl italic text-foreground">Not here yet</h3>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">
          Put the practice exam in{" "}
          <code className="rounded bg-background px-1.5 py-0.5 text-[13px]">
            course-materials/acct-20000/
          </code>{" "}
          and tell me. I&apos;ll transcribe it with the circled answers moved out
          of the questions and into a key, so you can actually sit it — timed,
          blank, marked afterwards.
        </p>
        <p className="mt-3 max-w-xl text-sm text-muted">
          That folder is ignored by git, so the file stays on your laptop and
          never goes near the public repo.
        </p>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className={`rounded-2xl border p-8 ${accentBorder} ${accentTint}`}>
        <h3 className={`text-2xl italic ${accentText}`}>{exam.title}</h3>
        <p className="mt-2 text-sm text-muted">{exam.source}</p>
        <p className="mt-5 max-w-xl leading-relaxed text-foreground">
          {exam.questions.length} questions, {exam.minutes} minutes. Paper and a
          calculator, nothing else. The clock is the point — knowing the material
          and finishing in time are two different skills, and only one of them
          gets practiced by reading.
        </p>
        <button
          type="button"
          onClick={() => {
            setLeft(exam.minutes * 60);
            setPhase("sitting");
          }}
          className="mt-6 rounded-full gradient-primary px-6 py-3 text-sm text-white shadow-md hover:scale-[1.02]"
        >
          Start the clock
        </button>
      </div>
    );
  }

  const sitting = phase === "sitting";

  return (
    <div className="flex flex-col gap-5">
      <div
        className={`sticky top-16 z-10 flex flex-wrap items-center gap-4 rounded-2xl border p-4 backdrop-blur-sm ${accentBorder} ${accentTint}`}
      >
        {sitting ? (
          <>
            <span className={`text-2xl tabular-nums ${accentText}`}>{clock(left)}</span>
            <span className="text-sm text-muted">left</span>
            <button
              type="button"
              onClick={() => setPhase("marking")}
              className="ml-auto rounded-full border border-current px-4 py-2 text-sm text-foreground hover:bg-surface-hover"
            >
              Finish and mark
            </button>
          </>
        ) : (
          <>
            <span className={`text-2xl tabular-nums ${accentText}`}>
              {scored.right}/{scored.total}
            </span>
            <span className="text-sm text-muted">
              {Math.round((scored.right / scored.total) * 100)}% · tick the worked
              problems you got right
            </span>
            <button
              type="button"
              onClick={() => {
                setPhase("ready");
                setPicked({});
                setMarks({});
              }}
              className="ml-auto rounded-full border border-border px-4 py-2 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
            >
              Sit it again
            </button>
          </>
        )}
      </div>

      {exam.questions.map((q) => {
        const choice = picked[q.id];
        const wrong =
          !sitting && q.correct !== undefined && choice !== q.correct;

        return (
          <article
            key={q.id}
            className={`rounded-2xl border bg-surface p-5 ${
              wrong ? "border-exam" : "border-border"
            }`}
          >
            <div className="mb-3 flex items-baseline gap-3">
              <span className="text-sm tabular-nums text-muted">{q.number}.</span>
              <span className={`text-xs uppercase tracking-[0.15em] ${accentText}`}>
                {q.topic}
              </span>
            </div>

            <p className="whitespace-pre-wrap leading-relaxed text-foreground">
              {q.prompt}
            </p>

            {q.choices && (
              <ul className="mt-4 flex flex-col gap-2">
                {q.choices.map((text, i) => {
                  const isPicked = choice === i;
                  const isAnswer = !sitting && q.correct === i;
                  return (
                    <li key={text}>
                      <button
                        type="button"
                        disabled={!sitting}
                        onClick={() => setPicked((p) => ({ ...p, [q.id]: i }))}
                        className={`flex w-full gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors ${
                          isAnswer
                            ? "border-success bg-success/10 text-foreground"
                            : isPicked
                              ? `${accentBorder} ${accentTint} text-foreground`
                              : "border-border text-foreground hover:bg-surface-hover disabled:hover:bg-transparent"
                        }`}
                      >
                        <span className="text-muted">
                          {String.fromCharCode(97 + i)})
                        </span>
                        {text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {!sitting && (
              <div className="mt-4 flex flex-col gap-3">
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-background p-4 font-mono text-[13px] leading-relaxed text-foreground">
                  {q.answer}
                </pre>
                {q.correct === undefined && (
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={Boolean(marks[q.id])}
                      onChange={(e) =>
                        setMarks((m) => ({ ...m, [q.id]: e.target.checked }))
                      }
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                    I got this one right
                  </label>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
