/**
 * Rate limiting helper
 * Sprint 15.2: IP-based rate limiting (3 requests per minute)
 * 
 * Note: This is a simple in-memory implementation.
 * For production with multiple server instances, consider using Redis or a distributed cache.
 */

import { logErrorSecurely } from "./secureLogging";

interface RateLimitEntry {
  count: number;
  resetAt: number; // Timestamp when the limit resets
}

// In-memory store for rate limiting
// Key: IP address, Value: RateLimitEntry
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval: Remove expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 3; // 3 requests per minute

// Start cleanup interval
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL);
}

/**
 * Extracts IP address from request headers
 * @param request - NextRequest object
 * @returns IP address string or null
 */
export function getClientIp(request: Request): string | null {
  // Check various headers for IP address (common in proxy/load balancer setups)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Fallback: try to get from request (may not work in all environments)
  // In Next.js Edge Runtime, we might not have direct access to IP
  return null;
}

/**
 * Checks if the request should be rate limited
 * @param ip - IP address of the client
 * @returns { allowed: boolean, remaining: number, resetAt: number | null }
 */
export function checkRateLimit(ip: string | null): {
  allowed: boolean;
  remaining: number;
  resetAt: number | null;
} {
  // If IP is not available, allow the request (but log warning)
  if (!ip) {
    logErrorSecurely("[RATE_LIMIT][WARNING]", new Error("IP address not available, allowing request"));
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS,
      resetAt: null,
    };
  }

  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // If no entry exists or entry has expired, create a new one
  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    };
    rateLimitStore.set(ip, newEntry);
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // Entry exists and is still valid
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(ip, entry);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Resets rate limit for a specific IP (useful for testing or admin actions)
 * @param ip - IP address to reset
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

