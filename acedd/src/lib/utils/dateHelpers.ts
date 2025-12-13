/**
 * Date formatting utilities
 * Sprint 14.7: Date-only field'lar için timezone-safe formatting
 */

/**
 * Formats a date string (ISO 8601) to dd.mm.yyyy format
 * Handles timezone issues by parsing the date correctly
 * 
 * @param dateString - ISO 8601 date string (e.g., "2024-01-15T00:00:00.000Z")
 * @returns Formatted date string in dd.mm.yyyy format (e.g., "15.01.2024")
 */
export function formatDateOnly(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  
  try {
    // Parse ISO string - new Date() automatically handles timezone conversion
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "-";
    }
    
    // Format as dd.mm.yyyy (using local date components)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  } catch {
    return "-";
  }
}

/**
 * Formats a date string (ISO 8601) to dd.mm.yyyy format with time
 * 
 * @param dateString - ISO 8601 date string
 * @returns Formatted date-time string in dd.mm.yyyy HH:mm format (e.g., "15.01.2024, 14:30")
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "-";
    }
    
    // Format date as dd.mm.yyyy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // Format time as HH:mm
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  } catch {
    return "-";
  }
}

/**
 * Formats a date string (ISO 8601) to dd.mm.yyyy format with time
 * 
 * @param dateString - ISO 8601 date string
 * @returns Formatted date-time string in dd.mm.yyyy HH:mm format (e.g., "15.01.2024, 14:30")
 */
export function formatDateTimeShort(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "-";
    }
    
    // Format date as dd.mm.yyyy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // Format time as HH:mm
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  } catch {
    return "-";
  }
}

/**
 * Converts an ISO 8601 date string to YYYY-MM-DD format for HTML date inputs
 * 
 * @param dateString - ISO 8601 date string (e.g., "2024-01-15T00:00:00.000Z")
 * @returns Date string in YYYY-MM-DD format (e.g., "2024-01-15") or empty string if invalid
 */
export function isoToDateInput(dateString: string | null | undefined): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "";
    }
    
    // Get date components in local timezone (Europe/Istanbul)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}

// ============================================================================
// Sprint 16 - Block C: Date Normalization Helpers
// ============================================================================

/**
 * Normalizes a date input (string or Date) to a Date object
 * Handles various input formats: ISO strings, YYYY-MM-DD strings, Date objects
 * 
 * @param input - Date input (string or Date)
 * @returns Date object or null if invalid
 */
export function normalizeDateInput(input: string | Date | null | undefined): Date | null {
  if (!input) return null;
  
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }
  
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return null;
    
    try {
      const date = new Date(trimmed);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }
  
  return null;
}

/**
 * Converts a date to start of day in UTC
 * Useful for consistent date comparisons and storage
 * 
 * @param date - Date object or date string
 * @returns Date object at start of day UTC, or null if invalid
 */
export function toStartOfDayUTC(date: Date | string | null | undefined): Date | null {
  const normalized = normalizeDateInput(date);
  if (!normalized) return null;
  
  try {
    const year = normalized.getUTCFullYear();
    const month = normalized.getUTCMonth();
    const day = normalized.getUTCDate();
    
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  } catch {
    return null;
  }
}