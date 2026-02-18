"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFlashcardDecks, getFlashcardsByDeck } from "@/lib/storage";
import type { FlashcardDeck as FlashcardDeckType, Flashcard } from "@/lib/types";
import FlashcardDeck from "@/components/FlashcardDeck";

export default function StudyPage() {
  const [decks, setDecks] = useState<FlashcardDeckType[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDecks(getFlashcardDecks());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (selectedDeckId) {
      setCards(getFlashcardsByDeck(selectedDeckId));
    }
  }, [selectedDeckId]);

  if (!loaded) return null;

  const selectedDeck = decks.find((d) => d.id === selectedDeckId);

  // Empty state — no decks at all
  if (decks.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-xl border border-border bg-surface p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto h-12 w-12 text-muted"
          >
            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z" />
            <path d="M12 7l-1.41 1.41L13.17 11H7v2h6.17l-2.58 2.59L12 17l5-5-5-5z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            No flashcard decks yet
          </h2>
          <p className="mt-2 text-muted">
            Create flashcards from your notes to start studying.
          </p>
          <Link
            href="/notes"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Go to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Study</h1>

      {/* Deck selector */}
      {!selectedDeckId ? (
        <div className="space-y-3">
          <p className="mb-4 text-muted">Choose a deck to study:</p>
          {decks.map((deck) => {
            const count = getFlashcardsByDeck(deck.id).length;
            return (
              <button
                key={deck.id}
                onClick={() => setSelectedDeckId(deck.id)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-surface p-5 text-left transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-foreground">{deck.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {count} {count === 1 ? "card" : "cards"}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 text-muted"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          {/* Back button */}
          <button
            onClick={() => {
              setSelectedDeckId(null);
              setCards([]);
            }}
            className="mb-6 flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
            All Decks
          </button>

          <FlashcardDeck
            cards={cards}
            deckName={selectedDeck?.name || "Flashcards"}
          />
        </div>
      )}
    </div>
  );
}
