"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const TERMS_KEY = "selah_terms_accepted";

export default function TermsAgreement() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(TERMS_KEY);
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(TERMS_KEY, new Date().toISOString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-foreground">
            Welcome to <span className="gradient-text">Selah Study</span>
          </h2>
          <p className="mt-2 text-sm text-muted">
            Before you get started, please review and accept our terms.
          </p>
        </div>

        {/* Key points */}
        <div className="mb-6 space-y-3 rounded-xl bg-background p-4">
          <div className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-sm text-foreground">
              <strong>Recording consent is your responsibility.</strong> You must obtain permission
              before recording any lecture, conversation, or sermon. Recording without consent may
              be illegal in your jurisdiction.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-sm text-foreground">
              <strong>Your data stays on your device.</strong> Everything is stored locally in your
              browser. We don&apos;t collect or store your personal information.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M10.75 10.818a1.5 1.5 0 00-1.5-1.5 1.5 1.5 0 113 0 1.5 1.5 0 01-1.5 1.5zM10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
              </svg>
            </span>
            <p className="text-sm text-foreground">
              <strong>Free for educational use.</strong> Selah Study is a free tool for personal
              study and devotional purposes.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            className="gradient-primary w-full rounded-full py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
          >
            I Agree — Let&apos;s Go!
          </button>
          <Link
            href="/terms"
            onClick={handleAccept}
            className="text-center text-sm text-muted hover:text-primary transition-colors"
          >
            Read full Terms of Use
          </Link>
        </div>
      </div>
    </div>
  );
}
