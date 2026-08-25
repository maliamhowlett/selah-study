import Link from "next/link";
import { fetchUserClasses, isAuthenticated } from "@/lib/db/classes";

export const metadata = {
  title: "Classes — Selah Study",
  description: "Your classes at a glance.",
};

export default async function ClassesPage() {
  const signedIn = await isAuthenticated();

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-4xl italic text-foreground sm:text-5xl">
          Sign in to see your classes
        </h1>
        <p className="mt-4 text-muted">
          Selah Study keeps your classes, syllabi, and notes private to you.
          Create an account (it's free) to get started.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-full gradient-primary px-6 py-3 text-sm text-white shadow-md hover:scale-105"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-primary px-6 py-3 text-sm text-primary hover:bg-primary-light"
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
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-muted">
            Your semester
          </p>
          <h1 className="text-5xl italic text-foreground sm:text-6xl">
            my classes
          </h1>
        </div>
        <Link
          href="/classes/new"
          className="rounded-full gradient-primary px-5 py-2.5 text-sm text-white shadow-md hover:scale-105"
        >
          + Add class
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-10 text-center">
          <h2 className="text-2xl italic text-foreground">
            No classes yet
          </h2>
          <p className="mt-3 text-muted">
            Add your first class to keep your syllabus, readings, and lecture
            recordings organized.
          </p>
          <Link
            href="/classes/new"
            className="mt-6 inline-block rounded-full gradient-primary px-6 py-3 text-sm text-white shadow-md hover:scale-105"
          >
            Add your first class
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {classes.map((c) => (
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
                    <span className="text-foreground">{m.days}</span>
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
      )}
    </div>
  );
}
