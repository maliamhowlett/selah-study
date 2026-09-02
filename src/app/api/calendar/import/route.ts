import { NextResponse, type NextRequest } from "next/server";
import { proposalsForClass } from "@/lib/calendar/import";
import type { DateProposal } from "@/lib/calendar/import";
import { scheduleGroups } from "@/lib/calendar/schedule";
import type { ScheduledItem } from "@/lib/calendar/schedule";
import { parseEventInput } from "@/lib/calendar/validate";
import { fetchUserClasses } from "@/lib/db/classes";
import { GoogleCalendarError, createEvent } from "@/lib/google/calendar";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const RRULE_ORDER = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

/** The one-line "when" shown on the row: a repeat pattern, a single date, or a
 * prompt when the syllabus never gave one. */
function describe(item: ScheduledItem): string {
  if (item.repeat) {
    const days = item.repeat.days
      .map((day) => WEEKDAY_NAMES[RRULE_ORDER.indexOf(day)])
      .join(", ");
    return `Every ${days} until ${item.repeat.untilDay}`;
  }
  if (!item.day) return "No date given — add one";

  const [y, m, d] = item.day.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Renders a hand-transcribed item as the same row shape the parsed key dates
 * use, so the panel has only one kind of row to draw. */
function toProposal(item: ScheduledItem, courseCode: string): DateProposal {
  const when = describe(item);

  return {
    key: item.key,
    courseCode,
    label: item.title,
    raw: item.location ? `${when} · ${item.location}` : when,
    title: item.title,
    category: item.category,
    course: item.course,
    repeat: item.repeat,
    location: item.location,
    description: item.description,
    day: item.day,
    startTime: item.startTime,
    endTime: item.endTime,
    note: item.note,
  };
}

/** The dates we could pull out of the user's syllabi, warnings and all. */
export async function GET() {
  if (!(await requireUser())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const classes = await fetchUserClasses();
  const groups = classes
    .map((cls) => ({
      courseCode: cls.courseCode,
      title: cls.title,
      proposals: proposalsForClass(
        cls.courseCode,
        cls.keyDates ?? [],
        new Date(),
        cls.meetingTimes,
      ),
    }))
    .filter((group) => group.proposals.length > 0);

  // Hand-transcribed extras (weekly deadlines, SI timetables) sit after the
  // parsed key dates so the automatic ones stay at the top.
  const extras = scheduleGroups().map((group) => ({
    courseCode: group.courseCode,
    title: group.title,
    blurb: group.blurb,
    proposals: group.items.map((item) => toProposal(item, group.courseCode)),
  }));

  return NextResponse.json({ groups: [...groups, ...extras] });
}

/** Creates the subset the user ticked. Partial failures are reported, not fatal. */
export async function POST(request: NextRequest) {
  if (!(await requireUser())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Missing events." }, { status: 400 });
  }

  const rawEvents = (body as { events?: unknown })?.events;
  if (!Array.isArray(rawEvents) || rawEvents.length === 0) {
    return NextResponse.json({ error: "Pick at least one date to import." }, { status: 400 });
  }
  if (rawEvents.length > 100) {
    return NextResponse.json({ error: "That's too many at once." }, { status: 400 });
  }

  const created: string[] = [];
  const failed: { title: string; reason: string }[] = [];

  // Sequential on purpose: a burst of parallel writes trips Google's per-user
  // rate limit, and this runs once a semester.
  for (const raw of rawEvents) {
    const parsed = parseEventInput(raw);
    const title =
      typeof (raw as { title?: unknown })?.title === "string"
        ? (raw as { title: string }).title
        : "Untitled";

    if ("error" in parsed) {
      failed.push({ title, reason: parsed.error });
      continue;
    }

    try {
      const event = await createEvent(parsed.input);
      created.push(event.title);
    } catch (err) {
      if (err instanceof GoogleCalendarError && err.status === 401) {
        return NextResponse.json(
          { error: err.message, needsReconnect: true, created, failed },
          { status: 401 },
        );
      }
      failed.push({
        title,
        reason: err instanceof GoogleCalendarError ? err.message : "Google rejected it.",
      });
    }
  }

  return NextResponse.json({ created, failed });
}
