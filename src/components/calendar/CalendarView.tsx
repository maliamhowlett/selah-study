"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_STYLES } from "@/lib/calendar/categories";
import type { Category } from "@/lib/calendar/categories";
import type { CalendarEvent, EventInput } from "@/lib/calendar/types";
import {
  addDays,
  bucketUpcoming,
  groupEventsByDay,
  monthGridDays,
  monthLabel,
} from "@/lib/calendar/dates";
import EventForm, { type FormMode } from "./EventForm";
import MonthGrid from "./MonthGrid";
import UpcomingList from "./UpcomingList";

interface CalendarViewProps {
  googleEmail: string | null;
}

/**
 * The grid only needs the visible month, but "coming up" should keep listing
 * past the end of it — so the fetch always reaches at least this far ahead.
 */
const LOOKAHEAD_DAYS = 120;

export default function CalendarView({ googleEmail }: CalendarViewProps) {
  const now = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsReconnect, setNeedsReconnect] = useState(false);
  const [form, setForm] = useState<FormMode | null>(null);
  const [hidden, setHidden] = useState<Set<Category>>(new Set());
  const [disconnecting, setDisconnecting] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    const days = monthGridDays(cursor.year, cursor.month);
    const gridEnd = addDays(days[days.length - 1], 1);
    const lookahead = addDays(new Date(), LOOKAHEAD_DAYS);
    const timeMax = gridEnd > lookahead ? gridEnd : lookahead;

    try {
      const params = new URLSearchParams({
        timeMin: days[0].toISOString(),
        timeMax: timeMax.toISOString(),
      });
      const res = await fetch(`/api/calendar/events?${params.toString()}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setNeedsReconnect(Boolean(data.needsReconnect));
        throw new Error(data.error || "Couldn't load your calendar.");
      }

      setNeedsReconnect(false);
      setEvents(data.events as CalendarEvent[]);
    } catch (err) {
      setEvents([]);
      setError(err instanceof Error ? err.message : "Couldn't load your calendar.");
    } finally {
      setLoading(false);
    }
  }, [cursor]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const visibleEvents = useMemo(
    () => events.filter((event) => !hidden.has(event.category)),
    [events, hidden],
  );

  const eventsByDay = useMemo(() => groupEventsByDay(visibleEvents), [visibleEvents]);
  const buckets = useMemo(() => bucketUpcoming(visibleEvents), [visibleEvents]);

  const toggleCategory = (category: Category) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  /** Returns an error message to show inside the form, or null on success. */
  const handleSave = async (input: EventInput, eventId?: string): Promise<string | null> => {
    try {
      const res = await fetch(
        eventId ? `/api/calendar/events/${encodeURIComponent(eventId)}` : "/api/calendar/events",
        {
          method: eventId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return data.error || "Couldn't save that event.";

      setForm(null);
      await loadEvents();
      return null;
    } catch {
      return "Couldn't reach the server. Check your connection and try again.";
    }
  };

  const handleDelete = async (eventId: string): Promise<string | null> => {
    try {
      const res = await fetch(`/api/calendar/events/${encodeURIComponent(eventId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return data.error || "Couldn't delete that event.";
      }
      setForm(null);
      await loadEvents();
      return null;
    } catch {
      return "Couldn't reach the server. Check your connection and try again.";
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    await fetch("/api/google/disconnect", { method: "POST" }).catch(() => {});
    window.location.href = "/calendar";
  };

  const goToMonth = (delta: number) => {
    setCursor(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const onToday = () => setCursor({ year: now.getFullYear(), month: now.getMonth() });
  const isCurrentMonth =
    cursor.year === now.getFullYear() && cursor.month === now.getMonth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-muted">
            Your dates
          </p>
          <h1 className="text-5xl italic text-foreground sm:text-6xl">my calendar</h1>
        </div>
        <button
          type="button"
          onClick={() => setForm({ mode: "create" })}
          className="rounded-full gradient-primary px-5 py-2.5 text-sm text-white shadow-md hover:scale-105"
        >
          + Add event
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-error/40 bg-error/5 p-4 text-sm text-error">
          <p>{error}</p>
          {needsReconnect && (
            <a
              href="/api/google/connect"
              className="mt-3 inline-block rounded-full border border-error/40 px-4 py-2 text-xs hover:bg-error/10"
            >
              Reconnect Google Calendar
            </a>
          )}
        </div>
      )}

      {/* Month navigation */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            aria-label="Previous month"
            className="rounded-full px-3 py-2 text-muted hover:bg-surface-hover hover:text-foreground"
          >
            ‹
          </button>
          <h2 className="min-w-[11rem] text-center text-xl italic text-foreground">
            {monthLabel(cursor.year, cursor.month)}
          </h2>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label="Next month"
            className="rounded-full px-3 py-2 text-muted hover:bg-surface-hover hover:text-foreground"
          >
            ›
          </button>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={onToday}
              className="ml-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:bg-surface-hover hover:text-foreground"
            >
              Today
            </button>
          )}
        </div>

        {/* Category filters double as the colour legend. */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((category) => {
            const style = CATEGORY_STYLES[category];
            const off = hidden.has(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                aria-pressed={!off}
                title={off ? `Show ${style.label} events` : `Hide ${style.label} events`}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-opacity ${
                  off
                    ? "border-border text-muted opacity-50"
                    : "border-border text-foreground"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                {style.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
        <MonthGrid
          year={cursor.year}
          month={cursor.month}
          eventsByDay={eventsByDay}
          onAddOnDay={(day) => setForm({ mode: "create", day })}
          onSelectEvent={(event) => setForm({ mode: "edit", event })}
        />
      </div>

      <div className="mt-8">
        <UpcomingList
          buckets={buckets}
          onSelectEvent={(event) => setForm({ mode: "edit", event })}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <p>
          Synced with Google Calendar
          {googleEmail && <span className="text-foreground"> · {googleEmail}</span>}
        </p>
        <button
          type="button"
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="underline hover:text-foreground disabled:opacity-60"
        >
          {disconnecting ? "Disconnecting…" : "Disconnect"}
        </button>
      </div>

      {form && (
        <EventForm
          key={form.mode === "edit" ? form.event.id : `create-${form.day ?? "today"}`}
          state={form}
          onClose={() => setForm(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
