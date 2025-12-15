import { createTRPCHandler } from "@repo/trpc-client/handler";
import { appRouter } from "./root";
import { createContext, type GetSessionFn } from "./context";

type HandlerOptions = {
  getSession: GetSessionFn;
};

export function createAppHandler(opts: HandlerOptions) {
  return createTRPCHandler({
    router: appRouter,
    createContext: (fetchOpts) => createContext(fetchOpts, { getSession: opts.getSession }),
  });
}
