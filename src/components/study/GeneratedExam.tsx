"use client";

import { useState } from "react";
import { generateExam } from "@/lib/study/generate-exam";
import type { MockExam as MockExamData } from "@/lib/study/acct-exam";
import MockExam from "./MockExam";

interface Props {
  accentText: string;
  accentBorder: string;
  accentTint: string;
}

/**
 * Wraps the exam runner with a fresh paper on demand. Keyed on a counter so
 * regenerating fully remounts the runner — otherwise the previous paper's
 * answers and its clock would bleed into the new one.
 */
export default function GeneratedExam({ accentText, accentBorder, accentTint }: Props) {
  const [exam, setExam] = useState<MockExamData | null>(null);
  const [round, setRound] = useState(0);

  const fresh = () => {
    setExam(generateExam(16));
    setRound((n) => n + 1);
  };

  if (!exam) {
    return (
      <div className={`rounded-2xl border p-8 ${accentBorder} ${accentTint}`}>
        <h3 className={`text-2xl italic ${accentText}`}>A new paper, as often as you like</h3>
        <p className="mt-3 max-w-xl leading-relaxed text-foreground">
          Sixteen questions drawn evenly across the four chapters, with different
          numbers every time. Sit one, mark it, generate another.
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          The questions are templates and the answers are worked out in code from
          the same figures you see, so they can&apos;t disagree with each other. No
          model wrote them — an AI inventing accounting questions produces
          confident wrong answers, and four days out you&apos;d have no way to catch
          one.
        </p>
        <button
          type="button"
          onClick={fresh}
          className="mt-6 rounded-full gradient-primary px-6 py-3 text-sm text-white shadow-md hover:scale-[1.02]"
        >
          Generate a paper
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <MockExam
        key={round}
        exam={exam}
        accentText={accentText}
        accentBorder={accentBorder}
        accentTint={accentTint}
      />
      <button
        type="button"
        onClick={fresh}
        className="self-start rounded-full border border-border px-5 py-2.5 text-sm text-foreground hover:bg-surface-hover"
      >
        Generate a different paper
      </button>
    </div>
  );
}
