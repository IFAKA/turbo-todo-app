import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

type User = NonNullable<Context["user"]> & { id: string };

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { db: ctx.db, user: ctx.user as User } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
