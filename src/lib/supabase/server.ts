import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase client for Server Components and Route Handlers. Reads/writes
 * the session cookie via `next/headers`; RLS applies as the logged-in
 * user. Session cookie refresh itself happens in `src/proxy.ts`, not here.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component render, where cookies can't
            // be set. Safe to ignore since src/proxy.ts refreshes the
            // session on every request.
          }
        },
      },
    },
  );
}
