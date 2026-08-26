import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import {
  OAUTH_STATE_COOKIE,
  buildAuthUrl,
  getRedirectUri,
  isGoogleConfigured,
} from "@/lib/google/oauth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isGoogleConfigured()) {
    return NextResponse.redirect(
      new URL("/calendar?error=not-configured", request.url),
    );
  }

  // Random state, echoed back by Google and checked in the callback so another
  // site can't walk someone through connecting a calendar they didn't mean to.
  const state = randomUUID();
  const response = NextResponse.redirect(
    buildAuthUrl(getRedirectUri(request), state),
  );

  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
