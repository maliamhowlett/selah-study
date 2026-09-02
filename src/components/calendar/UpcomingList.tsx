"use client";

import { CATEGORY_STYLES } from "@/lib/calendar/categories";
import { COURSE_STYLES } from "@/lib/calendar/courses";
import { markedTitle, rowClass } from "@/lib/calendar/style";
import type { CalendarEvent } from "@/lib/calendar/types";
import {
  countdownLabel,
  formatShortDate,
  formatTime,
  parseEventDate,
} from "@/lib/calendar/dates";

interface UpcomingListProps {
  buckets: { thisWeek: CalendarEvent[]; nextWeek: CalendarEvent[]; later: CalendarEvent[] };
  onSelectEvent: (event: CalendarEvent) => void;
}

function Row({
  event,
  onSelect,
}: {
  event: CalendarEvent;
  onSelect: (event: CalendarEvent) => void;
}) {
  const style = CATEGORY_STYLES[event.category];
  const course = COURSE_STYLES[event.course ?? "none"];
  const start = parseEventDate(event.start);
  const time = formatTime(event);

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={`flex w-full items-start gap-3 rounded-r-xl px-4 py-3 text-left transition-colors hover:brightness-[0.98] ${rowClass(event)}`}
    >
      <span
        className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider ${style.badge}`}
      >
        {style.label}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate">{markedTitle(event)}</span>
        <span className="mt-0.5 block text-xs text-muted no-underline">
          {event.course && event.course !== "none" && `${course.label} · `}
          {formatShortDate(start)}
          {time && ` · ${time}`}
          {event.location && ` · ${event.location}`}
        </span>
      </span>
      <span className="shrink-0 text-xs text-muted">{countdownLabel(start)}</span>
    </button>
  );
}

function Section({
  title,
  events,
  onSelectEvent,
}: {
  title: string;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}) {
  if (events.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted">{title}</h3>
      <div className="space-y-1.5">
        {events.map((event) => (
          <Row key={event.id} event={event} onSelect={onSelectEvent} />
        ))}
      </div>
    </div>
  );
}

export default function UpcomingList({ buckets, onSelectEvent }: UpcomingListProps) {
  const total = buckets.thisWeek.length + buckets.nextWeek.length + buckets.later.length;

  return (
    <section className="rounded-3xl border border-border bg-surface p-6">
      <h2 className="mb-5 text-2xl italic text-foreground">coming up</h2>

      {total === 0 ? (
        <p className="text-sm text-muted">
          Nothing on the calendar yet. Add an exam date or a club meeting and it&rsquo;ll
          show up here with a countdown.
        </p>
      ) : (
        <>
          <Section title="This week" events={buckets.thisWeek} onSelectEvent={onSelectEvent} />
          <Section title="Next week" events={buckets.nextWeek} onSelectEvent={onSelectEvent} />
          <Section title="Later" events={buckets.later.slice(0, 12)} onSelectEvent={onSelectEvent} />
        </>
      )}
    </section>
  );
}
