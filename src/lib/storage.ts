import { Transcription, Flashcard, FlashcardDeck, CachedVerse } from "./types";
import { STORAGE_KEYS } from "./constants";

const DEFAULT_USER = "local";

// Generic helpers

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Transcriptions

export function getTranscriptions(userId = DEFAULT_USER): Transcription[] {
  return getItem<Transcription[]>(STORAGE_KEYS.transcriptions(userId), []);
}

export function saveTranscription(
  transcription: Transcription,
  userId = DEFAULT_USER
): void {
  const all = getTranscriptions(userId);
  const idx = all.findIndex((t) => t.id === transcription.id);
  if (idx >= 0) {
    all[idx] = transcription;
  } else {
    all.unshift(transcription);
  }
  setItem(STORAGE_KEYS.transcriptions(userId), all);
}

export function deleteTranscription(id: string, userId = DEFAULT_USER): void {
  const all = getTranscriptions(userId).filter((t) => t.id !== id);
  setItem(STORAGE_KEYS.transcriptions(userId), all);
}

// Flashcard Decks

export function getFlashcardDecks(userId = DEFAULT_USER): FlashcardDeck[] {
  return getItem<FlashcardDeck[]>(STORAGE_KEYS.flashcardDecks(userId), []);
}

export function saveFlashcardDeck(
  deck: FlashcardDeck,
  userId = DEFAULT_USER
): void {
  const all = getFlashcardDecks(userId);
  const idx = all.findIndex((d) => d.id === deck.id);
  if (idx >= 0) {
    all[idx] = deck;
  } else {
    all.unshift(deck);
  }
  setItem(STORAGE_KEYS.flashcardDecks(userId), all);
}

// Flashcards

export function getFlashcards(userId = DEFAULT_USER): Flashcard[] {
  return getItem<Flashcard[]>(STORAGE_KEYS.flashcards(userId), []);
}

export function getFlashcardsByDeck(
  deckId: string,
  userId = DEFAULT_USER
): Flashcard[] {
  return getFlashcards(userId).filter((c) => c.deckId === deckId);
}

export function saveFlashcard(card: Flashcard, userId = DEFAULT_USER): void {
  const all = getFlashcards(userId);
  const idx = all.findIndex((c) => c.id === card.id);
  if (idx >= 0) {
    all[idx] = card;
  } else {
    all.push(card);
  }
  setItem(STORAGE_KEYS.flashcards(userId), all);
}

// Cached Bible Verse

export function getCachedVerse(): CachedVerse | null {
  return getItem<CachedVerse | null>(STORAGE_KEYS.cachedVerse, null);
}

export function setCachedVerse(verse: CachedVerse): void {
  setItem(STORAGE_KEYS.cachedVerse, verse);
}
