/**
 * Core Settings Functions
 * 
 * Sprint 10: Core settings helper functions
 * 
 * Usage:
 *   const setting = await getSetting("site.name");
 *   const settings = await getSettings("site");
 *   const siteName = getSettingValue(settings, "site.name", "ACEDD");
 */

import { prisma } from "../db";
import type { Prisma } from "@prisma/client";
import { logErrorSecurely } from "../utils/secureLogging";

export type SettingValue = string | number | boolean | object | null | undefined;
export type SettingsMap = Record<string, SettingValue>;

/**
 * Get a single setting by key
 * 
 * @param key - Setting key (e.g., "site.name")
 * @returns Promise<SettingValue>
 * 
 * @example
 * const siteName = await getSetting("site.name"); // "ACEDD" or null
 */
export async function getSetting(key: string): Promise<SettingValue> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });

    if (!setting || setting.value === null) {
      return null;
    }

    return setting.value as SettingValue;
  } catch (error) {
    logErrorSecurely(`[Settings][GET_SETTING] key: ${key}`, error);
    return null;
  }
}

/**
 * Get settings by prefix
 * 
 * @param prefix - Prefix pattern (e.g., "site" or "site.*")
 * @returns Promise<SettingsMap>
 * 
 * @example
 * const settings = await getSettings("site");
 * const siteName = settings["site.name"]; // "ACEDD"
 */
export async function getSettings(prefix: string): Promise<SettingsMap> {
  try {
    // Remove wildcard if present
    const cleanPrefix = prefix.replace(/\.\*$/, "");

    // Fetch settings matching the prefix
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          startsWith: `${cleanPrefix}.`,
        },
      },
      orderBy: { key: "asc" },
    });

    return settingsToMap(settings);
  } catch (error) {
    logErrorSecurely(`[Settings][GET_SETTINGS_BY_PREFIX] prefix: ${prefix}`, error);
    // Return empty object on error to prevent breaking the app
    return {};
  }
}

/**
 * Get all settings
 * 
 * @returns Promise<SettingsMap>
 * 
 * @example
 * const allSettings = await getAllSettings();
 */
export async function getAllSettings(): Promise<SettingsMap> {
  try {
    const allSettings = await prisma.setting.findMany({
      orderBy: { key: "asc" },
    });

    return settingsToMap(allSettings);
  } catch (error) {
    logErrorSecurely("[Settings][GET_ALL_SETTINGS]", error);
    return {};
  }
}

/**
 * Get setting value with type-safe fallback
 * 
 * @param settings - Settings map from getSettings()
 * @param key - Setting key (e.g., "site.name")
 * @param fallback - Fallback value if setting doesn't exist or is null
 * @returns T - The setting value or fallback
 * 
 * @example
 * const settings = await getSettings("site");
 * const siteName = getSettingValue(settings, "site.name", "ACEDD"); // "ACEDD" or setting value
 */
export function getSettingValue<T extends SettingValue>(
  settings: SettingsMap,
  key: string,
  fallback: T
): T {
  const value = settings[key];

  // If value is null or undefined, return fallback
  if (value === null || value === undefined) {
    return fallback;
  }

  // Type check: ensure value matches expected type
  // Special case: if fallback is undefined, allow any value type
  if (fallback === undefined) {
    return value as T;
  }

  // Special case: if fallback is null, allow any value type (but not null/undefined)
  if (fallback === null) {
    return value as T;
  }

  if (typeof fallback === "string" && typeof value !== "string") {
    return fallback;
  }
  if (typeof fallback === "number" && typeof value !== "number") {
    return fallback;
  }
  if (typeof fallback === "boolean" && typeof value !== "boolean") {
    return fallback;
  }
  // Note: typeof null === "object" in JavaScript, so we need to check for null explicitly
  if (fallback !== null && typeof fallback === "object" && (value === null || typeof value !== "object")) {
    return fallback;
  }

  return value as T;
}

/**
 * Convert settings array to key-value map
 */
function settingsToMap(
  settings: Array<{
    id: string;
    key: string;
    value: Prisma.JsonValue | null;
    updatedAt: Date;
    updatedBy: string | null;
  }>
): SettingsMap {
  const map: SettingsMap = {};

  settings.forEach((setting) => {
    map[setting.key] = setting.value as SettingValue;
  });

  return map;
}

