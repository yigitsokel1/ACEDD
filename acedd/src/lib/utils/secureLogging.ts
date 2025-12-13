/**
 * Secure logging helper
 * Sprint 15.2: Filter sensitive data from logs (TC kimlik, form data, etc.)
 */

/**
 * Masks sensitive data in strings (e.g., TC kimlik numbers)
 * @param value - Value to mask
 * @param visibleChars - Number of characters to show at the start and end (default: 2)
 * @returns Masked string
 */
export function maskSensitiveValue(value: string | null | undefined, visibleChars: number = 2): string {
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
 * Sanitizes an object by removing or masking sensitive fields
 * @param obj - Object to sanitize
 * @param sensitiveFields - Array of field names to mask/remove
 * @returns Sanitized object
 */
export function sanitizeObjectForLogging<T extends Record<string, any>>(
  obj: T,
  sensitiveFields: string[] = [
    "identityNumber", "tcId", "tcNumber", "nationalId",
    "phone", "email", "address", "fullName", "firstName", "lastName",
    "familyMonthlyIncome", "familyMonthlyExpenses", "income",
    "iban", "ibanNumber", "bankName", "bankAccount",
    "birthDate", "birthPlace", "hometown",
    "permanentAddress", "currentAccommodation",
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
      sanitized[key as keyof T] = sanitizeObjectForLogging(value, sensitiveFields) as T[keyof T];
    } else {
      // Keep non-sensitive fields as-is
      sanitized[key as keyof T] = value;
    }
  }

  return sanitized;
}

/**
 * Logs an error with sanitized data
 * @param context - Context identifier (e.g., "[API][MEMBERSHIP][CREATE]")
 * @param error - Error object or message
 * @param data - Optional data object to log (will be sanitized)
 */
export function logErrorSecurely(context: string, error: unknown, data?: Record<string, any>): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`${context}`, errorMessage);
  if (errorStack) {
    console.error(`${context} Stack:`, errorStack);
  }

  if (data) {
    const sanitized = sanitizeObjectForLogging(data);
    console.error(`${context} Data:`, JSON.stringify(sanitized, null, 2));
  }
}

