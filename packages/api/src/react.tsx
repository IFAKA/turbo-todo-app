"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState, type ReactNode } from "react";
import type { AppRouter } from "./root";
import { getBaseUrl, TRPC_ENDPOINT } from "./utils/url";

export const trpc = createTRPCReact<AppRouter>();

function createQueryClient() {
  return new QueryClient();
}

function createTRPCClient() {
  return trpc.createClient({
    links: [httpBatchLink({ url: `${getBaseUrl()}${TRPC_ENDPOINT}` })],
  });
}

export function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  const [trpcClient] = useState(createTRPCClient);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
