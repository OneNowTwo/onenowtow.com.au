import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import * as schema from "./schema";

export type AppDb = ReturnType<typeof drizzlePglite<typeof schema>>;

declare global {
  // eslint-disable-next-line no-var
  var __personalAgentDb: AppDb | undefined;
  // eslint-disable-next-line no-var
  var __personalAgentDbReady: Promise<AppDb> | undefined;
  // eslint-disable-next-line no-var
  var __personalAgentPglite: PGlite | undefined;
}

async function bootstrapSchema(client: PGlite): Promise<void> {
  const migrations = ["0000_init.sql", "0001_google_credentials.sql"];
  for (const file of migrations) {
    const sqlPath = path.join(process.cwd(), "db", "migrations", file);
    const sql = readFileSync(sqlPath, "utf8");
    await client.exec(sql);
  }
}

async function createPgliteDb(): Promise<AppDb> {
  const configured = process.env.PGLITE_DATA_DIR ?? path.join(process.cwd(), ".data", "pglite");
  const dataDir = path.resolve(String(configured));
  mkdirSync(dataDir, { recursive: true });
  const client = globalThis.__personalAgentPglite ?? new PGlite(dataDir);
  globalThis.__personalAgentPglite = client;
  await client.waitReady;
  await bootstrapSchema(client);
  return drizzlePglite({ client, schema });
}

export async function getDb(): Promise<AppDb> {
  if (globalThis.__personalAgentDb) return globalThis.__personalAgentDb;
  if (!globalThis.__personalAgentDbReady) {
    globalThis.__personalAgentDbReady = (async () => {
      // Optional remote Postgres: set DATABASE_URL and install `pg`, then extend
      // this factory. Pilot default is durable local PGlite under .data/pglite.
      const db = await createPgliteDb();
      globalThis.__personalAgentDb = db;
      return db;
    })();
  }
  return globalThis.__personalAgentDbReady;
}

export { schema };
