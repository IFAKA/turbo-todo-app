import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./root";
import { createContext } from "./context";
import { TRPC_ENDPOINT } from "./utils/url";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: TRPC_ENDPOINT,
    router: appRouter,
    createContext,
    req,
  });

export const GET = handler;
export const POST = handler;
