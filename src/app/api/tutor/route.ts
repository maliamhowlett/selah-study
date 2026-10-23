import { NextResponse, type NextRequest } from "next/server";

// A tutor for the study pages, so "why is that a credit?" can be asked at the
// moment it comes up rather than saved for office hours.
//
// Grounded deliberately narrowly: the course's own vocabulary, the chapters
// actually on the exam, and whatever drill is on screen. An ungrounded model
// will happily answer with conventions her course doesn't use, which is worse
// than no answer when she has no way to tell the difference.

const MODEL = "openai/gpt-oss-120b";

const SYSTEM = `You are a tutor for ACCT 20000 (Intro Accounting) at Purdue,
helping a first-year student prepare for Exam 2, which covers chapters 4-7 of
Spiceland's Financial Accounting: cash and internal controls, receivables and
revenues, inventory and cost of goods sold, and long-term assets.

How to answer:
- Answer the question that was asked, briefly. Two or three short paragraphs at
  most. She is revising, not reading a textbook.
- Explain WHY, not just what. "It's a credit because the company now owes the
  customer the work" teaches something; "credit Deferred Revenue" does not.
- When debits and credits are involved, ground it in the rule: assets and
  expenses increase with debits; liabilities, equity and revenue increase with
  credits. Decreases go the other way.
- Use her course's vocabulary. Her instructor writes AUA for Allowance for
  Uncollectible Accounts, BDE for Bad Debt Expense, and POR method for the
  percentage-of-receivables method.
- Use plain language. No bullet-point walls, no bold-everything.
- If you are not confident, say so plainly and tell her to check the notes
  packet or ask Dr. Bokrand. Do not invent a rule that sounds plausible.
- She is anxious about this exam. Be matter-of-fact and encouraging, never
  patronising, and never pad the answer with reassurance she didn't ask for.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The tutor isn't configured on this deployment." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }

  const raw = body as { question?: unknown; context?: unknown };
  const question = typeof raw.question === "string" ? raw.question.trim() : "";
  const context = typeof raw.context === "string" ? raw.context.trim().slice(0, 1200) : "";

  if (!question) return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  if (question.length > 1000) {
    return NextResponse.json({ error: "That question is a bit long — try trimming it." }, { status: 400 });
  }

  const prompt = context
    ? `She is looking at this drill:\n\n${context}\n\nHer question: ${question}`
    : question;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 700,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Groq tutor request failed:", res.status, detail.slice(0, 300));
      return NextResponse.json(
        { error: "The tutor couldn't be reached. Try again in a moment." },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return NextResponse.json({ error: "No answer came back. Try rephrasing." }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Tutor route error:", err);
    return NextResponse.json({ error: "Something went wrong reaching the tutor." }, { status: 500 });
  }
}
