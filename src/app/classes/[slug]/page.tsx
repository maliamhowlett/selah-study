import Link from "next/link";
import { notFound } from "next/navigation";
import { CLASSES, getClassBySlug } from "@/lib/classes";
import { getReadingsForClass } from "@/lib/readings";
import ClassRecordings from "@/components/ClassRecordings";

export function generateStaticParams() {
  return CLASSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getClassBySlug(slug);
  if (!c) return { title: "Class not found" };
  return {
    title: `${c.courseCode} — ${c.title}`,
    description: c.overview,
  };
}

export default async function ClassPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getClassBySlug(slug);
  if (!c) notFound();
  const readings = getReadingsForClass(slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Back link */}
      <Link
        href="/classes"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-primary"
      >
        ← All classes
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div
          className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${c.color}`}
        >
          {c.courseCode}
        </div>
        <h1 className="text-4xl italic text-foreground sm:text-5xl">
          {c.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {c.department} · {c.credits} credit{c.credits === 1 ? "" : "s"}
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-muted">{c.overview}</p>
      </Section>

      {/* Lecture Recordings */}
      <Section title="Lecture Recordings">
        <ClassRecordings classSlug={c.slug} />
      </Section>

      {/* Readings & Notes */}
      {readings.length > 0 && (
        <Section title="Readings & Notes">
          <div className="space-y-2">
            {readings.map((r) => (
              <Link
                key={r.slug}
                href={`/classes/${c.slug}/readings/${r.slug}`}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:border-primary/40 hover:bg-primary-light/40"
              >
                <div>
                  <div className="text-foreground group-hover:text-primary">
                    {r.title}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    {r.author}
                    {r.assignedFor && ` · ${r.assignedFor}`}
                  </div>
                </div>
                <span className="text-primary opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Meeting times */}
      <Section title="When & Where">
        <ul className="space-y-2">
          {c.meetingTimes.map((m, i) => (
            <li key={i} className="rounded-lg border border-border bg-surface p-3">
              <div className="font-semibold text-foreground">
                {m.days} · {m.time}
              </div>
              <div className="text-sm text-muted">{m.location}</div>
              {m.note && <div className="mt-1 text-xs italic text-muted">{m.note}</div>}
            </li>
          ))}
        </ul>
      </Section>

      {/* Instructor */}
      <Section title="Instructor">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="font-semibold text-foreground">{c.instructor.name}</div>
          <a
            href={`mailto:${c.instructor.email}`}
            className="text-sm text-primary hover:underline"
          >
            {c.instructor.email}
          </a>
          {c.instructor.officeHours && (
            <p className="mt-2 text-sm text-muted">
              <span className="font-semibold text-foreground">Office hours: </span>
              {c.instructor.officeHours}
            </p>
          )}
        </div>
        {c.additionalStaff && c.additionalStaff.length > 0 && (
          <div className="mt-3 space-y-2">
            {c.additionalStaff.map((s, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-3 text-sm">
                <span className="font-semibold text-foreground">{s.role}:</span>{" "}
                {s.name}
                {s.email && (
                  <>
                    {" · "}
                    <a href={`mailto:${s.email}`} className="text-primary hover:underline">
                      {s.email}
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Grading */}
      <Section title="Grading">
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <tbody>
              {c.grading.map((g, i) => (
                <tr
                  key={i}
                  className={i !== c.grading.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-4 py-2 text-foreground">{g.item}</td>
                  <td className="px-4 py-2 text-right font-semibold text-primary">
                    {g.weight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {c.gradingScale && (
          <p className="mt-3 text-xs text-muted">
            <span className="font-semibold text-foreground">Scale: </span>
            {c.gradingScale}
          </p>
        )}
      </Section>

      {/* Key dates */}
      <Section title="Key Dates">
        <ul className="space-y-2">
          {c.keyDates.map((d, i) => (
            <li key={i} className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface p-3">
              <div>
                <div className="font-semibold text-foreground">{d.label}</div>
                {d.detail && <div className="text-xs text-muted">{d.detail}</div>}
              </div>
              <div className="whitespace-nowrap text-sm text-primary">{d.date}</div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Policies */}
      <Section title="Policies">
        <PolicyCard label="Attendance" body={c.attendance} />
        <PolicyCard label="Late Work" body={c.latePolicy} />
        <PolicyCard label="AI Use" body={c.aiPolicy} />
        {c.gradeInquiryPolicy && (
          <PolicyCard label="Grade Inquiries" body={c.gradeInquiryPolicy} />
        )}
      </Section>

      {/* Learning outcomes */}
      <Section title="Learning Outcomes">
        <ul className="ml-5 list-disc space-y-1 text-sm text-muted">
          {c.learningOutcomes.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </Section>

      {/* Textbooks */}
      <Section title="Textbooks & Materials">
        <ul className="ml-5 list-disc space-y-1 text-sm text-muted">
          {c.textbooks.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Section>

      {/* Notes */}
      {c.notes && c.notes.length > 0 && (
        <Section title="Good to Know">
          <ul className="ml-5 list-disc space-y-1 text-sm text-muted">
            {c.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">{title}</h2>
      {children}
    </section>
  );
}

function PolicyCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="mb-2 rounded-2xl border border-border bg-surface p-4">
      <div className="text-xs uppercase tracking-[0.15em] text-primary">
        {label}
      </div>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}
