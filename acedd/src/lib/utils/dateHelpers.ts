/**
 * Date formatting utilities
 * Sprint 14.7: Date-only field'lar için timezone-safe formatting
 */

/**
 * Formats a date string (ISO 8601) to Turkish locale date-only format
 * Handles timezone issues by parsing the date correctly
 * 
 * @param dateString - ISO 8601 date string (e.g., "2024-01-15T00:00:00.000Z")
 * @returns Formatted date string in Turkish locale (e.g., "15.01.2024")
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
    
    // Format as date-only (no time) in Turkish locale
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Europe/Istanbul', // Sprint 14.7: Explicit timezone to avoid conversion issues
    });
  } catch {
    return "-";
  }
}

/**
 * Formats a date string (ISO 8601) to Turkish locale with time
 * 
 * @param dateString - ISO 8601 date string
 * @returns Formatted date-time string in Turkish locale
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "-";
    }
    
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul',
    });
  } catch {
    return "-";
  }
}

/**
 * Formats a date string (ISO 8601) to Turkish locale short format with time
 * 
 * @param dateString - ISO 8601 date string
 * @returns Formatted short date-time string in Turkish locale (e.g., "15 Oca 2024, 14:30")
 */
export function formatDateTimeShort(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "-";
    }
    
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul',
    });
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
