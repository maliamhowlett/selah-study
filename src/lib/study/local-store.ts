"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads localStorage through useSyncExternalStore rather than an effect.
 *
 * Browser-only state has two bad default answers: set it in an effect (a
 * cascading render, which the lint rule rightly objects to) or initialise state
 * lazily (a hydration mismatch, because the server has no localStorage). This
 * is the third: React asks for a server snapshot separately, so the first paint
 * is honest about knowing nothing and the client swaps in the real value.
 *
 * Returns the raw string so the snapshot is stable by value — returning a
 * parsed object would hand React a new reference every call and loop forever.
 */

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // The storage event only fires for *other* tabs, which is exactly the case
  // our own emit() can't cover.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Private windows and blocked site data make the accessor itself throw.
    return null;
  }
}

/** The raw stored string, or null before hydration and when unreadable. */
export function useStoredValue(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
}

export function writeStoredValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Nothing to do — the change just won't survive a reload.
  }
  emit();
}
