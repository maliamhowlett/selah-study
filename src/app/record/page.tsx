"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { saveTranscription } from "@/lib/storage";
import type { Transcription } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

type ClassOption = {
  slug: string;
  courseCode: string;
  title: string;
  department: string | null;
  overview: string | null;
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function RecordPage() {
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    start,
    stop,
    reset,
  } = useSpeechRecognition();

  const [title, setTitle] = useState("");
  const [classSlug, setClassSlug] = useState("");
  const [classes, setClasses] = useState<ClassOption[] | null>(null);
  const [notes, setNotes] = useState("");
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [notesError, setNotesError] = useState("");
  const [saved, setSaved] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load the user's classes for the dropdown
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setClasses([]);
        return;
      }
      const { data } = await supabase
        .from("classes")
        .select("slug, course_code, title, department, overview")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      setClasses(
        (data ?? []).map((c) => ({
          slug: c.slug as string,
          courseCode: c.course_code as string,
          title: c.title as string,
          department: (c.department as string | null) ?? null,
          overview: (c.overview as string | null) ?? null,
        })),
      );
    });
  }, []);

  // Timer that runs while recording
  useEffect(() => {
    if (isListening) {
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  const handleToggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  const handleGenerateNotes = useCallback(async () => {
    if (!transcript.trim()) return;
    setGeneratingNotes(true);
    setNotesError("");
    try {
      const cls = classSlug ? classes?.find((c) => c.slug === classSlug) : undefined;
      const res = await fetch("/api/lecture-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transcript,
          title,
          classContext: cls
            ? {
                courseCode: cls.courseCode,
                title: cls.title,
                department: cls.department ?? "",
                overview: cls.overview ?? undefined,
              }
            : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotesError(data.error ?? "Failed to generate notes.");
        return;
      }
      setNotes(data.notes);
    } catch {
      setNotesError("Network error. Please try again.");
    } finally {
      setGeneratingNotes(false);
    }
  }, [transcript, title, classSlug]);

  const handleSave = useCallback(() => {
    if (!transcript.trim()) return;

    const now = new Date().toISOString();
    const newTranscription: Transcription = {
      id: crypto.randomUUID(),
      title: title.trim() || `Recording — ${new Date().toLocaleDateString()}`,
      text: transcript.trim(),
      highlights: [],
      classSlug: classSlug || undefined,
      generatedNotes: notes || undefined,
      createdAt: now,
      updatedAt: now,
    };

    saveTranscription(newTranscription);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [transcript, title, classSlug, notes]);

  const handleReset = useCallback(() => {
    reset();
    setTitle("");
    setClassSlug("");
    setNotes("");
    setNotesError("");
    setSaved(false);
    setElapsed(0);
  }, [reset]);

  if (!isSupported) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-3xl border border-border bg-surface p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-muted"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          <h2 className="mt-4 text-xl text-foreground">Browser Not Supported</h2>
          <p className="mt-2 text-muted">
            Speech recognition requires <strong>Chrome</strong>, <strong>Edge</strong>,
            or <strong>Safari</strong>. Please open Selah Study in one of these browsers to
            use the recording feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-4xl italic text-foreground">Record a Lecture</h1>

      {/* Class picker */}
      <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted">
        Class (optional)
      </label>
      <select
        value={classSlug}
        onChange={(e) => setClassSlug(e.target.value)}
        disabled={classes === null || classes.length === 0}
        className="mb-4 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-foreground focus:border-primary focus:outline-none disabled:opacity-60"
      >
        <option value="">
          {classes === null
            ? "Loading classes…"
            : classes.length === 0
              ? "Sign in and add classes to tag recordings"
              : "— No class —"}
        </option>
        {(classes ?? []).map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.courseCode} · {c.title}
          </option>
        ))}
      </select>

      {/* Title input */}
      <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted">
        Lecture title
      </label>
      <input
        type="text"
        placeholder="e.g., Ch. 3 — Adjusting Entries"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-8 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
      />

      {/* Record button — click to toggle */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <button
          onClick={handleToggle}
          className={`flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 select-none ${
            isListening
              ? "scale-110 bg-red-500 shadow-lg shadow-red-500/30 animate-pulse"
              : "gradient-primary shadow-md hover:scale-105"
          }`}
          aria-label={isListening ? "Click to stop recording" : "Click to start recording"}
        >
          {isListening ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-10 w-10">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-10 w-10">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          )}
        </button>

        {isListening ? (
          <div className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-2 text-sm text-red-500">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              Recording — {formatDuration(elapsed)}
            </span>
            <span className="text-xs text-muted">
              Click the button to stop. You can switch tabs — recording continues.
            </span>
          </div>
        ) : (
          <p className="text-sm text-muted">
            {transcript ? "Click to continue recording" : "Click to start recording"}
          </p>
        )}
      </div>

      {/* Transcription display */}
      {(transcript || interimTranscript) && (
        <div className="rounded-3xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-[0.2em] text-primary">
              Transcription
            </h2>
            {isListening && (
              <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs text-red-500">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                Live
              </span>
            )}
          </div>
          <p className="leading-relaxed text-foreground whitespace-pre-wrap">
            {transcript}
            {interimTranscript && (
              <span className="text-muted">{interimTranscript}</span>
            )}
          </p>
        </div>
      )}

      {/* Generated notes */}
      {notes && (
        <div className="mt-6 rounded-3xl border border-primary/40 bg-primary-light p-6">
          <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-primary">
            Generated Notes
          </h2>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
            {notes}
          </div>
        </div>
      )}

      {notesError && (
        <div className="mt-4 rounded-2xl border border-error/40 bg-error/5 p-4 text-sm text-error">
          {notesError}
        </div>
      )}

      {/* Action buttons */}
      {transcript && !isListening && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleGenerateNotes}
            disabled={generatingNotes}
            className="rounded-full gradient-primary px-6 py-3 text-sm text-white shadow-md hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
          >
            {generatingNotes
              ? "Generating…"
              : notes
                ? "Regenerate Notes"
                : "Generate Notes"}
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className={`rounded-full px-6 py-3 text-sm transition-all ${
              saved
                ? "bg-success text-white"
                : "border border-primary text-primary hover:bg-primary-light"
            }`}
          >
            {saved ? "Saved!" : "Save Recording"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-full border border-border px-6 py-3 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
