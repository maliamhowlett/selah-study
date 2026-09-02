"use client";

import { useEffect, useRef, useState } from "react";
import {
  CATEGORY_OPTIONS,
  CATEGORY_STYLES,
  detectCategory,
} from "@/lib/calendar/categories";
import type { Category } from "@/lib/calendar/categories";
import { COURSE_OPTIONS, COURSE_STYLES, detectCourse } from "@/lib/calendar/courses";
import type { CourseKey } from "@/lib/calendar/courses";
import { RRULE_DAYS } from "@/lib/calendar/types";
import type { CalendarEvent, EventInput, RRuleDay } from "@/lib/calendar/types";
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

/** Day pills, in the order a week is read. */
const DAY_PILLS: { value: RRuleDay; label: string }[] = [
  { value: "SU", label: "S" },
  { value: "MO", label: "M" },
  { value: "TU", label: "T" },
  { value: "WE", label: "W" },
  { value: "TH", label: "T" },
  { value: "FR", label: "F" },
  { value: "SA", label: "S" },
];

/** JS getDay() order, so index 0 is Sunday. */
const DAY_BY_INDEX: RRuleDay[] = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

/**
 * Where a semester started in August–December ends around mid-December, and a
 * spring one around the start of May. Only a starting guess — the field is
 * editable.
 */
function semesterEnd(startValue: string): string {
  const [year, month] = startValue.split("-").map(Number);
  if (!year || !month) return "";
  return month >= 8 ? `${year}-12-11` : `${year}-05-01`;
}

/** The RRULE UNTIL instant: the end of the chosen last day, in this browser's
 * timezone, converted to UTC. Doing it here rather than on the server keeps the
 * cut-off correct no matter where the site is deployed. */
function untilInstant(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d, 23, 59, 59).toISOString();
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
  const [course, setCourse] = useState<CourseKey>(editing?.course ?? "none");
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
  const [repeats, setRepeats] = useState(false);
  const [repeatDays, setRepeatDays] = useState<RRuleDay[]>([]);
  const [repeatUntil, setRepeatUntil] = useState(() => semesterEnd(defaultDay));
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
  // The class is guessed the same way, and likewise stops once chosen by hand.
  const [courseTouched, setCourseTouched] = useState(Boolean(editing));
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
    if (!courseTouched) {
      setCourse(detectCourse(value, description));
    }
  };

  const toggleRepeats = (next: boolean) => {
    setRepeats(next);
    if (next && repeatDays.length === 0) {
      const [y, m, d] = splitDay(start).split("-").map(Number);
      setRepeatDays([DAY_BY_INDEX[new Date(y, m - 1, d).getDay()]]);
    }
    if (next && !repeatUntil) setRepeatUntil(semesterEnd(splitDay(start)));
  };

  const toggleRepeatDay = (day: RRuleDay) => {
    setRepeatDays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : RRULE_DAYS.filter((d) => d === day || current.includes(d)),
    );
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

    const useRepeat = !editing && repeats && repeatDays.length > 0 && repeatUntil;

    const message = await onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        start,
        end: end || start,
        allDay,
        category,
        course,
        repeat: useRepeat
          ? { days: repeatDays, until: untilInstant(repeatUntil) }
          : undefined,
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
  const courseStyle = COURSE_STYLES[course];

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
            <label className={labelClass} htmlFor="event-course">
              Which class
            </label>
            <div className="flex items-center gap-3">
              <select
                id="event-course"
                value={course}
                onChange={(e) => {
                  setCourseTouched(true);
                  setCourse(e.target.value as CourseKey);
                }}
                className={inputClass}
              >
                {COURSE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span
                className={`h-4 w-4 shrink-0 rounded-full ${courseStyle.accent}`}
                aria-hidden="true"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted">
              This sets the event&apos;s colour, here and in Google Calendar.
            </p>
          </div>

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

          {!editing && (
            <div className="mb-5">
              <label className="mb-3 flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={repeats}
                  onChange={(e) => toggleRepeats(e.target.checked)}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                Repeats every week
              </label>

              {repeats && (
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <span className={labelClass}>On these days</span>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {DAY_PILLS.map((day, index) => {
                      const selected = repeatDays.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleRepeatDay(day.value)}
                          aria-pressed={selected}
                          aria-label={
                            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]
                          }
                          className={`h-9 w-9 rounded-full border text-sm transition ${
                            selected
                              ? "border-transparent gradient-primary text-white shadow-sm"
                              : "border-border text-muted hover:bg-surface-hover hover:text-foreground"
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>

                  <label className={labelClass} htmlFor="event-repeat-until">
                    Until
                  </label>
                  <input
                    id="event-repeat-until"
                    type="date"
                    value={repeatUntil}
                    min={splitDay(start)}
                    onChange={(e) => setRepeatUntil(e.target.value)}
                    className={inputClass}
                  />
                  <p className="mt-2 text-xs text-muted">
                    {repeatDays.length === 0
                      ? "Pick at least one day, or untick the box to keep this a one-off."
                      : "Each week lands on your calendar separately, so you can move or delete a single one later."}
                  </p>
                </div>
              )}
            </div>
          )}

          {editing?.seriesId && (
            <p className="mb-5 rounded-2xl border border-border bg-background/60 p-3 text-xs text-muted">
              This is one week of a repeating event — saving or deleting here
              changes only this occurrence. Edit the series in Google Calendar to
              change them all.
            </p>
          )}

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
