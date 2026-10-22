import Link from "next/link";
import { CLASSES } from "@/lib/classes";
import { COURSE_STYLES, detectCourse } from "@/lib/calendar/courses";
import { COURSE_STUDY, daysUntil } from "@/lib/study/plans";
import StudyDecks from "@/components/study/StudyDecks";

export const metadata = {
  title: "Study — Selah Study",
  description: "A study space for each of your classes.",
};

function CourseCard({ slug }: { slug: string }) {
  const cls = CLASSES.find((c) => c.slug === slug);
  const study = COURSE_STUDY[slug];
  if (!cls || !study) return null;

  const course = COURSE_STYLES[detectCourse(cls.courseCode, cls.title)];
  const plan = study.examPlan;
  const away = plan ? daysUntil(plan.date) : null;

  // An exam inside a fortnight is the thing you came to the page for, so it
  // outranks the course description.
  const soon = away !== null && away >= 0 && away <= 14;

  return (
    <Link
      href={`/study/${slug}`}
      className={`group flex flex-col gap-3 rounded-2xl border p-5 transition-all hover:shadow-md ${
        soon ? `${course.border} ${course.tint}` : "border-border bg-surface hover:border-border"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${course.accent}`} />
        <div className="min-w-0 flex-1">
          <p className={`text-lg ${soon ? course.text : "text-foreground"}`}>
            {cls.courseCode}
          </p>
          <p className="truncate text-sm text-muted">{cls.title}</p>
        </div>
      </div>

      {soon && plan ? (
        <p className={`text-sm font-semibold ${course.text}`}>
          {plan.label} in {away === 0 ? "today" : away === 1 ? "1 day" : `${away} days`}
          <span className="block text-xs font-normal opacity-80">
            {plan.when} · {plan.covers}
          </span>
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-muted">{study.approach}</p>
      )}
    </Link>
  );
}

export default function StudyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-muted">
          One space per class
        </p>
        <h1 className="text-5xl italic text-foreground sm:text-6xl">study</h1>
        <p className="mt-5 max-w-2xl leading-relaxed text-muted">
          Pick a class to see how it&apos;s assessed, where to get help, and — when
          there&apos;s an exam close — a plan for the days you have left.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CLASSES.map((cls) => (
          <CourseCard key={cls.slug} slug={cls.slug} />
        ))}
      </div>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="mb-6 text-3xl italic text-foreground">Flashcards</h2>
        <StudyDecks />
      </section>
    </div>
  );
}
