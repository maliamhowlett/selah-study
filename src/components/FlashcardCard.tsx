"use client";

import { useState } from "react";

interface FlashcardCardProps {
  front: string;
  back: string;
}

export default function FlashcardCard({ front, back }: FlashcardCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 h-64 w-full cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-border bg-surface p-8 [backface-visibility:hidden]">
          <p className="text-center text-lg font-medium text-foreground">{front}</p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-primary/30 bg-primary/5 p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-center text-lg leading-relaxed text-foreground">
            {back || <span className="italic text-muted">No answer yet</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
