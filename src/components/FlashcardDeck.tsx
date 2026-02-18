"use client";

import { useState, useCallback, useEffect } from "react";
import FlashcardCard from "./FlashcardCard";
import type { Flashcard } from "@/lib/types";

interface FlashcardDeckProps {
  cards: Flashcard[];
  deckName: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FlashcardDeck({ cards, deckName }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [orderedCards, setOrderedCards] = useState(cards);
  const [isShuffled, setIsShuffled] = useState(false);

  // Reset when cards prop changes
  useEffect(() => {
    setOrderedCards(cards);
    setCurrentIndex(0);
    setIsShuffled(false);
  }, [cards]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, orderedCards.length - 1));
  }, [orderedCards.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleShuffle = useCallback(() => {
    setOrderedCards(shuffleArray(cards));
    setCurrentIndex(0);
    setIsShuffled(true);
  }, [cards]);

  const handleReset = useCallback(() => {
    setOrderedCards(cards);
    setCurrentIndex(0);
    setIsShuffled(false);
  }, [cards]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "d") goNext();
      if (e.key === "ArrowLeft" || e.key === "a") goPrev();
      if (e.key === "s") handleShuffle();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, handleShuffle]);

  if (orderedCards.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center text-muted">
        <p>No flashcards in this deck yet.</p>
      </div>
    );
  }

  const card = orderedCards[currentIndex];

  return (
    <div>
      {/* Deck header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{deckName}</h2>
        <p className="text-sm text-muted">
          {currentIndex + 1} / {orderedCards.length}
        </p>
      </div>

      {/* Card */}
      <FlashcardCard front={card.front} back={card.back} />

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={isShuffled ? handleReset : handleShuffle}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground"
        >
          {isShuffled ? "Reset Order" : "Shuffle"}
        </button>

        <button
          onClick={goNext}
          disabled={currentIndex === orderedCards.length - 1}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="mt-4 text-center text-xs text-muted">
        Click card to flip &middot; Arrow keys or A/D to navigate &middot; S to shuffle
      </p>
    </div>
  );
}
