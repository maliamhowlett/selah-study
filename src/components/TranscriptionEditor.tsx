"use client";

import { useState, useCallback } from "react";
import { saveTranscription, deleteTranscription } from "@/lib/storage";
import type { Transcription } from "@/lib/types";

interface TranscriptionEditorProps {
  transcription: Transcription;
  onUpdate: () => void;
  onCreateFlashcard: (front: string, back: string) => void;
}

export default function TranscriptionEditor({
  transcription,
  onUpdate,
  onCreateFlashcard,
}: TranscriptionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(transcription.title);
  const [text, setText] = useState(transcription.text);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  const handleSave = useCallback(() => {
    saveTranscription({
      ...transcription,
      title: title.trim() || transcription.title,
      text: text.trim(),
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
    onUpdate();
  }, [transcription, title, text, onUpdate]);

  const handleDelete = useCallback(() => {
    deleteTranscription(transcription.id);
    setShowDeleteConfirm(false);
    onUpdate();
  }, [transcription.id, onUpdate]);

  const handleTextSelect = useCallback(() => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 0) {
      setSelectedText(selection);
    }
  }, []);

  const handleHighlight = useCallback(() => {
    if (!selectedText) return;
    const updated = {
      ...transcription,
      highlights: [...transcription.highlights, selectedText],
      updatedAt: new Date().toISOString(),
    };
    saveTranscription(updated);
    setSelectedText("");
    onUpdate();
  }, [transcription, selectedText, onUpdate]);

  const removeHighlight = useCallback(
    (index: number) => {
      const updated = {
        ...transcription,
        highlights: transcription.highlights.filter((_, i) => i !== index),
        updatedAt: new Date().toISOString(),
      };
      saveTranscription(updated);
      onUpdate();
    },
    [transcription, onUpdate]
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-lg font-semibold text-foreground focus:border-primary focus:outline-none"
          />
        ) : (
          <h2 className="text-lg font-semibold text-foreground">
            {transcription.title}
          </h2>
        )}
        <p className="shrink-0 text-xs text-muted">
          {formatDate(transcription.createdAt)}
        </p>
      </div>

      {/* Text content */}
      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="mb-4 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground leading-relaxed focus:border-primary focus:outline-none"
        />
      ) : (
        <p
          className="mb-4 whitespace-pre-wrap leading-relaxed text-foreground"
          onMouseUp={handleTextSelect}
        >
          {transcription.text}
        </p>
      )}

      {/* Selection actions */}
      {selectedText && !isEditing && (
        <div className="mb-4 flex flex-wrap gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="w-full text-xs text-muted">
            Selected: &ldquo;{selectedText.slice(0, 60)}
            {selectedText.length > 60 ? "..." : ""}&rdquo;
          </p>
          <button
            onClick={handleHighlight}
            className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-white hover:bg-secondary-hover"
          >
            Highlight
          </button>
          <button
            onClick={() => {
              onCreateFlashcard(selectedText, "");
              setSelectedText("");
            }}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover"
          >
            Create Flashcard
          </button>
          <button
            onClick={() => setSelectedText("")}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface-hover"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Highlights */}
      {transcription.highlights.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
            Highlights
          </p>
          <div className="flex flex-col gap-2">
            {transcription.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-2 rounded-lg bg-secondary/10 px-3 py-2"
              >
                <p className="text-sm italic text-foreground">
                  &ldquo;{h}&rdquo;
                </p>
                <button
                  onClick={() => removeHighlight(i)}
                  className="shrink-0 text-muted hover:text-foreground"
                  aria-label="Remove highlight"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Save
            </button>
            <button
              onClick={() => {
                setTitle(transcription.title);
                setText(transcription.text);
                setIsEditing(false);
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-surface-hover"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground"
            >
              Edit
            </button>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Delete this note?</span>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted hover:bg-surface-hover"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
