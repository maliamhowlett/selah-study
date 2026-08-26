import { detectCategory, isCategory, CATEGORY_STYLES } from "@/lib/calendar/categories";
import type { CalendarEvent, EventInput } from "@/lib/calendar/types";
import { getAccessToken } from "./oauth";

const API_BASE = "https://www.googleapis.com/calendar/v3";

/** Key under extendedProperties.private where the chosen category is stored. */
const CATEGORY_KEY = "selahCategory";

export class GoogleCalendarError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GoogleCalendarError";
  }
}

type GoogleDate = { date?: string; dateTime?: string; timeZone?: string };

type GoogleEvent = {
  id: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: GoogleDate;
  end?: GoogleDate;
  htmlLink?: string;
  extendedProperties?: { private?: Record<string, string> };
};

/** Google's all-day `end.date` is exclusive; the site treats it as inclusive. */
function shiftDate(dateString: string, days: number): string {
  const [y, m, d] = dateString.split("-").map(Number);
  const shifted = new Date(Date.UTC(y, m - 1, d + days));
  return shifted.toISOString().slice(0, 10);
}

function toCalendarEvent(raw: GoogleEvent): CalendarEvent | null {
  const startValue = raw.start?.dateTime ?? raw.start?.date;
  if (!startValue) return null; // Events with no start can't be placed on a grid.

  const allDay = Boolean(raw.start?.date && !raw.start?.dateTime);
  const rawEnd = raw.end?.dateTime ?? raw.end?.date ?? startValue;
  const end = allDay ? shiftDate(rawEnd, -1) : rawEnd;

  const title = raw.summary?.trim() || "(no title)";
  const stored = raw.extendedProperties?.private?.[CATEGORY_KEY];
  const manual = isCategory(stored);

  return {
    id: raw.id,
    title,
    description: raw.description,
    location: raw.location,
    start: startValue,
    end,
    allDay,
    category: manual ? stored : detectCategory(title, raw.description),
    categorySource: manual ? "manual" : "detected",
    htmlLink: raw.htmlLink,
  };
}

function toGoogleEvent(input: EventInput): Record<string, unknown> {
  const start: GoogleDate = input.allDay
    ? { date: input.start.slice(0, 10) }
    : { dateTime: new Date(input.start).toISOString() };

  const end: GoogleDate = input.allDay
    ? { date: shiftDate(input.end.slice(0, 10), 1) }
    : { dateTime: new Date(input.end).toISOString() };

  return {
    summary: input.title,
    description: input.description || undefined,
    location: input.location || undefined,
    start,
    end,
    colorId: CATEGORY_STYLES[input.category].googleColorId,
    extendedProperties: { private: { [CATEGORY_KEY]: input.category } },
  };
}

async function callGoogle(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const auth = await getAccessToken();
  if (!auth) throw new GoogleCalendarError("Google Calendar is not connected.", 401);

  const url = path.replace("{calendarId}", encodeURIComponent(auth.calendarId));
  const res = await fetch(`${API_BASE}${url}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 401 || res.status === 403) {
      throw new GoogleCalendarError(
        "Google rejected the request — try reconnecting your calendar.",
        res.status,
      );
    }
    throw new GoogleCalendarError(
      `Google Calendar request failed (${res.status}): ${detail.slice(0, 300)}`,
      res.status,
    );
  }
  return res;
}

export async function listEvents(
  timeMin: string,
  timeMax: string,
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    // Expands recurring events into individual instances so each lecture or
    // weekly club meeting lands on its own day in the grid.
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "2500",
  });

  const res = await callGoogle(`/calendars/{calendarId}/events?${params.toString()}`);
  const data = (await res.json()) as { items?: GoogleEvent[] };

  return (data.items ?? [])
    .filter((item) => item.status !== "cancelled")
    .map(toCalendarEvent)
    .filter((event): event is CalendarEvent => event !== null);
}

export async function createEvent(input: EventInput): Promise<CalendarEvent> {
  const res = await callGoogle("/calendars/{calendarId}/events", {
    method: "POST",
    body: JSON.stringify(toGoogleEvent(input)),
  });
  const event = toCalendarEvent((await res.json()) as GoogleEvent);
  if (!event) throw new GoogleCalendarError("Google returned an unreadable event.", 502);
  return event;
}

export async function updateEvent(
  eventId: string,
  input: EventInput,
): Promise<CalendarEvent> {
  const res = await callGoogle(
    `/calendars/{calendarId}/events/${encodeURIComponent(eventId)}`,
    { method: "PATCH", body: JSON.stringify(toGoogleEvent(input)) },
  );
  const event = toCalendarEvent((await res.json()) as GoogleEvent);
  if (!event) throw new GoogleCalendarError("Google returned an unreadable event.", 502);
  return event;
}

export async function deleteEvent(eventId: string): Promise<void> {
  await callGoogle(`/calendars/{calendarId}/events/${encodeURIComponent(eventId)}`, {
    method: "DELETE",
  });
}
