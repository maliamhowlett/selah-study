import { NextRequest, NextResponse } from "next/server";

type ClassContext = {
  courseCode: string;
  title: string;
  department: string;
  overview?: string;
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI notes generation is not configured." },
      { status: 500 },
    );
  }

  try {
    const {
      text,
      title,
      classContext,
    }: {
      text: string;
      title?: string;
      classContext?: ClassContext;
    } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Not enough transcript to generate notes." },
        { status: 400 },
      );
    }

    const trimmedText = text.split(/\s+/).slice(0, 8000).join(" ");

    const systemPrompt = classContext
      ? `You are a study assistant helping a college student turn lecture transcriptions into clean, organized study notes for the course "${classContext.courseCode} — ${classContext.title}" (${classContext.department}).

Course overview: ${classContext.overview ?? "N/A"}

Output well-structured markdown notes with these sections in this order:

## Summary
Two or three sentences capturing the main point of the lecture.

## Key Concepts
Bulleted list of the most important ideas, definitions, formulas, dates, or names covered — whatever fits the subject. For math/quantitative courses, include formulas in inline code or LaTeX-like plain text.

## Details
Longer bulleted breakdown of supporting points, examples, and explanations from the lecture. Preserve technical precision.

## Terms & Definitions
If the lecture introduces terminology, list "**term** — definition" bullets. Skip this section if not applicable.

## Review Questions
3–5 questions the student could quiz themselves on to test comprehension.

Keep it faithful to what was actually said. Do NOT invent content the transcript doesn't support. If the transcript is fragmented or unclear, say so honestly rather than making things up. Use plain, direct language.`
      : `You are a study assistant helping a college student turn a lecture transcription into clean study notes.

Output markdown with sections: ## Summary, ## Key Concepts, ## Details, ## Terms & Definitions (if applicable), ## Review Questions (3–5).

Keep it faithful to the transcript. Do not invent content. If the transcript is unclear, say so.`;

    const userPrompt = `Generate study notes for the following lecture transcription${
      title ? ` titled "${title}"` : ""
    }.\n\nTranscript:\n${trimmedText}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate notes. Please try again." },
        { status: 502 },
      );
    }

    const data = await res.json();
    const notes = data.choices?.[0]?.message?.content;

    if (!notes) {
      return NextResponse.json(
        { error: "No notes were generated." },
        { status: 502 },
      );
    }

    return NextResponse.json({ notes });
  } catch (err) {
    console.error("lecture-notes error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
