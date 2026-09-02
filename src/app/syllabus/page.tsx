import Link from "next/link";
import { detectCategory } from "@/lib/calendar/categories";
import { COURSE_STYLES, detectCourse } from "@/lib/calendar/courses";
import { fetchUserClasses, isAuthenticated } from "@/lib/db/classes";
import { OUTSTANDING, SYLLABUS_NOTES } from "@/lib/syllabus-notes";
import type { ClassInfo } from "@/lib/classes";

export const metadata = {
  title: "Syllabus sheet — Selah Study",
  description:
    "Instructor contact, office hours, and every graded item with its percentage, across all your classes.",
};

const labelClass = "mb-2 text-[10px] uppercase tracking-[0.2em] text-muted";

/** Weights are written as "20%" or "390 pts". Only the percentage kind can be
 * summed, so a points-based course gets its own total line instead. */
function weightTotal(grading: ClassInfo["grading"]): string | null {
  const numbers = grading.map((row) => Number(row.weight.replace(/[^0-9.]/g, "")));
  if (numbers.some((n) => Number.isNaN(n))) return null;

  const sum = numbers.reduce((a, b) => a + b, 0);
  const points = grading.every((row) => /pts?/i.test(row.weight));
  return points ? `${sum.toLocaleString()} pts` : `${sum}%`;
}

/**
 * Reduces a label to the part that names the thing, dropping the qualifiers
 * that differ between a grade table and a schedule: "Exam 3 — Module 3 (Ch.
 * 8–12)" and "Exam 3 (Ch. 8–12, comprehensive review)" both become "exam 3".
 */
