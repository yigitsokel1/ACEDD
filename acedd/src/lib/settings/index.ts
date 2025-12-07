/**
 * Settings Module
 * 
 * Sprint 10: Settings helper functions and convenience wrappers
 * 
 * Core functions:
 *   - getSetting(key) - Get single setting
 *   - getSettings(prefix) - Get settings by prefix
 *   - getSettingValue(settings, key, fallback) - Type-safe value extraction
 * 
 * Convenience functions:
 *   - getSiteName() - Get site name with fallback
 *   - getSiteDescription() - Get site description with fallback
 *   - getSocialLinks() - Get social media links
 *   - getContactInfo() - Get contact information
 *   - getFooterText() - Get footer text
 *   - getLogoUrl() - Get logo URL with fallback
 *   - getFaviconUrl() - Get favicon URL with fallback
 */

// Core functions
export {
  getSetting,
  getSettings,
  getAllSettings,
  getSettingValue,
  type SettingValue,
  type SettingsMap,
} from "./getSetting";

// Convenience functions
export {
  getSiteName,
  getSiteDescription,
  getSocialLinks,
  getContactInfo,
  getFooterText,
  getLogoUrl,
  getFaviconUrl,
  getFaviconUrlWithTimestamp,
} from "./convenience";

