import { db } from "@repo/db";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

// Session type from NextAuth
export type Session = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
} | null;

export type GetSessionFn = () => Promise<Session>;

export type CreateContextOptions = {
  getSession: GetSessionFn;
};

export async function createContext(
  opts?: FetchCreateContextFnOptions,
  contextOpts?: CreateContextOptions
) {
  const session = contextOpts?.getSession ? await contextOpts.getSession() : null;

  return {
    db,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
