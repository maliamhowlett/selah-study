import { NextResponse } from "next/server";
import { BIBLE_VERSES } from "@/lib/constants";

export async function GET() {
  // Pick a deterministic verse based on the day of the year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const reference = BIBLE_VERSES[dayOfYear % BIBLE_VERSES.length];

  try {
    const res = await fetch(
      `https://bible-api.com/${encodeURIComponent(reference)}`,
      { next: { revalidate: 86400 } } // cache for 24 hours
    );

    if (!res.ok) {
      throw new Error(`bible-api.com responded with ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      text: data.text as string,
      reference: data.reference as string,
    });
  } catch {
    // Fallback verse if the API is down
    return NextResponse.json({
      text: "Your word is a lamp to my feet and a light for my path.",
      reference: "Psalm 119:105",
    });
  }
}
