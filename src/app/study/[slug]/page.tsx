import Link from "next/link";
import { notFound } from "next/navigation";
import { CLASSES } from "@/lib/classes";
import { COURSE_STYLES, detectCourse } from "@/lib/calendar/courses";
import { COURSE_STUDY, campusToday, campusWeekday, daysUntil } from "@/lib/study/plans";
import { ACCT_MOCK_EXAM } from "@/lib/study/acct-exam";
import DayPlan from "@/components/study/DayPlan";
import DrillRunner from "@/components/study/DrillRunner";
import MockExam from "@/components/study/MockExam";
import PracticeProblems from "@/components/study/PracticeProblems";
import StudyModes, { type StudyMode } from "@/components/study/StudyModes";

export function generateStaticParams() {
  return CLASSES.map((cls) => ({ slug: cls.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cls = CLASSES.find((c) => c.slug === slug);
  return {
    title: cls ? `${cls.courseCode} study — Selah Study` : "Study — Selah Study",
  };
}

const labelClass = "mb-3 text-[10px] uppercase tracking-[0.2em] text-muted";

export default async function CourseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cls = CLASSES.find((c) => c.slug === slug);
  const study = COURSE_STUDY[slug];
  if (!cls || !study) notFound();

  const course = COURSE_STYLES[detectCourse(cls.courseCode, cls.title)];
  const plan = study.examPlan;
  const today = campusToday();
  const away = plan ? daysUntil(plan.date, today) : null;
  const weekday = campusWeekday();
  // The drill bank and the practice exam are ACCT-specific so far.
  const hasDrills = slug === "acct-20000";
  const blueprintFor = (chapter: string) =>
    plan?.blueprint?.find((b) => b.chapter === chapter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/study"
        className="mb-8 inline-block text-sm text-muted hover:text-foreground"
      >
        ← All classes
      </Link>

      <header className="mb-12">
        <div className={`mb-5 h-1 w-14 rounded-full ${course.accent}`} />
        <h1 className={`text-5xl italic sm:text-6xl ${course.text}`}>
          {cls.courseCode}
        </h1>
        <p className="mt-2 text-lg text-muted">{cls.title}</p>
        <p className="mt-5 max-w-2xl leading-relaxed text-muted">{study.approach}</p>
      </header>

      {plan && away !== null && (
        <>
          {/* The countdown is the reason this page gets opened, so it leads. */}
          <section
            className={`mb-12 rounded-3xl border p-6 sm:p-8 ${course.border} ${course.tint}`}
          >
            <p className={`text-xs uppercase tracking-[0.2em] ${course.text} opacity-80`}>
              {plan.label} · {plan.weight}
            </p>
            <p className={`mt-2 text-4xl italic sm:text-5xl ${course.text}`}>
              {away < 0
                ? "has passed"
                : away === 0
                  ? "is today"
                  : `${away} day${away === 1 ? "" : "s"} away`}
            </p>
            <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted">When</dt>
                <dd className="text-foreground">{plan.when}</dd>
              </div>
              <div>
                <dt className="text-muted">Where</dt>
                <dd className="text-foreground">{plan.where}</dd>
              </div>
              <div>
                <dt className="text-muted">Covers</dt>
                <dd className="text-foreground">{plan.covers}</dd>
              </div>
            </dl>
          </section>

          <section className="mb-14">
            <h2 className="mb-4 text-3xl italic text-foreground">Where you stand</h2>
            <div className="flex flex-col gap-3">
              {plan.situation.map((line) => (
                <p key={line.slice(0, 32)} className="max-w-2xl leading-relaxed text-muted">
                  {line}
                </p>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <StudyModes
              accentText={course.text}
              accentBorder={course.border}
              accentTint={course.tint}
              modes={
                [
                  plan.triage && {
                    id: "triage",
                    label: "Short on time",
                    blurb:
                      "Ranked by marks per minute, highest first. Work down the list and stop when you run out of time — whatever you reach will be the most valuable thing left.",
                    content: (
                      <div className="flex flex-col gap-3">
                        <p className="max-w-2xl rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-foreground">
                          Everything here together is{" "}
                          <span className={`font-semibold ${course.text}`}>
                            {plan.triage.reduce((n, t) => n + t.marks, 0)} of the 40 marks
                          </span>{" "}
                          in about{" "}
                          {Math.round(
                            (plan.triage.reduce((n, t) => n + t.minutes, 0) / 60) * 10,
                          ) / 10}{" "}
                          hours. None of it needs a journal entry, and most of it needs no
                          calculation at all.
                        </p>

                        {plan.triage.map((item, i) => (
                          <article
                            key={item.what}
                            className="flex gap-4 rounded-2xl border border-border bg-surface p-4"
                          >
                            <span className="mt-0.5 w-6 shrink-0 text-sm tabular-nums text-muted">
                              {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-foreground">{item.what}</p>
                              <p className="mt-1 text-sm leading-relaxed text-muted">
                                {item.why}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className={`text-lg tabular-nums ${course.text}`}>
                                {item.marks}
                              </p>
                              <p className="text-[10px] uppercase tracking-wider text-muted">
                                {item.marks === 1 ? "mark" : "marks"}
                              </p>
                              <p className="mt-1 text-xs tabular-nums text-muted">
                                {item.minutes}m
                              </p>
                            </div>
                          </article>
                        ))}

                        <p className="max-w-2xl text-sm leading-relaxed text-muted">
                          What is deliberately not on this list: the FIFO and LIFO
                          computations, the allowance and aging calculations, the
                          multi-step income statement, and recording purchases and sales.
                          Those are the remaining 15 marks and they cost far more time
                          each. Get to them only once the list above is solid.
                        </p>
                      </div>
                    ),
                  },
                  {
                    id: "plan",
                    label: "The plan",
                    blurb: "What to do on which day. Tick things off — it saves in this browser.",
                    content: (
                      <DayPlan
                        days={plan.days}
                        slug={slug}
                        today={today}
                        accentText={course.text}
                        accentBorder={course.border}
                        accentTint={course.tint}
                      />
                    ),
                  },
                  hasDrills && {
                    id: "drill",
                    label: "Drill",
                    blurb:
                      "Three kinds, all marked for you. Journal entries: type it and get told exactly what's wrong — wrong side, wrong amount, missing line. Where does it go: which statement and which normal balance. Statement figures: compute one subtotal from a list of accounts, which is how the exam asks it rather than making you build the whole statement. Only your first attempt counts.",
                    content: (
                      <DrillRunner
                        accentText={course.text}
                        accentBorder={course.border}
                        accentTint={course.tint}
                      />
                    ),
                  },
                  {
                    id: "problems",
                    label: "Problems",
                    blurb:
                      "Longer, multi-step questions of the kind that carry the most marks. Work each on paper first.",
                    content: (
                      <PracticeProblems problems={plan.problems} accentText={course.text} />
                    ),
                  },
                  hasDrills && {
                    id: "exam",
                    label: "Practice exam",
                    blurb:
                      "The real thing, timed, with the answers held back until you finish.",
                    content: (
                      <MockExam
                        exam={ACCT_MOCK_EXAM}
                        accentText={course.text}
                        accentBorder={course.border}
                        accentTint={course.tint}
                      />
                    ),
                  },
                ].filter(Boolean) as StudyMode[]
              }
            />
          </section>

          <section className="mb-14">
            <h2 className="mb-6 text-3xl italic text-foreground">What&apos;s on it</h2>
            <div className="flex flex-col gap-5">
              {plan.topics.map((topic) => (
                <article
                  key={topic.chapter}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg text-foreground">
                      <span className={course.text}>{topic.chapter}</span> {topic.title}
                    </h3>
                    {blueprintFor(topic.chapter) && (
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${course.border} ${course.text}`}
                      >
                        {blueprintFor(topic.chapter)!.rows.reduce(
                          (n, r) => n + r.questions,
                          0,
                        )}{" "}
                        questions
                      </span>
                    )}
                  </div>
                  <p className="mb-4 text-sm text-muted">{topic.because}</p>

                  {blueprintFor(topic.chapter) && (
                    <>
                      <p className={labelClass}>
                        What Dr. Bokrand says is on it
                      </p>
                      <div className="mb-4 overflow-x-auto">
                        <table className="w-full text-sm">
                          <tbody>
                            {blueprintFor(topic.chapter)!.rows.map((row) => (
                              <tr
                                key={row.topic}
                                className="border-b border-border/50 last:border-0"
                              >
                                <td className="py-2 pr-3 align-baseline">
                                  <span className="text-foreground">{row.topic}</span>
                                  {row.gap && (
                                    <span className="mt-1 block border-l-2 border-exam bg-exam-light px-3 py-1.5 text-xs leading-relaxed">
                                      {row.gap}
                                    </span>
                                  )}
                                </td>
                                <td className="w-10 py-2 text-right align-baseline tabular-nums text-muted">
                                  {row.questions}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  <p className={labelClass}>Must know</p>
                  <ul className="mb-4 flex flex-col gap-1.5">
                    {topic.mustKnow.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-foreground">
                        <span aria-hidden="true" className="text-muted">
                          ·
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className={labelClass}>Easy to get wrong</p>
                  <ul className="flex flex-col gap-2">
                    {topic.traps.map((trap) => (
                      <li
                        key={trap.slice(0, 32)}
                        className="border-l-2 border-exam bg-exam-light px-3.5 py-2 text-sm leading-relaxed text-foreground"
                      >
                        {trap}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="border-t border-border pt-10">
        <h2 className="mb-2 text-3xl italic text-foreground">Where to get help</h2>
        <p className="mb-6 max-w-2xl text-sm text-muted">
          All of this is free and already paid for by your tuition.
        </p>
        <div className="flex flex-col gap-3">
          {study.help.map((source) => {
            const availableToday = source.days?.includes(weekday) ?? false;
            return (
              <div
                key={source.label}
                className={`rounded-2xl border p-4 ${
                  availableToday ? `${course.border} ${course.tint}` : "border-border bg-surface"
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p
                    className={`font-medium ${availableToday ? course.text : "text-foreground"}`}
                  >
                    {source.label}
                  </p>
                  {availableToday && (
                    <span
                      className={`rounded-full border border-current px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${course.text}`}
                    >
                      Today
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{source.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-10 text-xs text-muted">
        Everything here is built from your syllabus.{" "}
        <Link href="/syllabus" className="underline underline-offset-4 hover:text-foreground">
          See the full grade breakdown
        </Link>
        .
      </p>
    </div>
  );
}
