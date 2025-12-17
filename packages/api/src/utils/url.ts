export const TRPC_ENDPOINT = "/api/trpc";

type UrlConfig = {
  defaultPort?: number;
};

/**
 * Detects the base URL for the current environment.
 * Works in browser, server, and various deployment platforms.
 */
export function getBaseUrl(config?: UrlConfig): string {
  const { defaultPort = 3000 } = config ?? {};

  // Browser: use relative URL
  if (typeof window !== "undefined") {
    return "";
  }

  // Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Railway deployment
  if (process.env.RAILWAY_STATIC_URL) {
    return `https://${process.env.RAILWAY_STATIC_URL}`;
  }

  // Render deployment
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL;
  }

  // Local development
  return `http://localhost:${process.env.PORT ?? defaultPort}`;
}
