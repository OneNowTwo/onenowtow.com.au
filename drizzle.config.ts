import { defineConfig } from "drizzle-kit";

// Allow running without DATABASE_URL in development (uses in-memory storage)
const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost/onenowtwo";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
