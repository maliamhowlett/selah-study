import { NextResponse } from "next/server";
import { deleteConnection } from "@/lib/google/oauth";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  await deleteConnection();
  return NextResponse.json({ ok: true });
}
