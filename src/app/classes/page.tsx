import Link from "next/link";
import { CLASSES } from "@/lib/classes";

export const metadata = {
  title: "Classes — Selah Study",
  description: "Your Purdue Fall 2026 classes at a glance.",
};

export default function ClassesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-muted">
          Fall 2026
        </p>
        <h1 className="text-5xl italic text-foreground sm:text-6xl">
          my classes
        </h1>
        <p className="mt-4 text-base text-muted">
          Tap a class for the syllabus summary, grading breakdown, exam dates, and policies.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {CLASSES.map((c) => (
          <Link
            key={c.slug}
            href={`/classes/${c.slug}`}
            className="group rounded-3xl border border-border bg-surface p-7 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${c.color}`}
            >
              {c.courseCode}
            </div>
            <h2 className="text-xl text-foreground">{c.title}</h2>
            <p className="mt-1 text-sm text-muted">{c.department}</p>
            <div className="mt-4 space-y-1 text-sm text-muted">
              {c.meetingTimes.map((m, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">{m.days}</span>
                  <span>· {m.time}</span>
                  <span>· {m.location}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-primary group-hover:underline">
              View syllabus summary →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
