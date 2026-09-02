import Link from "next/link";
import CalendarView from "@/components/calendar/CalendarView";
import { getConnection, isGoogleConfigured } from "@/lib/google/oauth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Calendar — Selah Study",
  description: "Your exams, deadlines, and club dates in one place.",
};

const ERRORS: Record<string, string> = {
  denied: "You cancelled before Google finished connecting. No harm done — try again whenever.",
  "missing-code": "Google didn't send back an authorisation code. Please try connecting again.",
  "bad-state": "That connection link expired or didn't match. Please start again from this page.",
  "no-refresh-token":
    "Google didn't hand over a lasting permission. Remove Selah Study at myaccount.google.com/permissions, then connect again.",
  "no-calendar-scope":
    "You signed in, but didn't grant calendar access — on Google's permissions " +
    "screen, tick the box for seeing and editing your calendars, then continue. " +
    "Nothing was saved, so just connect again.",
  "save-failed": "Your calendar connected, but saving it failed. Please try again.",
  "exchange-failed": "Google wouldn't complete the connection. Please try again.",
  "not-configured": "Google Calendar isn't set up on this site yet.",
};

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl px-4 py-20 text-center">{children}</div>;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; connected?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Shell>
        <h1 className="text-4xl italic text-foreground sm:text-5xl">
          Sign in to see your calendar
        </h1>
        <p className="mt-4 text-muted">
          Selah Study keeps your dates private to you. Create an account (it&rsquo;s free)
          to connect your Google Calendar.
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
      </Shell>
    );
  }

  if (!isGoogleConfigured()) {
    return (
      <Shell>
        <h1 className="text-4xl italic text-foreground">Almost there</h1>
        <p className="mt-4 text-muted">
          Google Calendar isn&rsquo;t configured yet. Add{" "}
          <code className="rounded bg-surface-hover px-1.5 py-0.5 text-xs text-foreground">
            GOOGLE_CLIENT_ID
          </code>{" "}
          and{" "}
          <code className="rounded bg-surface-hover px-1.5 py-0.5 text-xs text-foreground">
            GOOGLE_CLIENT_SECRET
          </code>{" "}
          to your environment, then reload this page.
        </p>
        <p className="mt-4 text-sm text-muted">
          The steps are written out in{" "}
          <code className="rounded bg-surface-hover px-1.5 py-0.5 text-xs text-foreground">
            GOOGLE_CALENDAR_SETUP.md
          </code>{" "}
          in the project folder.
        </p>
      </Shell>
    );
  }

  const connection = await getConnection();

  if (!connection) {
    return (
      <Shell>
        <h1 className="text-4xl italic text-foreground sm:text-5xl">
          Bring your dates in
        </h1>
        <p className="mt-4 text-muted">
          Connect your Google Calendar and every exam, deadline, and club meeting shows
          up here — with tests and quizzes highlighted so they&rsquo;re hard to miss.
          Anything you add here goes straight back to Google, so it&rsquo;s on your phone too.
        </p>

        {error && (
          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-error/40 bg-error/5 p-4 text-sm text-error">
            {ERRORS[error] ?? "Something went wrong connecting to Google. Please try again."}
          </div>
        )}

        <a
          href="/api/google/connect"
          className="mt-8 inline-block rounded-full gradient-primary px-6 py-3 text-sm text-white shadow-md hover:scale-105"
        >
          Connect Google Calendar
        </a>

        <p className="mt-6 text-xs text-muted">
          Selah Study only ever touches your calendar. You can disconnect any time,
          here or at myaccount.google.com/permissions.
        </p>
      </Shell>
    );
  }

  return <CalendarView googleEmail={connection.googleEmail} />;
}
