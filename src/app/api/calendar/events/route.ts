import { NextResponse, type NextRequest } from "next/server";
import { parseEventInput } from "@/lib/calendar/validate";
import {
  GoogleCalendarError,
  createEvent,
  listEvents,
} from "@/lib/google/calendar";

function errorResponse(err: unknown) {
  if (err instanceof GoogleCalendarError) {
    console.error("Google Calendar error:", err.message);
    return NextResponse.json(
      { error: err.message, needsReconnect: err.status === 401 || err.status === 403 },
      { status: err.status === 401 ? 401 : 502 },
    );
  }
  console.error("Calendar route error:", err);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const timeMin = url.searchParams.get("timeMin");
  const timeMax = url.searchParams.get("timeMax");

  if (!timeMin || !timeMax) {
    return NextResponse.json({ error: "Missing time range." }, { status: 400 });
  }

  try {
    return NextResponse.json({ events: await listEvents(timeMin, timeMax) });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Missing event details." }, { status: 400 });
  }

  const parsed = parseEventInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    return NextResponse.json({ event: await createEvent(parsed.input) });
  } catch (err) {
    return errorResponse(err);
  }
}
