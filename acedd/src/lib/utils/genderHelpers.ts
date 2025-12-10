/**
 * Gender label mapping utilities
 * Sprint 14.7: Tutarlı cinsiyet label kullanımı
 */

/**
 * Gender label map for scholarship applications and membership applications
 * Maps various gender value formats to Turkish labels
 */
export const GENDER_LABELS: Record<string, string> = {
  // Türkçe formatlar
  "Erkek": "Erkek",
  "Kadın": "Kadın",
  "erkek": "Erkek",
  "kadın": "Kadın",
  // Uppercase enum formatlar (fallback)
  "MALE": "Erkek",
  "FEMALE": "Kadın",
  "male": "Erkek",
  "female": "Kadın",
} as const;

/**
 * Get Turkish label for a gender value
 * Falls back to the original value if no label is found
 * 
 * @param gender - Gender value (can be "Erkek", "Kadın", "MALE", "FEMALE", etc.)
 * @returns Turkish label ("Erkek" or "Kadın")
 */
export function getGenderLabel(gender: string | null | undefined): string {
  if (!gender) return "-";
  
  // Normalize to handle case variations
  const normalized = gender.trim();
  
  // Check exact match first (case-sensitive)
  if (GENDER_LABELS[normalized]) {
    return GENDER_LABELS[normalized];
  }
  
  // Check case-insensitive match
  const lower = normalized.toLowerCase();
  for (const [key, label] of Object.entries(GENDER_LABELS)) {
    if (key.toLowerCase() === lower) {
      return label;
    }
  }
  
  // Fallback: return original value if no match found
  return normalized;
}
