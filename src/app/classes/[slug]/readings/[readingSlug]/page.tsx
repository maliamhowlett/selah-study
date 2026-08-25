import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fetchUserClassBySlug, isAuthenticated } from "@/lib/db/classes";
import { getReadingBySlug } from "@/lib/readings";

// Readings are still hardcoded (not yet migrated to DB). To prevent leakage,
// we require the current user to actually own a class matching the slug.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; readingSlug: string }>;
}) {
  const { slug, readingSlug } = await params;
  const r = getReadingBySlug(slug, readingSlug);
  if (!r) return { title: "Reading not found" };
  return {
    title: `${r.title} — Notes`,
    description: r.thesis,
  };
}

export default async function ReadingNotesPage({
  params,
}: {
  params: Promise<{ slug: string; readingSlug: string }>;
}) {
  const { slug, readingSlug } = await params;
  if (!(await isAuthenticated())) redirect("/login");

  const c = await fetchUserClassBySlug(slug);
  if (!c) notFound();

  const r = getReadingBySlug(slug, readingSlug);
  if (!r) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href={`/classes/${c.slug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
      >
        ← Back to {c.courseCode}
      </Link>

      <div className="mb-10">
        {r.assignedFor && (
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">
            {r.assignedFor}
          </p>
        )}
        <h1 className="text-4xl italic text-foreground sm:text-5xl">{r.title}</h1>
        <p className="mt-3 text-base text-muted">
          {r.author}
          {r.source && ` · ${r.source}`}
          {r.date && ` · ${r.date}`}
        </p>
        {r.url && (
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            Read the original article →
          </a>
        )}
      </div>

      <div className="mb-10 rounded-3xl border border-primary/40 bg-primary-light p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Thesis</p>
        <p className="text-foreground">{r.thesis}</p>
      </div>

      <Section title="Summary">
        <p className="text-foreground/90 leading-relaxed">{r.summary}</p>
      </Section>

      <Section title="Key Ideas">
        <ul className="space-y-3">
          {r.keyIdeas.map((idea, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] text-primary">
                {i + 1}
              </span>
              <span className="text-foreground/90">{idea}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Key Quotes">
        <div className="space-y-4">
          {r.keyQuotes.map((q, i) => (
            <blockquote
              key={i}
              className="rounded-2xl border-l-4 border-primary bg-surface p-4"
            >
              <p className="italic text-foreground/90">&ldquo;{q.quote}&rdquo;</p>
              {q.note && <p className="mt-2 text-xs text-muted">{q.note}</p>}
            </blockquote>
          ))}
        </div>
      </Section>

      <Section title="Concepts & Vocabulary">
        <dl className="space-y-3">
          {r.vocabulary.map((v, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <dt className="font-medium text-foreground">{v.term}</dt>
              <dd className="mt-1 text-sm text-muted">{v.definition}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Discussion Questions">
        <ul className="space-y-3">
          {r.discussionQuestions.map((q, i) => (
            <li
              key={i}
              className="rounded-2xl border border-border bg-surface p-4 text-sm text-foreground/90"
            >
              {q}
            </li>
          ))}
        </ul>
      </Section>

      {r.responsePaperPrompts && r.responsePaperPrompts.length > 0 && (
        <Section title="Response Paper Ideas">
          <ul className="space-y-3">
            {r.responsePaperPrompts.map((p, i) => (
              <li
                key={i}
                className="rounded-2xl bg-secondary-light p-4 text-sm text-foreground/90"
              >
                {p}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">{title}</h2>
      {children}
    </section>
  );
}
