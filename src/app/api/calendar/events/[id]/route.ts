import { NextResponse, type NextRequest } from "next/server";
import { parseEventInput } from "@/lib/calendar/validate";
import {
  GoogleCalendarError,
  deleteEvent,
  updateEvent,
} from "@/lib/google/calendar";

type Context = { params: Promise<{ id: string }> };

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

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;

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
    return NextResponse.json({ event: await updateEvent(id, parsed.input) });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    await deleteEvent(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
