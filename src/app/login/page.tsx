"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-foreground">
            Sign in to <span className="gradient-text">Selah Study</span>
          </h1>
          <p className="mt-2 text-muted">
            Save your notes, flashcards, and progress across devices.
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-lg">
          {/* Coming soon badge */}
          <div className="mb-6 rounded-lg bg-secondary-light p-3 text-center">
            <p className="text-sm font-semibold text-secondary">
              Accounts coming soon! For now, your data is saved locally in your browser.
            </p>
          </div>

          {/* Google button */}
          <button
            disabled
            className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 font-semibold text-foreground opacity-60 cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Apple button */}
          <button
            disabled
            className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 font-semibold text-foreground opacity-60 cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continue with Apple
          </button>

          {/* Email button */}
          <button
            disabled
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 font-semibold text-foreground opacity-60 cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
            Continue with Email
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Continue without account */}
          <Link
            href="/"
            className="block w-full rounded-xl gradient-primary py-3 text-center text-sm font-bold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
          >
            Continue without an account
          </Link>

          <p className="mt-4 text-center text-xs text-muted">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Use
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
