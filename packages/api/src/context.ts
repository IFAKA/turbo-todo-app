import { db } from "@repo/db";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts?: FetchCreateContextFnOptions) {
  return {
    db,
    // Add your context here
    // session: await getSession(opts.req, opts.res),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
