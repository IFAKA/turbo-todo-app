"use client";

import { createTRPCReactClient } from "@repo/trpc-client/react";
import type { AppRouter } from "./root";

export const { trpc, TRPCProvider } = createTRPCReactClient<AppRouter>();
