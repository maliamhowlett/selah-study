import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session if there is one. This runs on every request, so it
  // must not be able to take the site down: when Supabase is unreachable — a
  // paused free-tier project stops resolving in DNS entirely — this throws,
  // and an unhandled throw here 500s every page for anyone holding a session
  // cookie, while anonymous visitors never trigger the network call and see a
  // working site. Failing open means the worst case is being treated as
  // signed out, which is what an unreachable auth server means anyway.
  try {
    await supabase.auth.getUser();
  } catch (error) {
    console.error("Session refresh failed; continuing as signed out:", error);
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
