/**
 * Client-side logging helper
 * Standardized error/warn logging for React components
 * Production-safe: sanitizes sensitive data but keeps logs visible for debugging
 */

/**
 * Masks sensitive data in strings (e.g., TC kimlik numbers, emails)
 * @param value - Value to mask
 * @param visibleChars - Number of characters to show at the start and end (default: 2)
 * @returns Masked string
 */
function maskSensitiveValue(value: string | null | undefined, visibleChars: number = 2): string {
  if (!value || typeof value !== "string") {
    return "[REDACTED]";
  }

  const trimmed = value.trim();
  if (trimmed.length <= visibleChars * 2) {
    return "[REDACTED]";
  }

  const start = trimmed.substring(0, visibleChars);
  const end = trimmed.substring(trimmed.length - visibleChars);
  const masked = "*".repeat(Math.max(0, trimmed.length - visibleChars * 2));

  return `${start}${masked}${end}`;
}

/**
 * Sanitizes an object by masking sensitive fields
 * @param obj - Object to sanitize
 * @param sensitiveFields - Array of field names to mask
 * @returns Sanitized object
 */
function sanitizeObjectForClientLogging<T extends Record<string, any>>(
  obj: T,
  sensitiveFields: string[] = [
    "identityNumber", "tcId", "tcNumber", "nationalId",
    "phone", "email", "address", "fullName", "firstName", "lastName",
    "familyMonthlyIncome", "familyMonthlyExpenses", "income",
    "iban", "ibanNumber", "bankName", "bankAccount",
    "birthDate", "birthPlace", "hometown",
    "permanentAddress", "currentAccommodation",
    "password", "passwordHash", "token",
  ]
): Partial<T> {
  const sanitized: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveFields.includes(key)) {
      // Mask sensitive fields
      if (typeof value === "string") {
        sanitized[key as keyof T] = maskSensitiveValue(value) as T[keyof T];
      } else {
        sanitized[key as keyof T] = "[REDACTED]" as T[keyof T];
      }
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      sanitized[key as keyof T] = sanitizeObjectForClientLogging(value, sensitiveFields) as T[keyof T];
    } else {
      // Keep non-sensitive fields as-is
      sanitized[key as keyof T] = value;
    }
  }

  return sanitized;
}

/**
 * Logs an error on the client side with sanitized data
 * Production-safe: masks sensitive data but keeps logs visible for debugging
 * 
 * @param context - Context identifier (e.g., "[EventsContext][FETCH]", "[ScholarshipForm][SUBMIT]")
 * @param error - Error object or message
 * @param data - Optional data object to log (will be sanitized)
 */
export function logClientError(
  context: string,
  error: unknown,
  data?: Record<string, any>
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Always log error message
  console.error(`[CLIENT_ERROR]${context}`, errorMessage);

  // Stack trace is visible in client-side (useful for debugging, not a security risk)
  if (errorStack) {
    console.error(`[CLIENT_ERROR]${context} Stack:`, errorStack);
  }

  if (data) {
    const sanitized = sanitizeObjectForClientLogging(data);
    console.error(`[CLIENT_ERROR]${context} Data:`, sanitized);
  }
}

/**
 * Logs a warning on the client side with sanitized data
 * 
 * @param context - Context identifier
 * @param message - Warning message
 * @param data - Optional data object to log (will be sanitized)
 */
export function logClientWarn(
  context: string,
  message: string,
  data?: Record<string, any>
): void {
  console.warn(`[CLIENT_WARN]${context}`, message);

  if (data) {
    const sanitized = sanitizeObjectForClientLogging(data);
    console.warn(`[CLIENT_WARN]${context} Data:`, sanitized);
  }
}
