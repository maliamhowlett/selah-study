"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { getTranscriptions, getFlashcardDecks, saveFlashcardDeck, saveFlashcard } from "@/lib/storage";
import type { Transcription, FlashcardDeck } from "@/lib/types";
import TranscriptionEditor from "@/components/TranscriptionEditor";
import OnePager from "@/components/OnePager";
import FlashcardForm from "@/components/FlashcardForm";

export default function NotesPage() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOnePager, setShowOnePager] = useState(false);
  const [showFlashcardForm, setShowFlashcardForm] = useState(false);
  const [flashcardFront, setFlashcardFront] = useState("");
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(() => {
    const all = getTranscriptions();
    setTranscriptions(all);
    // If the selected transcription was deleted, deselect
    if (selectedId && !all.find((t) => t.id === selectedId)) {
      setSelectedId(null);
    }
  }, [selectedId]);

  useEffect(() => {
    reload();
    setLoaded(true);
  }, [reload]);

  const selected = transcriptions.find((t) => t.id === selectedId) || null;

  const handleCreateFlashcard = useCallback(
    (front: string, back: string) => {
      setFlashcardFront(front);
      setShowFlashcardForm(true);
      if (back) {
        // If back is provided, save immediately
        handleSaveFlashcard(front, back);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSaveFlashcard = useCallback(
    (front: string, back: string) => {
      if (!selected) return;

      // Find or create a deck for this transcription
      let decks = getFlashcardDecks();
      let deck = decks.find((d) => d.transcriptionId === selected.id);

      if (!deck) {
        deck = {
          id: crypto.randomUUID(),
          name: selected.title,
          transcriptionId: selected.id,
          createdAt: new Date().toISOString(),
        } satisfies FlashcardDeck;
        saveFlashcardDeck(deck);
      }

      saveFlashcard({
        id: crypto.randomUUID(),
        front,
        back,
        deckId: deck.id,
        createdAt: new Date().toISOString(),
      });

      setShowFlashcardForm(false);
      setFlashcardFront("");
    },
    [selected]
  );

  if (!loaded) return null;

  // Empty state
  if (transcriptions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-xl border border-border bg-surface p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-muted"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
            <path d="M8 12h8v2H8zm0 4h8v2H8z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            No notes yet
          </h2>
          <p className="mt-2 text-muted">
            Record a lecture to get started. Your transcriptions will appear here.
          </p>
          <Link
            href="/record"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Go to Record
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Your Notes</h1>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar — transcription list */}
        <div className="space-y-2">
          {transcriptions.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedId(t.id);
                setShowOnePager(false);
                setShowFlashcardForm(false);
              }}
              className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                selectedId === t.id
                  ? "border border-primary/30 bg-primary/10 text-primary"
                  : "border border-border bg-surface text-foreground hover:bg-surface-hover"
              }`}
            >
              <p className="font-medium truncate">{t.title}</p>
              <p className="mt-1 text-xs text-muted">
                {new Date(t.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {selected ? (
            <>
              {/* View toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowOnePager(false)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    !showOnePager
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:bg-surface-hover"
                  }`}
                >
                  Full Text
                </button>
                <button
                  onClick={() => setShowOnePager(true)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    showOnePager
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:bg-surface-hover"
                  }`}
                >
                  One-Pager
                </button>
              </div>

              {showOnePager ? (
                <OnePager transcription={selected} />
              ) : (
                <TranscriptionEditor
                  key={selected.id}
                  transcription={selected}
                  onUpdate={reload}
                  onCreateFlashcard={handleCreateFlashcard}
                />
              )}

              {showFlashcardForm && (
                <FlashcardForm
                  initialFront={flashcardFront}
                  onSave={handleSaveFlashcard}
                  onCancel={() => {
                    setShowFlashcardForm(false);
                    setFlashcardFront("");
                  }}
                />
              )}

              {/* Create flashcard button (when form is hidden) */}
              {!showFlashcardForm && (
                <button
                  onClick={() => setShowFlashcardForm(true)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground"
                >
                  + Add Flashcard
                </button>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-border bg-surface p-8 text-center text-muted">
              <p>Select a note from the sidebar to view it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
