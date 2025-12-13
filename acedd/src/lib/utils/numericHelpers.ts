/**
 * Numeric normalization utilities
 * Sprint 16 - Block C: String to number normalization for form inputs
 */

/**
 * Normalizes a numeric input (string or number) to a number
 * Handles string inputs with decimal points, commas, and whitespace
 * 
 * @param input - Numeric input (string or number)
 * @returns Number or null if invalid
 */
export function normalizeNumericInput(input: string | number | null | undefined): number | null {
  if (input === null || input === undefined) return null;
  
  if (typeof input === "number") {
    return isNaN(input) ? null : input;
  }
  
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return null;
    
    // Remove whitespace and replace comma with dot for decimal
    const cleaned = trimmed.replace(/\s/g, "").replace(/,/g, ".");
    
    // Try to parse as float
    const parsed = parseFloat(cleaned);
    
    if (isNaN(parsed)) {
      return null;
    }
    
    return parsed;
  }
  
  return null;
}

/**
 * Normalizes a numeric input and ensures it's a positive number
 * 
 * @param input - Numeric input (string or number)
 * @returns Positive number or null if invalid
 */
export function normalizePositiveNumericInput(input: string | number | null | undefined): number | null {
  const normalized = normalizeNumericInput(input);
  if (normalized === null) return null;
  
  return normalized >= 0 ? normalized : null;
}

/**
 * Normalizes a numeric input and ensures it's an integer
 * 
 * @param input - Numeric input (string or number)
 * @returns Integer or null if invalid
 */
export function normalizeIntegerInput(input: string | number | null | undefined): number | null {
  const normalized = normalizeNumericInput(input);
  if (normalized === null) return null;
  
  return Math.floor(normalized);
}

