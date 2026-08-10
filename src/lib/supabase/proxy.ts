import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Refreshes the Supabase session cookie on every request and reports the
 * current user, if any. Called from src/proxy.ts (this Next.js version's
 * replacement for middleware.ts) rather than being a proxy itself, so it
 * can be unit tested independently.
 */
export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return { response: NextResponse.next({ request }), user: null };
  }

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
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Must call getUser() (not just getSession()) so an expired token is
  // actually revalidated against Supabase here, not just trusted from
  // the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
