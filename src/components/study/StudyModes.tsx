"use client";

import { useState, type ReactNode } from "react";

export interface StudyMode {
  id: string;
  label: string;
  /** One line under the tabs saying what this mode is for. */
  blurb: string;
  content: ReactNode;
}

interface Props {
  modes: StudyMode[];
  accentText: string;
  accentBorder: string;
  accentTint: string;
}

/**
 * Tabs over server-rendered panels. Each mode's content is built on the server
 * and handed in as a node, so switching tabs is a local state change with no
 * request behind it — the panels are already in the payload.
 */
export default function StudyModes({
  modes,
  accentText,
  accentBorder,
  accentTint,
}: Props) {
  const [active, setActive] = useState(modes[0]?.id);
  const current = modes.find((m) => m.id === active) ?? modes[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="How to study"
        className="flex flex-wrap gap-2 border-b border-border pb-4"
      >
        {modes.map((mode) => {
          const on = mode.id === current?.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(mode.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                on
                  ? `${accentBorder} ${accentTint} ${accentText}`
                  : "border-border text-muted hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      {current && (
        <div role="tabpanel" className="pt-6">
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
            {current.blurb}
          </p>
          {current.content}
        </div>
      )}
    </div>
  );
}
