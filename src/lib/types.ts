export interface Transcription {
  id: string;
  title: string;
  text: string;
  highlights: string[];
  classSlug?: string;
  generatedNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  createdAt: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  transcriptionId?: string;
  createdAt: string;
}

export interface CachedVerse {
  text: string;
  reference: string;
  date: string;
}
