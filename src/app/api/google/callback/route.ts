import { NextResponse, type NextRequest } from "next/server";
import {
  OAUTH_STATE_COOKIE,
  emailFromIdToken,
  exchangeCodeForTokens,
  getRedirectUri,
  grantsCalendarAccess,
  saveConnection,
} from "@/lib/google/oauth";

function back(request: NextRequest, params: string) {
  const response = NextResponse.redirect(new URL(`/calendar${params}`, request.url));
  response.cookies.delete(OAUTH_STATE_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const denied = url.searchParams.get("error");

  if (denied) return back(request, "?error=denied");
  if (!code) return back(request, "?error=missing-code");

  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (!expectedState || expectedState !== state) {
    return back(request, "?error=bad-state");
  }

  try {
    const tokens = await exchangeCodeForTokens(code, getRedirectUri(request));

    // Google only returns a refresh token on a fresh consent. If it's missing,
    // the previous grant is still live on Google's side but useless to us, so
    // the user has to revoke and reconnect.
    if (!tokens.refresh_token) {
      return back(request, "?error=no-refresh-token");
    }

    // Nothing is saved unless calendar access was actually granted — storing a
    // sign-in-only token would look connected and fail on every request.
    if (!grantsCalendarAccess(tokens.scope)) {
      return back(request, "?error=no-calendar-scope");
    }

    const { error } = await saveConnection({
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      expiresIn: tokens.expires_in,
      googleEmail: emailFromIdToken(tokens.id_token),
    });

    if (error) {
      console.error("Failed to save Google connection:", error);
      return back(request, "?error=save-failed");
    }

    return back(request, "?connected=1");
  } catch (err) {
    console.error("Google OAuth callback failed:", err);
    return back(request, "?error=exchange-failed");
  }
}
