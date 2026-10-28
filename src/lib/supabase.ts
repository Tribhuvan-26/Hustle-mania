import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        // Server Components can't write cookies; the proxy refreshes the session instead.
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {}
        },
      },
    },
  );
}

export type Profile = { role: "admin" | "stall"; stall_id: string | null; name: string | null };

/** Signed-in user's profile, or redirect to /login. Optionally require a role. */
export async function requireProfile(role?: Profile["role"]) {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await db.from("profiles").select("role, stall_id, name").eq("id", user.id).single();
  if (!profile) redirect("/login?error=no-profile");
  if (role && profile.role !== role) redirect(profile.role === "admin" ? "/admin" : "/stall");
  return { db, profile: profile as Profile };
}
