import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Find monorepo root by looking for turbo.json
function findRoot(start: string): string {
  let dir = start;
  while (dir !== "/") {
    if (existsSync(join(dir, "turbo.json"))) return dir;
    dir = dirname(dir);
  }
  return start;
}

const root = findRoot(dirname(fileURLToPath(import.meta.url)));
config({ path: join(root, ".env") });

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
