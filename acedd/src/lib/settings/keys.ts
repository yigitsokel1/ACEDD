/**
 * Centralized Setting Keys Management
 * 
 * Sprint 12: Merkezi key yönetimi - tüm setting key'leri tek yerden yönetilir
 * 
 * Bu dosya, projede kullanılan tüm setting key'lerini merkezi bir yerden yönetmek için oluşturulmuştur.
 * Bu sayede:
 * - Key literal'ları dağınık olmaktan çıkar
 * - Hata riski azalır (typo'lar compile-time'da yakalanır)
 * - Refactor kolaylaşır
 * - Pages → settings arasındaki coupling açıkça görülür
 */

import type { PageIdentifier } from "../types/setting";

/**
 * Helper function to get content prefix for a page
 * @param pageKey - Page identifier
 * @returns Content prefix (e.g., "content.home")
 */
export function getContentPrefix(pageKey: PageIdentifier): string {
  return `content.${pageKey}`;
}

/**
 * Helper function to get SEO prefix for a page
 * @param pageKey - Page identifier
 * @returns SEO prefix (e.g., "seo.home")
 */
export function getSeoPrefix(pageKey: PageIdentifier): string {
  return `seo.${pageKey}`;
}

/**
 * Helper function to get a content key for a specific page and field
 * @param pageKey - Page identifier
 * @param fieldKey - Field key (e.g., "heroTitle", "intro")
 * @returns Full content key (e.g., "content.home.heroTitle")
 */
export function getContentKey(
  pageKey: PageIdentifier,
  fieldKey: string
): string {
  return `${getContentPrefix(pageKey)}.${fieldKey}`;
}

/**
 * Helper function to get a SEO key for a specific page and field
 * @param pageKey - Page identifier
 * @param fieldKey - Field key ("title" or "description")
 * @returns Full SEO key (e.g., "seo.home.title")
 */
export function getSeoKey(
  pageKey: PageIdentifier,
  fieldKey: "title" | "description"
): string {
  return `${getSeoPrefix(pageKey)}.${fieldKey}`;
}
