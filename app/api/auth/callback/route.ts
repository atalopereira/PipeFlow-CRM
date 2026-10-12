import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Only a same-origin relative path is a safe redirect target: must start
// with a single "/" and never "//" or "/\" (both are browser-recognized
// scheme-relative URLs) — otherwise fall back to the default. This also
// rejects the "/api/auth/callback?next=@evil.com" userinfo trick, where
// `${origin}${next}` would resolve to host "evil.com".
function safeRedirectPath(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")) {
    return next;
  }
  return "/onboarding";
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
