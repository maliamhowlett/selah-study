"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { STORAGE_KEYS } from "@/lib/constants";
import { useStoredValue } from "@/lib/study/local-store";
import type { FlashcardDeck as FlashcardDeckType, Flashcard } from "@/lib/types";
import FlashcardDeck from "@/components/FlashcardDeck";

const USER = "local";

function parse<T>(raw: string | null): T[] {
  try {
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export default function StudyDecks() {
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  // Both lists come straight from storage, and the visible cards are simply a
  // filter over them — derived during render rather than mirrored into state.
  const rawDecks = useStoredValue(STORAGE_KEYS.flashcardDecks(USER));
  const rawCards = useStoredValue(STORAGE_KEYS.flashcards(USER));

  const decks = useMemo(() => parse<FlashcardDeckType>(rawDecks), [rawDecks]);
  const allCards = useMemo(() => parse<Flashcard>(rawCards), [rawCards]);
  const cards = useMemo(
    () => (selectedDeckId ? allCards.filter((c) => c.deckId === selectedDeckId) : []),
    [allCards, selectedDeckId],
  );

  const cardCount = (deckId: string) =>
    allCards.filter((c) => c.deckId === deckId).length;

  const selectedDeck = decks.find((d) => d.id === selectedDeckId);

  // Empty state — no decks yet. This is one section of the study page now,
  // so it stays inline rather than taking over the screen.
  if (decks.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <h3 className="text-lg text-foreground">No flashcard decks yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Decks are built from your lecture notes. Record or write a set of
          notes and you can turn them into cards.
        </p>
        <Link
          href="/notes"
          className="mt-5 inline-block rounded-full border border-border px-5 py-2.5 text-sm text-foreground hover:bg-surface-hover"
        >
          Go to notes
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Deck selector */}
      {!selectedDeckId ? (
        <div className="space-y-3">
          <p className="mb-4 text-muted">Choose a deck to study:</p>
          {decks.map((deck) => {
            const count = cardCount(deck.id);
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
            onClick={() => setSelectedDeckId(null)}
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
