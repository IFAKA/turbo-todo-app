"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";
import type { AnyRouter } from "@trpc/server";
import { useState, type ReactNode } from "react";
import { getBaseUrl } from "./url";

export type TRPCClientConfig = {
  endpoint?: string;
  baseUrl?: string;
};

type TRPCReactClient<TRouter extends AnyRouter> = CreateTRPCReact<TRouter, unknown>;

/**
 * Creates a typed tRPC React client and provider for any AppRouter.
 *
 * @example
 * ```tsx
 * // lib/trpc.ts
 * import { createTRPCReactClient } from "@repo/trpc-client/react";
 * import type { AppRouter } from "@repo/api";
 *
 * export const { trpc, TRPCProvider } = createTRPCReactClient<AppRouter>();
 *
 * // layout.tsx
 * <TRPCProvider>{children}</TRPCProvider>
 *
 * // components
 * const { data } = trpc.todo.getAll.useQuery();
 * ```
 */
export function createTRPCReactClient<TRouter extends AnyRouter>(
  config?: TRPCClientConfig
): {
  trpc: TRPCReactClient<TRouter>;
  TRPCProvider: React.FC<{ children: ReactNode }>;
} {
  const { endpoint = "/api/trpc", baseUrl } = config ?? {};

  // Use unknown as intermediate to avoid tRPC's complex union types
  const trpcBase = createTRPCReact<TRouter>() as unknown;
  const trpc = trpcBase as TRPCReactClient<TRouter>;

  // Extract createClient and Provider with proper typing through unknown
  const { createClient, Provider } = trpcBase as {
    createClient: (opts: { links: unknown[] }) => unknown;
    Provider: React.FC<{ client: unknown; queryClient: QueryClient; children: ReactNode }>;
  };

  function TRPCProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    const [trpcClient] = useState(() =>
      createClient({
        links: [
          httpBatchLink({
            url: `${baseUrl ?? getBaseUrl()}${endpoint}`,
          }),
        ],
      })
    );

    return (
      <Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Provider>
    );
  }

  return {
    trpc,
    TRPCProvider,
  };
}
