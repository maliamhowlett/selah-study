"use client";

import { useState, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { saveTranscription } from "@/lib/storage";
import type { Transcription } from "@/lib/types";

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
  }, [reset]);

  if (!isSupported) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-xl border border-border bg-surface p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-muted"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            Browser Not Supported
          </h2>
          <p className="mt-2 text-muted">
            Speech recognition requires <strong>Chrome</strong>, <strong>Edge</strong>,
            or <strong>Safari</strong>. Please open StudySet in one of these browsers to
            use the recording feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Record a Lecture</h1>

      {/* Title input */}
      <input
        type="text"
        placeholder="Lecture title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-6 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
      />

      {/* Record button */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <button
          onMouseDown={!isListening ? start : undefined}
          onMouseUp={isListening ? stop : undefined}
          onMouseLeave={isListening ? stop : undefined}
          onTouchStart={!isListening ? start : undefined}
          onTouchEnd={isListening ? stop : undefined}
          className={`flex h-24 w-24 items-center justify-center rounded-full transition-all duration-200 select-none ${
            isListening
              ? "scale-110 bg-red-600 shadow-lg shadow-red-500/30"
              : "bg-primary shadow-md hover:bg-primary-hover"
          }`}
          aria-label={isListening ? "Release to stop recording" : "Hold to record"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="h-10 w-10"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>

        <p className="text-sm text-muted">
          {isListening ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Recording... release to stop
            </span>
          ) : transcript ? (
            "Hold to continue recording"
          ) : (
            "Hold to start recording"
          )}
        </p>
      </div>

      {/* Transcription display */}
      {(transcript || interimTranscript) && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary">
              Transcription
            </h2>
            {isListening && (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600">
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
            className={`rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors ${
              saved
                ? "bg-secondary"
                : "bg-primary hover:bg-primary-hover"
            }`}
          >
            {saved ? "Saved!" : "Save Transcription"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
