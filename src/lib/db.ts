import { PrismaClient } from "@prisma/client";

/**
 * Prisma client for the local SQLite backup database.
 *
 * On Vercel's serverless platform:
 *   - The filesystem is read-only at runtime except for `/tmp`.
 *   - SQLite files in the working directory cannot be written to.
 *   - So Prisma operations will throw at runtime.
 *
 * That's OK — the Google Sheet (via the Apps Script) is the primary source of
 * truth. The local DB is only a backup. The /api/register route wraps every
 * Prisma call in try/catch so failures are non-fatal.
 *
 * For local development, `prisma db:push` creates prisma/dev.db in the
 * project root, and everything works normally.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  try {
    return new PrismaClient({ log: ["error"] });
  } catch (err) {
    console.error("[db] Failed to instantiate PrismaClient:", err);
    // Return a stub that no-ops on every method so the API doesn't crash.
    // The /api/register route already handles `localSaved = false`.
    return new Proxy(
      {},
      {
        get: () => () => {
          throw new Error("Prisma client unavailable");
        },
      }
    ) as unknown as PrismaClient;
  }
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
