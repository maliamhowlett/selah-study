"use client";

import { chipClass, dotClass, markedTitle } from "@/lib/calendar/style";
import type { CalendarEvent } from "@/lib/calendar/types";
import {
  WEEKDAYS,
  dayKey,
  formatTime,
  isSameDay,
  monthGridDays,
} from "@/lib/calendar/dates";

interface MonthGridProps {
  year: number;
  month: number;
  eventsByDay: Map<string, CalendarEvent[]>;
  onAddOnDay: (day: string) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

const MAX_CHIPS = 3;

export default function MonthGrid({
  year,
  month,
  eventsByDay,
  onAddOnDay,
  onSelectEvent,
}: MonthGridProps) {
  const days = monthGridDays(year, month);
  const today = new Date();

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface">
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((label) => (
          <div
            key={label}
            className="px-2 py-2.5 text-center text-[10px] uppercase tracking-[0.2em] text-muted"
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label[0]}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = dayKey(day);
          const inMonth = day.getMonth() === month;
          const isToday = isSameDay(day, today);
          const dayEvents = eventsByDay.get(key) ?? [];
          const overflow = dayEvents.length - MAX_CHIPS;

          return (
            <div
              key={key}
              className={`min-h-[92px] border-b border-r border-border p-1.5 last:border-r-0 sm:min-h-[116px] ${
                inMonth ? "bg-surface" : "bg-background/60"
              }`}
            >
              <button
                type="button"
                onClick={() => onAddOnDay(key)}
                title={`Add an event on ${day.toLocaleDateString()}`}
                className="mb-1 flex w-full items-center justify-start rounded-lg px-1 py-0.5 hover:bg-surface-hover"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isToday
                      ? "gradient-primary text-white"
                      : inMonth
                        ? "text-foreground"
                        : "text-muted/60"
                  }`}
                >
                  {day.getDate()}
                </span>
              </button>

              {/* Full chips from small screens up… */}
              <div className="hidden space-y-1 sm:block">
                {dayEvents.slice(0, MAX_CHIPS).map((event) => {
                  const time = formatTime(event);
                  return (
                    <button
                      key={`${key}-${event.id}`}
                      type="button"
                      onClick={() => onSelectEvent(event)}
                      title={time ? `${time} · ${event.title}` : event.title}
                      className={`block w-full truncate rounded-md px-1.5 py-1 text-left text-[11px] leading-tight hover:opacity-85 ${chipClass(event)}`}
                    >
                      {time && <span className="mr-1 opacity-80 no-underline">{time}</span>}
                      {markedTitle(event)}
                    </button>
                  );
                })}
                {overflow > 0 && (
                  <button
                    type="button"
                    onClick={() => onSelectEvent(dayEvents[MAX_CHIPS])}
                    className="px-1.5 text-[10px] text-muted hover:text-foreground"
                  >
                    +{overflow} more
                  </button>
                )}
              </div>

              {/* …and coloured dots on phones, where chips don't fit. */}
              <div className="flex flex-wrap gap-1 px-1 sm:hidden">
                {dayEvents.slice(0, 6).map((event) => (
                  <button
                    key={`dot-${key}-${event.id}`}
                    type="button"
                    onClick={() => onSelectEvent(event)}
                    aria-label={event.title}
                    className={`h-1.5 rounded-full ${
                      event.category === "exam" ? "w-4" : "w-1.5"
                    } ${dotClass(event)}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
