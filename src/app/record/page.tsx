"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { saveTranscription } from "@/lib/storage";
import type { Transcription } from "@/lib/types";

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
  const [saved, setSaved] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const handleSave = useCallback(() => {
    if (!transcript.trim()) return;

    const now = new Date().toISOString();
    const newTranscription: Transcription = {
      id: crypto.randomUUID(),
      title: title.trim() || `Recording — ${new Date().toLocaleDateString()}`,
      text: transcript.trim(),
      highlights: [],
      createdAt: now,
      updatedAt: now,
    };

    saveTranscription(newTranscription);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [transcript, title]);

  const handleReset = useCallback(() => {
    reset();
    setTitle("");
    setSaved(false);
    setElapsed(0);
  }, [reset]);

  if (!isSupported) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-muted"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-foreground">
            Browser Not Supported
          </h2>
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
      <h1 className="mb-8 text-3xl font-extrabold text-foreground">Record a Lecture</h1>

      {/* Title input */}
      <input
        type="text"
        placeholder="Lecture title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-6 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
      />

      {/* Record button — click to toggle */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <button
          onClick={handleToggle}
          className={`flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 select-none ${
            isListening
              ? "scale-110 bg-red-600 shadow-xl shadow-red-500/40 animate-pulse"
              : "gradient-primary shadow-lg shadow-primary/25 hover:scale-105"
          }`}
          aria-label={isListening ? "Click to stop recording" : "Click to start recording"}
        >
          {isListening ? (
            // Stop icon (square)
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-10 w-10">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            // Mic icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-10 w-10">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          )}
        </button>

        {isListening ? (
          <div className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-2 text-sm font-semibold text-red-500">
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
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Transcription
            </h2>
            {isListening && (
              <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-500">
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

      {/* Action buttons */}
      {transcript && !isListening && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`rounded-xl px-6 py-3 text-sm font-bold text-white transition-all ${
              saved
                ? "bg-success"
                : "gradient-primary shadow-lg shadow-primary/25 hover:scale-105"
            }`}
          >
            {saved ? "Saved!" : "Save Transcription"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
