import { db } from "@repo/db";
import { getSession } from "@repo/auth";

export async function createContext() {
  const session = await getSession();
  return { db, user: session?.user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
