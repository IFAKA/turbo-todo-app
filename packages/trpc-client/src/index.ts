// React client utilities
export { createTRPCReactClient } from "./react";
export type { TRPCClientConfig } from "./react";

// Handler utilities
export { createTRPCHandler } from "./handler";

// Optimistic update utilities
export { createListCache } from "./optimistic";
export type {
  ListCache,
  CacheMethods,
  WithId,
  QueryUtils,
} from "./optimistic";

// URL utilities
export { getBaseUrl } from "./url";
