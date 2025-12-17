import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@repo/db";
import { redirect } from "next/navigation";
import { cache } from "react";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
  session: { strategy: "database" },
  pages: { signIn: "/login" },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});

export const { GET, POST } = handlers;

/**
 * Get current session
 *
 * Wrapped in cache() to deduplicate calls within a single request.
 * Multiple components calling getSession() will only hit the database once.
 */
export const getSession = cache(auth);

export async function requireAuth(redirectTo: string) {
  const session = await getSession();
  if (!session) redirect(redirectTo);
  return session;
}

export async function requireGuest(redirectTo: string) {
  const session = await getSession();
  if (session) redirect(redirectTo);
}

/**
 * Use when you need explicit session typing for function parameters or props.
 * Usually not needed since getSession() return type is inferred.
 */
export type { Session } from "next-auth";
