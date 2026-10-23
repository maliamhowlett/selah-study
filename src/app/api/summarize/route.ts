import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI summarization is not configured." },
      { status: 500 }
    );
  }

  try {
    const { text, title } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "No text provided." },
        { status: 400 }
      );
    }

    // Trim to ~8000 words to stay within token limits
    const trimmedText = text.split(/\s+/).slice(0, 8000).join(" ");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // llama-3.3-70b-versatile was retired by Groq and every call 500s.
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content:
              "You are a study assistant for Christian students. You create clear, well-organized one-pager summaries from lecture transcriptions. Your summaries should be concise, highlight the main points, and be easy to study from. Use bullet points and keep it to one page worth of content. If the lecture references Bible verses, include them.",
          },
          {
            role: "user",
            content: `Create a one-pager summary of the following lecture${title ? ` titled "${title}"` : ""}. Include the main points, key takeaways, and any Bible references mentioned.\n\n${trimmedText}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate summary. Please try again." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const summary = data.choices?.[0]?.message?.content;

    if (!summary) {
      return NextResponse.json(
        { error: "No summary was generated." },
        { status: 502 }
      );
    }

    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
