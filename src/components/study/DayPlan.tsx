"use client";

import { useMemo } from "react";
import { useStoredValue, writeStoredValue } from "@/lib/study/local-store";
import type { StudyDay } from "@/lib/study/plans";

interface Props {
  days: StudyDay[];
  slug: string;
  /** Today in Indiana, computed on the server so both renders agree. */
  today: string;
  accentText: string;
  accentBorder: string;
  accentTint: string;
}

const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function prettyDay(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const when = new Date(y, m - 1, d);
  return `${WEEKDAY[when.getDay()]} ${d} ${when.toLocaleDateString("en-GB", { month: "long" })}`;
}

/** Ticking off a task is a per-browser convenience, not shared state. */
function parseDone(raw: string | null): Set<string> {
  try {
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export default function DayPlan({
  days,
  slug,
  today,
  accentText,
  accentBorder,
  accentTint,
}: Props) {
  const storageKey = `selah:study:${slug}`;
  const raw = useStoredValue(storageKey);
  const done = useMemo(() => parseDone(raw), [raw]);

  const toggle = (id: string) => {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeStoredValue(storageKey, JSON.stringify([...next]));
  };

  const total = days.reduce((n, day) => n + day.tasks.length, 0);
  const complete = done.size;

  return (
    <div className="flex flex-col gap-5">
      {total > 0 && complete > 0 && (
        <p className="text-sm text-muted">
          <span className={`font-semibold ${accentText}`}>{complete}</span> of {total}{" "}
          done
        </p>
      )}

      {days.map((day) => {
        const isToday = day.date === today;
        const isPast = day.date < today;

        return (
          <section
            key={day.date}
            className={`rounded-2xl border p-5 ${
              isToday
                ? `${accentBorder} ${accentTint}`
                : `border-border bg-surface ${isPast ? "opacity-60" : ""}`
            }`}
          >
            <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className={`text-lg ${isToday ? accentText : "text-foreground"}`}>
                {prettyDay(day.date)}
              </h3>
              {isToday && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${accentText} border border-current`}
                >
                  Today
                </span>
              )}
              <span className="ml-auto text-xs text-muted">
                about {Math.floor(day.minutes / 60)}h
                {day.minutes % 60 ? ` ${day.minutes % 60}m` : ""}
              </span>
            </div>

            <p className="mb-4 text-sm text-muted">{day.focus}</p>

            {day.fixture && (
              <p className="mb-4 border-l-2 border-exam bg-exam-light px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
                {day.fixture}
              </p>
            )}

            <ul className="flex flex-col gap-2.5">
              {day.tasks.map((task, i) => {
                const id = `${day.date}-${i}`;
                const checked = done.has(id);
                return (
                  <li key={id}>
                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
                      />
                      <span className={checked ? "text-muted line-through" : "text-foreground"}>
                        {task}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
