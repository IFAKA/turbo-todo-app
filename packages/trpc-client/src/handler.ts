import {
  fetchRequestHandler,
  type FetchCreateContextFnOptions,
} from "@trpc/server/adapters/fetch";
import type { AnyRouter } from "@trpc/server";

type TRPCHandlerConfig<TRouter extends AnyRouter> = {
  router: TRouter;
  createContext: (opts?: FetchCreateContextFnOptions) => Promise<unknown> | unknown;
  endpoint?: string;
};

/**
 * Creates Next.js App Router handlers for tRPC.
 *
 * @example
 * ```typescript
 * // app/api/trpc/[trpc]/route.ts
 * import { createTRPCHandler } from "@repo/trpc-client/handler";
 * import { appRouter } from "./root";
 * import { createContext } from "./context";
 *
 * export const { GET, POST } = createTRPCHandler({
 *   router: appRouter,
 *   createContext,
 * });
 * ```
 */
export function createTRPCHandler<TRouter extends AnyRouter>(
  config: TRPCHandlerConfig<TRouter>
) {
  const { router, createContext, endpoint = "/api/trpc" } = config;

  const handler = (req: Request) =>
    fetchRequestHandler({
      endpoint,
      req,
      router,
      createContext,
    });

  return {
    GET: handler,
    POST: handler,
  };
}
