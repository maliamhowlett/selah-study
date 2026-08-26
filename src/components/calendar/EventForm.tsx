"use client";

import { useEffect, useRef, useState } from "react";
import {
  CATEGORY_OPTIONS,
  CATEGORY_STYLES,
  detectCategory,
} from "@/lib/calendar/categories";
import type { Category } from "@/lib/calendar/categories";
import type { CalendarEvent, EventInput } from "@/lib/calendar/types";
import { toLocalInputValue } from "@/lib/calendar/dates";

export type FormMode =
  | { mode: "create"; day?: string }
  | { mode: "edit"; event: CalendarEvent };

interface EventFormProps {
  state: FormMode;
  onClose: () => void;
  onSave: (input: EventInput, eventId?: string) => Promise<string | null>;
  onDelete: (eventId: string) => Promise<string | null>;
}

const inputClass =
  "w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";

const labelClass = "mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted";

function todayKey(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** "2026-09-03" + "09:00" -> "2026-09-03T09:00" for datetime-local inputs. */
function joinDateTime(day: string, time: string): string {
  return `${day}T${time}`;
}

function splitDay(value: string): string {
  return value.slice(0, 10);
}

export default function EventForm({
  state,
  onClose,
  onSave,
  onDelete,
}: EventFormProps) {
  const editing = state.mode === "edit" ? state.event : null;
  const defaultDay = state.mode === "create" ? (state.day ?? todayKey()) : todayKey();

  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState<Category>(editing?.category ?? "other");
  const [allDay, setAllDay] = useState(editing?.allDay ?? false);
  const [start, setStart] = useState(
    editing
      ? editing.allDay
        ? splitDay(editing.start)
        : toLocalInputValue(new Date(editing.start))
      : joinDateTime(defaultDay, "09:00"),
  );
  const [end, setEnd] = useState(
    editing
      ? editing.allDay
        ? splitDay(editing.end)
        : toLocalInputValue(new Date(editing.end))
      : joinDateTime(defaultDay, "10:00"),
  );
  const [location, setLocation] = useState(editing?.location ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  // Once the category is chosen by hand we stop guessing over the top of it.
  // This is state rather than a ref because the hint below the select reads it
  // during render.
  const [categoryTouched, setCategoryTouched] = useState(
    editing?.categorySource === "manual",
  );
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!categoryTouched) {
      setCategory(detectCategory(value, description));
    }
  };

  const toggleAllDay = (nextAllDay: boolean) => {
    setAllDay(nextAllDay);
    if (nextAllDay) {
      setStart(splitDay(start));
      setEnd(splitDay(end));
    } else {
      setStart(joinDateTime(splitDay(start), "09:00"));
      setEnd(joinDateTime(splitDay(end), "10:00"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setError("");
    setSaving(true);

    const message = await onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        start,
        end: end || start,
        allDay,
        category,
      },
      editing?.id,
    );

    setSaving(false);
    if (message) setError(message);
  };

  const handleDelete = async () => {
    if (!editing) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    const message = await onDelete(editing.id);
    setDeleting(false);
    if (message) {
      setError(message);
      setConfirmDelete(false);
    }
  };

  const style = CATEGORY_STYLES[category];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/25 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-surface p-6 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={editing ? "Edit event" : "Add event"}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl italic text-foreground">
            {editing ? "Edit event" : "Add to calendar"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted hover:bg-surface-hover hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className={labelClass} htmlFor="event-title">
            What is it?
          </label>
          <input
            id="event-title"
            ref={titleRef}
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="ACCT Exam 1"
            className={`${inputClass} mb-5`}
          />

          <div className="mb-5">
            <label className={labelClass} htmlFor="event-category">
              Type
            </label>
            <div className="flex items-center gap-3">
              <select
                id="event-category"
                value={category}
                onChange={(e) => {
                  setCategoryTouched(true);
                  setCategory(e.target.value as Category);
                }}
                className={inputClass}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${style.badge}`}
              >
                {style.label}
              </span>
            </div>
            {!categoryTouched && title.trim() !== "" && (
              <p className="mt-1.5 text-xs text-muted">
                Picked from the title — change it any time.
              </p>
            )}
          </div>

          <label className="mb-4 flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => toggleAllDay(e.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            All day
          </label>

          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="event-start">
                Starts
              </label>
              <input
                id="event-start"
                required
                type={allDay ? "date" : "datetime-local"}
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  if (end < e.target.value) setEnd(e.target.value);
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="event-end">
                Ends
              </label>
              <input
                id="event-end"
                required
                type={allDay ? "date" : "datetime-local"}
                value={end}
                min={start}
                onChange={(e) => setEnd(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <label className={labelClass} htmlFor="event-location">
            Where <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="event-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="FRNY G140"
            className={`${inputClass} mb-5`}
          />

          <label className={labelClass} htmlFor="event-notes">
            Notes <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            id="event-notes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Chapters 1–3, bring a calculator"
            className={`${inputClass} mb-5 resize-y`}
          />

          {error && (
            <div className="mb-4 rounded-2xl border border-error/40 bg-error/5 p-3 text-sm text-error">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving || deleting}
              className="rounded-full gradient-primary px-6 py-2.5 text-sm text-white shadow-md hover:scale-[1.02] disabled:opacity-60"
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Add to Google Calendar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-5 py-2.5 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
            >
              Cancel
            </button>

            {editing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="ml-auto rounded-full px-4 py-2.5 text-sm text-error hover:bg-error/10 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : confirmDelete ? "Really delete?" : "Delete"}
              </button>
            )}
          </div>

          {editing?.htmlLink && (
            <a
              href={editing.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block text-xs text-muted underline hover:text-foreground"
            >
              Open in Google Calendar
            </a>
          )}
        </form>
      </div>
    </div>
  );
}
