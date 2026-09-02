import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const REVOKE_ENDPOINT = "https://oauth2.googleapis.com/revoke";

// Full calendar scope: the site needs to read events, create them, and delete
// them. `openid`/`email` are only so we can show which account is connected.
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "openid",
  "email",
].join(" ");

export const OAUTH_STATE_COOKIE = "selah_google_oauth_state";

/** The one scope the site can't work without. */
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

/**
 * Google's consent screen lists each permission with its own checkbox, and
 * clicking Continue without ticking the calendar one still returns a perfectly
 * valid token — just one that can't touch a calendar. Catching it here turns a
 * baffling failure on the next page load into a clear "tick the box" message.
 */
export function grantsCalendarAccess(scope?: string): boolean {
  return (scope ?? "").split(" ").includes(CALENDAR_SCOPE);
}

export type GoogleConnection = {
  refreshToken: string;
  accessToken: string | null;
  expiresAt: string | null;
  googleEmail: string | null;
  calendarId: string;
};

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/**
 * The redirect URI must match what's registered in Google Cloud *exactly*.
 * GOOGLE_REDIRECT_URI wins when set; otherwise it's derived from the incoming
 * request so localhost and production both work without extra config.
 */
export function getRedirectUri(request: NextRequest): string {
  const configured = process.env.GOOGLE_REDIRECT_URI;
  if (configured) return configured;

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const origin = forwardedHost
    ? `${forwardedProto ?? "https"}://${forwardedHost}`
    : new URL(request.url).origin;

  return `${origin}/api/google/callback`;
}

export function buildAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    // offline + consent is what gets us a refresh_token. Without `prompt=consent`
    // Google omits the refresh token on every re-authorisation after the first.
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Thrown when Google refuses to mint a token. `needsReconnect` marks the case
 * that actually matters day to day: the refresh token has expired or been
 * revoked, which happens every 7 days while the app sits in Google's Testing
 * mode. The only cure is sending the user back through consent, so this has to
 * reach the UI as a reconnect prompt rather than a generic failure.
 */
export class GoogleAuthError extends Error {
  constructor(
    message: string,
    readonly needsReconnect: boolean,
  ) {
    super(message);
    this.name = "GoogleAuthError";
  }
}

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
  /** Space-separated list of what the user actually agreed to. */
  scope?: string;
};

async function postToken(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    // Google reports both an expired refresh token and a revoked one as
    // invalid_grant; either way the stored token is dead.
    const expired = detail.includes("invalid_grant");
    throw new GoogleAuthError(
      expired
        ? "Your Google Calendar connection expired — reconnect to keep syncing."
        : `Google token request failed (${res.status}): ${detail}`,
      expired,
    );
  }
  return (await res.json()) as TokenResponse;
}

export function exchangeCodeForTokens(code: string, redirectUri: string) {
  return postToken({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
}

function refreshAccessToken(refreshToken: string) {
  return postToken({
    refresh_token: refreshToken,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });
}

/**
 * Pull the email out of the id_token. It came straight from Google over TLS in
 * the token response, so the signature doesn't need re-verifying here — it's
 * only used as a label on the settings row.
 */
export function emailFromIdToken(idToken?: string): string | null {
  if (!idToken) return null;
  try {
    const payload = idToken.split(".")[1];
    if (!payload) return null;
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const claims = JSON.parse(json) as { email?: string };
    return claims.email ?? null;
  } catch {
    return null;
  }
}

type TokenRow = {
  refresh_token: string;
  access_token: string | null;
  expires_at: string | null;
  google_email: string | null;
  calendar_id: string | null;
};

export async function getConnection(): Promise<GoogleConnection | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("google_tokens")
    .select("refresh_token, access_token, expires_at, google_email, calendar_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as TokenRow;
  return {
    refreshToken: row.refresh_token,
    accessToken: row.access_token,
    expiresAt: row.expires_at,
    googleEmail: row.google_email,
    calendarId: row.calendar_id ?? "primary",
  };
}

export async function saveConnection(tokens: {
  refreshToken: string;
  accessToken: string;
  expiresIn: number;
  googleEmail: string | null;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not-signed-in" };

  const { error } = await supabase.from("google_tokens").upsert(
    {
      user_id: user.id,
      refresh_token: tokens.refreshToken,
      access_token: tokens.accessToken,
      expires_at: new Date(Date.now() + tokens.expiresIn * 1000).toISOString(),
      google_email: tokens.googleEmail,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  return { error: error?.message ?? null };
}

export async function deleteConnection(): Promise<void> {
  const connection = await getConnection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("google_tokens").delete().eq("user_id", user.id);

  // Best effort — if Google is unreachable the local row is already gone, which
  // is what the user asked for.
  if (connection) {
    await fetch(REVOKE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: connection.refreshToken }).toString(),
    }).catch(() => {});
  }
}

/**
 * A usable access token for the signed-in user, refreshing (and caching the
 * refreshed token) when the stored one is within a minute of expiring.
 */
export async function getAccessToken(): Promise<
  { token: string; calendarId: string } | null
> {
  const connection = await getConnection();
  if (!connection) return null;

  const expiresAt = connection.expiresAt ? Date.parse(connection.expiresAt) : 0;
  const stillFresh = connection.accessToken && expiresAt - Date.now() > 60_000;
  if (stillFresh) {
    return { token: connection.accessToken!, calendarId: connection.calendarId };
  }

  const refreshed = await refreshAccessToken(connection.refreshToken);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("google_tokens")
      .update({
        access_token: refreshed.access_token,
        expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  }

  return { token: refreshed.access_token, calendarId: connection.calendarId };
}