function nameKey(label: string): string {
  return label.toLowerCase().split(/\s+—\s+| \(/)[0].trim();
}

/**
 * The date for a graded item, when a key date refers to the same thing. Matching
 * is on the name alone and has to survive one name sitting inside the other —
 * MA 161 calls it "Midterm Exam 1" in the grade table and "Exam 1" in its key
 * dates. It stops short of fuzzy matching: a page being copied onto a graded
 * handout should show no date rather than a guessed one.
 */
function dateFor(item: string, keyDates: ClassInfo["keyDates"]): string | null {
  const needle = nameKey(item);
  if (!needle) return null;

  // A row covering several things ("Student Interview + Career Interview") has
  // several dates, and showing only the first would be worse than showing none.
  if (needle.includes("+") || /^\d+\s/.test(needle)) return null;

  const match = keyDates.find((kd) => {
    const label = nameKey(kd.label);
    if (!label) return false;
    const [long, short] = needle.length >= label.length ? [needle, label] : [label, needle];
    // Whole-word containment, so "exam 1" can't be found inside "exam 10".
    return new RegExp(`(^|\\s)${short.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|\\s)`).test(long);
  });

  if (!match) return null;
  return match.detail ? `${match.date} · ${match.detail}` : match.date;
}

function Caution({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-l-2 border-assignment bg-assignment-light px-3.5 py-2.5 text-xs leading-relaxed text-foreground">
      {children}
    </p>
  );
}

function Course({ cls, slug }: { cls: ClassInfo; slug: string }) {
  const course = COURSE_STYLES[detectCourse(cls.courseCode, cls.title)];
  const total = weightTotal(cls.grading);
  const note = SYLLABUS_NOTES[slug];

  return (
    <section className="flex flex-col gap-5">
      <div className={`h-1 w-14 rounded-full ${course.accent}`} />

      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-3">
        <h2 className={`text-3xl italic ${course.text}`}>
          {cls.courseCode}
        </h2>
        <p className="text-sm text-muted">{cls.title}</p>
        <p className="ml-auto text-xs uppercase tracking-[0.15em] text-muted">
          {cls.credits} credits
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.35fr]">
        <div className="flex flex-col gap-7">
          <div>
            <p className={labelClass}>Instructor contact</p>
            <p className="font-medium text-foreground">{cls.instructor.name}</p>
            <a
              href={`mailto:${cls.instructor.email}`}
              className="text-sm text-foreground underline decoration-border underline-offset-4 hover:decoration-current"
            >
              {cls.instructor.email}
            </a>
            {cls.instructor.phone && (
              <p className="text-sm text-foreground">{cls.instructor.phone}</p>
            )}

            {cls.additionalStaff?.map((person) => (
              <p key={person.name} className="mt-1.5 text-sm text-foreground">
                <span className="text-muted">{person.role} </span>
                {person.name}
                {person.email && (
                  <>
                    {" · "}
                    <a
                      href={`mailto:${person.email}`}
                      className="underline decoration-border underline-offset-4 hover:decoration-current"
                    >
                      {person.email}
                    </a>
                  </>
                )}
              </p>
            ))}
          </div>

          <div>
            <p className={labelClass}>Office hours &amp; location</p>
            <p className="text-sm text-foreground">
              {cls.instructor.officeHours ?? "Not listed in the syllabus."}
            </p>
            {cls.instructor.office ? (
              <p className="mt-1 text-sm text-foreground">
                Office: <span className="font-medium">{cls.instructor.office}</span>
              </p>
            ) : (
              <div className="mt-2">
                <Caution>
                  No office room anywhere in this syllabus — consultation hours
                  only. Ask in class or check Brightspace.
                </Caution>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className={labelClass}>Major assignments &amp; exams</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-muted">
                    Item
                  </th>
                  <th className="pb-2 pl-4 text-right text-[10px] font-medium uppercase tracking-[0.15em] text-muted">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody>
                {cls.grading.map((row) => {
                  // An exam is the one row type the handout names, so it gets
                  // the course colour — the same rule the calendar uses.
                  const isExam = detectCategory(row.item) === "exam";
                  const when = dateFor(row.item, cls.keyDates ?? []);
                  return (
                    <tr key={row.item} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5 align-baseline">
                        <span className={isExam ? `font-semibold ${course.text}` : ""}>
                          {row.item}
                        </span>
                        {when && (
                          <span className="block text-xs text-muted">{when}</span>
                        )}
                      </td>
                      <td className="py-2.5 pl-4 text-right align-baseline font-semibold tabular-nums">
                        {row.weight}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {total && (
                <tfoot>
                  <tr className="border-t border-border">
                    <td className="pt-2.5 text-[10px] uppercase tracking-[0.15em] text-muted">
                      Total
                    </td>
                    <td className="pt-2.5 pl-4 text-right text-[10px] uppercase tracking-[0.15em] tabular-nums text-muted">
                      {total}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {note?.caution && (
            <div className="mt-4">
              <Caution>{note.caution}</Caution>
            </div>
          )}
          {note?.aside && (
            <p className="mt-4 border-l-2 border-border px-3.5 py-2.5 text-xs leading-relaxed text-muted">
              {note.aside}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function SyllabusPage() {
  if (!(await isAuthenticated())) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-4xl italic text-foreground sm:text-5xl">
          Sign in to see your syllabus sheet
        </h1>
        <p className="mt-4 text-muted">
          Everything from your syllabi in one place — contacts, office hours,
          and what each assignment is worth.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-full gradient-primary px-6 py-3 text-sm text-white shadow-md hover:scale-105"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const classes = await fetchUserClasses();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-14">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-muted">
          Organize your syllabi
        </p>
        <h1 className="text-5xl italic text-foreground sm:text-6xl">
          syllabus sheet
        </h1>
        <p className="mt-5 max-w-2xl leading-relaxed text-muted">
          Instructor contact, office hours and location, and every graded item
          with the percentage it carries. Each course&apos;s weights are added
          up for you, so a total that doesn&apos;t reach 100 means something is
          missing. Amber notes mark what a syllabus never says.
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-10 text-center">
          <h2 className="text-2xl italic text-foreground">
            No classes yet
          </h2>
          <p className="mt-3 text-muted">
            Add a class and its syllabus details will show up here.
          </p>
          <Link
            href="/classes"
            className="mt-6 inline-block rounded-full gradient-primary px-6 py-3 text-sm text-white shadow-md hover:scale-105"
          >
            Go to classes
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-16">
            {classes.map((cls) => (
              <Course key={cls.id} cls={cls} slug={cls.slug} />
            ))}
          </div>

          <section className="mt-16 border-t border-border pt-10">
            <h2 className="text-3xl italic text-foreground">Still missing</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {OUTSTANDING.map((item) => (
                <li key={item.title} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                  <span>
                    <span className="font-semibold text-foreground">{item.title}.</span>{" "}
                    <span className="text-muted">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs text-muted">
              Built from your class records, so this page updates whenever you
              correct one. Your dates live in{" "}
              <Link href="/calendar" className="underline underline-offset-4 hover:text-foreground">
                the calendar
              </Link>
              .
            </p>
          </section>
        </>
      )}
    </div>
  );
}
