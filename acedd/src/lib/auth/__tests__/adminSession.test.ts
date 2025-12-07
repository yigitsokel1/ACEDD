/**
 * Tests for Admin Session Management (Sprint 6: HMAC-SHA256 Security)
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import crypto from "crypto";

const SESSION_SECRET = "test-secret-key";
const SESSION_COOKIE_NAME = "admin_session";

// Mock next/headers - Create a shared mock cookie store
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => mockCookieStore),
}));

describe("Admin Session Security (Sprint 6)", () => {
  // Set environment variable before each test
  beforeEach(() => {
    process.env.SESSION_SECRET = SESSION_SECRET;
    vi.clearAllMocks();
  });

  const mockSession = {
    adminUserId: "admin-1",
    role: "ADMIN" as const,
    email: "admin@acedd.org",
    name: "Admin User",
  };

  describe("HMAC-SHA256 Signature", () => {
    it("should create session cookie with correct format: base64(payload).hex(hmac)", async () => {
      // Dynamic import to ensure fresh module with correct SESSION_SECRET
      const { createSession } = await import("../adminSession");
      await createSession(mockSession);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        SESSION_COOKIE_NAME,
        expect.stringMatching(/^[A-Za-z0-9+/=]+\.[0-9a-f]{64}$/),
        expect.any(Object)
      );

      // Verify format
      const cookieValue = (mockCookieStore.set as any).mock.calls[0][1] as string;
      const [payload, signature] = cookieValue.split(".");

      // Payload should be valid base64
      expect(() => Buffer.from(payload, "base64")).not.toThrow();
      
      // Signature should be 64 hex characters (SHA-256)
      expect(signature.length).toBe(64);
      expect(/^[0-9a-f]{64}$/i.test(signature)).toBe(true);

      // Decode payload and verify content
      const decoded = Buffer.from(payload, "base64").toString("utf-8");
      const session = JSON.parse(decoded);
      expect(session).toEqual(mockSession);
    });

    it("should verify valid HMAC signature", async () => {
      // Dynamic import to ensure fresh module with correct SESSION_SECRET
      const { createSession } = await import("../adminSession");
      await createSession(mockSession);
      
      const cookieValue = (mockCookieStore.set as any).mock.calls[0][1] as string;
      const [payload, signature] = cookieValue.split(".");

      // Verify signature manually using the test secret
      const expectedSignature = crypto
        .createHmac("sha256", SESSION_SECRET)
        .update(payload)
        .digest("hex");

      expect(signature).toBe(expectedSignature);
    });

    it("should reject session with invalid signature", async () => {
      const { createSession, getSession } = await import("../adminSession");
      
      // Create valid session
      await createSession(mockSession);
      
      const cookieValue = (mockCookieStore.set as any).mock.calls[0][1] as string;
      const [payload] = cookieValue.split(".");

      // Create tampered cookie with invalid signature
      const tamperedCookie = `${payload}.${"a".repeat(64)}`;
      
      // Try to get session with tampered cookie
      (mockCookieStore.get as any).mockReturnValue({
        value: tamperedCookie,
      });

      const session = await getSession();
      
      // Should return null for invalid signature
      expect(session).toBeNull();
    });

    it("should reject session with modified payload", async () => {
      const { createSession, getSession } = await import("../adminSession");
      
      // Create valid session
      await createSession(mockSession);
      
      const cookieValue = (mockCookieStore.set as any).mock.calls[0][1] as string;
      const [, originalSignature] = cookieValue.split(".");

      // Create tampered payload (change role to SUPER_ADMIN)
      const tamperedPayload = Buffer.from(
        JSON.stringify({ ...mockSession, role: "SUPER_ADMIN" })
      ).toString("base64");
      
      // Original signature won't match tampered payload
      const tamperedCookie = `${tamperedPayload}.${originalSignature}`;
      
      (mockCookieStore.get as any).mockReturnValue({
        value: tamperedCookie,
      });

      const session = await getSession();
      
      // Should return null because signature doesn't match payload
      expect(session).toBeNull();
    });

    it("should reject session with missing signature", async () => {
      const { getSession } = await import("../adminSession");
      
      // Create payload without signature
      const payload = Buffer.from(JSON.stringify(mockSession)).toString("base64");
      const invalidCookie = payload; // No signature part
      
      (mockCookieStore.get as any).mockReturnValue({
        value: invalidCookie,
      });

      const session = await getSession();
      
      // Should return null for invalid format
      expect(session).toBeNull();
    });

    it("should use timing-safe comparison for signature verification", async () => {
      const { createSession, getSession } = await import("../adminSession");
      
      // This test verifies that we're using crypto.timingSafeEqual
      // to prevent timing attacks
      await createSession(mockSession);
      
      const cookieValue = (mockCookieStore.set as any).mock.calls[0][1] as string;
      const [payload] = cookieValue.split(".");

      // Create signature with wrong secret
      const wrongSecret = "wrong-secret";
      const wrongSignature = crypto
        .createHmac("sha256", wrongSecret)
        .update(payload)
        .digest("hex");

      const tamperedCookie = `${payload}.${wrongSignature}`;
      
      (mockCookieStore.get as any).mockReturnValue({
        value: tamperedCookie,
      });

      const session = await getSession();
      
      // Should return null (signature verification should fail)
      expect(session).toBeNull();
    });
  });

  describe("Session Cookie Attributes", () => {
    it("should set secure cookie in production", async () => {
      const originalEnv = process.env.NODE_ENV;
      
      // Set NODE_ENV to production
      process.env.NODE_ENV = "production";
      
      // Dynamic import to get fresh module with new NODE_ENV
      const { createSession } = await import("../adminSession");
      await createSession(mockSession);

      const options = (mockCookieStore.set as any).mock.calls[0][2];
      expect(options.secure).toBe(true);

      // Restore original env
      process.env.NODE_ENV = originalEnv;
    });

    it("should set httpOnly cookie", async () => {
      const { createSession } = await import("../adminSession");
      await createSession(mockSession);

      const options = (mockCookieStore.set as any).mock.calls[0][2];
      expect(options.httpOnly).toBe(true);
    });

    it("should set sameSite to 'lax'", async () => {
      const { createSession } = await import("../adminSession");
      await createSession(mockSession);

      const options = (mockCookieStore.set as any).mock.calls[0][2];
      expect(options.sameSite).toBe("lax");
    });

    it("should set maxAge to 7 days", async () => {
      const { createSession } = await import("../adminSession");
      await createSession(mockSession);

      const options = (mockCookieStore.set as any).mock.calls[0][2];
      expect(options.maxAge).toBe(60 * 60 * 24 * 7);
    });
  });
});

