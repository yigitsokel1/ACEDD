import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Global type definition for Prisma singleton pattern.
 * Prevents multiple instances of PrismaClient in development (Next.js hot reload).
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  adapter?: PrismaMariaDb;
};

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
  } catch (error) {
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
 * MariaDB adapter instance.
 * Uses singleton pattern in development to prevent multiple adapter instances.
 */
const adapter =
  globalForPrisma.adapter ??
  new PrismaMariaDb(process.env.DATABASE_URL);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.adapter = adapter;
}

/**
 * Prisma Client instance.
 * 
 * Configuration:
 * - Uses MariaDB adapter for database connections
 * - Logging:
 *   - Development: query, error, warn (for debugging)
 *   - Production: error only (for performance)
 * 
 * Singleton pattern in development prevents multiple instances during hot reload.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
