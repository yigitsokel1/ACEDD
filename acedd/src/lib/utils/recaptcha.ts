/**
 * reCAPTCHA Verification Helper
 * 
 * Sprint 16 - Block E: reCAPTCHA verification for public forms
 * 
 * Verifies reCAPTCHA tokens with Google's reCAPTCHA API
 */

/**
 * Verifies a reCAPTCHA token with Google's reCAPTCHA API
 * 
 * @param token - reCAPTCHA token from client
 * @param secretKey - reCAPTCHA secret key (from environment)
 * @returns Promise<boolean> - true if verification succeeds, false otherwise
 */
export async function verifyRecaptchaToken(
  token: string | null | undefined,
  secretKey: string | undefined
): Promise<boolean> {
  // If no secret key is configured, skip verification (development mode)
  if (!secretKey) {
    console.warn("[RECAPTCHA] Secret key not configured, skipping verification");
    return true;
  }

  // If no token provided, verification fails
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    if (!response.ok) {
      console.error("[RECAPTCHA] Verification request failed:", response.status);
      return false;
    }

    const data = await response.json();

    // Google's response format: { success: boolean, challenge_ts?: string, hostname?: string, ... }
    if (data.success === true) {
      return true;
    }

    // Log error codes for debugging (but don't expose to client)
    if (data["error-codes"] && Array.isArray(data["error-codes"])) {
      console.warn("[RECAPTCHA] Verification failed with errors:", data["error-codes"]);
    }

    return false;
  } catch (error) {
    console.error("[RECAPTCHA] Verification error:", error);
    return false;
  }
}

