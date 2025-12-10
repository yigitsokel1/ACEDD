/**
 * Blood type label mapping utilities
 * Sprint 15.3: Kan grubu label mapping
 */

import type { BloodType } from "@/lib/types/member";

export const BLOOD_TYPE_LABELS: Record<BloodType, string> = {
  A_POSITIVE: "A Rh+",
  A_NEGATIVE: "A Rh-",
  B_POSITIVE: "B Rh+",
  B_NEGATIVE: "B Rh-",
  AB_POSITIVE: "AB Rh+",
  AB_NEGATIVE: "AB Rh-",
  O_POSITIVE: "0 Rh+",
  O_NEGATIVE: "0 Rh-",
} as const;

/**
 * Gets the display label for a blood type
 * @param bloodType - Blood type enum value
 * @returns Display label or "-" if not provided
 */
export function getBloodTypeLabel(bloodType: BloodType | null | undefined): string {
  if (!bloodType) {
    return "-";
  }

  return BLOOD_TYPE_LABELS[bloodType] || bloodType;
}

