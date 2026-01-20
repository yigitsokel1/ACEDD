import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Global type definition for Prisma singleton pattern.
 * Prevents multiple instances of PrismaClient in development (Next.js hot reload).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Load .env file if DATABASE_URL is not set (for scripts)
 * In Next.js, environment variables are automatically loaded, but scripts need this.
 */
if (!process.env.DATABASE_URL) {
  try {
    // Only load dotenv if not in Next.js environment
    if (typeof window === "undefined" && !process.env.NEXT_RUNTIME) {
      const { config } = require("dotenv");
      const { resolve } = require("path");
      config({ path: resolve(process.cwd(), ".env") });
    }
  } catch {
    // dotenv might not be available, that's okay
  }
}

/**
 * Validates that DATABASE_URL is set.
 * Throws an error if missing to fail fast during initialization.
 */
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please configure it in your .env file."
  );
}

/**
 * Prisma Client instance (PostgreSQL / Supabase).
 * Uses @prisma/adapter-pg: Next.js 16 / Turbopack "workerd" ortamında engineType "library"
 * adapter ile çalışır; binary engine kullanılmaz.
 *
 * Logging:
 *   - Production: error only (for performance)
 *   - Development: Controlled by PRISMA_LOG_QUERIES env var
 *
 * Singleton pattern in development prevents multiple instances during hot reload.
 */
const shouldLogQueries =
  process.env.NODE_ENV === "production"
    ? false
    : process.env.PRISMA_LOG_QUERIES === "true";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(
      { connectionString: process.env.DATABASE_URL! },
      { schema: "public" }
    ),
    log: shouldLogQueries ? ["query", "error", "warn"] : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
