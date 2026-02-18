import Link from "next/link";
import BibleVerse from "@/components/BibleVerse";

const quickCards = [
  {
    href: "/record",
    title: "Record",
    description: "Record a lecture and get a live transcription",
    color: "from-purple-500 to-pink-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
      </svg>
    ),
  },
  {
    href: "/notes",
    title: "Notes",
    description: "View and edit your saved transcriptions",
    color: "from-amber-500 to-orange-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
        <path d="M8 12h8v2H8zm0 4h8v2H8z" />
      </svg>
    ),
  },
  {
    href: "/study",
    title: "Study",
    description: "Review flashcards and master key concepts",
    color: "from-emerald-500 to-teal-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z" />
        <path d="M12 7l-1.41 1.41L13.17 11H7v2h6.17l-2.58 2.59L12 17l5-5-5-5z" />
      </svg>
    ),
  },
  {
    href: "/bible",
    title: "Bible",
    description: "Read Scripture, look up verses, and follow reading plans",
    color: "from-blue-500 to-indigo-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6zm0 2h12v16H6V4zm2 3v2h8V7H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <div className="mb-16 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
          Pause &middot; Reflect &middot; Learn
        </p>
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          Welcome to{" "}
          <span className="gradient-text">Selah Study</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Your all-in-one study companion. Record lectures, study Scripture,
          create flashcards, and grow in understanding — all for free.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/record"
            className="gradient-primary rounded-full px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105"
          >
            Start Recording
          </Link>
          <Link
            href="/bible"
            className="rounded-full border-2 border-primary px-8 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary-light"
          >
            Open Bible
          </Link>
        </div>
      </div>

      {/* Daily Verse */}
      <div className="mb-16">
        <BibleVerse />
      </div>

      {/* Quick-access cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${card.color} p-3 text-white transition-transform group-hover:scale-110`}>
              {card.icon}
            </div>
            <h2 className="text-lg font-bold text-foreground">{card.title}</h2>
            <p className="mt-1 text-sm text-muted">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
