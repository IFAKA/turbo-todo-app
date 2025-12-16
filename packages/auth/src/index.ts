import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@repo/db";
import { redirect } from "next/navigation";
import { cache } from "react";

// NextAuth configuration
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

// Re-export handlers for route.ts
export const { GET, POST } = handlers;

// ============================================
// Helper functions for simple intent coding
// ============================================

/**
 * Get current session (cached per request)
 * Use in Server Components to check auth status
 */
export const getSession = cache(async () => {
  return await auth();
});

/**
 * Require authentication - redirects to /login if not authenticated
 * Use in protected layouts/pages
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/**
 * Require guest - redirects to /dashboard if already authenticated
 * Use in login/signup pages
 */
export async function requireGuest() {
  const session = await getSession();
  if (session) redirect("/dashboard");
}

// Re-export types
export type { Session } from "next-auth";
