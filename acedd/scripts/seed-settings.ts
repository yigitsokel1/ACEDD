/**
 * Seed Default Settings to Database
 * 
 * Bu script defaultContent.ts'deki tüm içeriği database'e yükler
 * 
 * Kullanım:
 *   npm run seed:settings
 * 
 * Güvenli:
 *   - Mevcut ayarları override etmez (sadece yoksa ekler)
 *   - --force flag ile tüm ayarlar sıfırlanabilir
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { 
  DEFAULT_PAGE_CONTENT,
  DEFAULT_SITE_INFO,
  DEFAULT_CONTACT_INFO,
  DEFAULT_SOCIAL_MEDIA,
  DEFAULT_SEO,
} from "../src/lib/constants/defaultContent";
import { getContentKey } from "../src/lib/settings/keys";
import type { PageIdentifier } from "../src/lib/types/setting";

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create adapter and client (same pattern as db.ts)
const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

const SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000001"; // System user for seeding

interface SeedOptions {
  force?: boolean; // Override existing settings
  pages?: PageIdentifier[]; // Only seed specific pages
  verbose?: boolean; // Detailed logging
}

/**
 * Flatten nested object to dot notation
 * Example: { home: { heroTitle: "..." } } → { "content.home.heroTitle": "..." }
 * 
 * Special cases (don't flatten):
 * - missionVision: Keep as nested object { mission: {...}, vision: {...} }
 * - stats, missions, activities, etc.: Keep as arrays
 */
function flattenObject(obj: any, prefix = ""): Record<string, any> {
  const flattened: Record<string, any> = {};
  
  for (const key in obj) {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (value === null || value === undefined) {
      continue;
    }
    
    // Special case: missionVision should stay as nested object
    if (key === "missionVision" && typeof value === "object" && !Array.isArray(value)) {
      flattened[fullKey] = value;
      continue;
    }
    
    // If primitive or array, store directly
    if (typeof value !== "object" || Array.isArray(value)) {
      flattened[fullKey] = value;
    } else {
      // If object, recursively flatten
      Object.assign(flattened, flattenObject(value, fullKey));
    }
  }
  
  return flattened;
}

/**
 * Seed settings for a specific page
 */
async function seedPageSettings(
  pageKey: PageIdentifier, 
  pageContent: any,
  options: SeedOptions
): Promise<{ created: number; updated: number; skipped: number }> {
  const stats = { created: 0, updated: 0, skipped: 0 };
  
  // Flatten page content
  const flattened = flattenObject(pageContent);
  
  for (const fieldKey in flattened) {
    const fullKey = getContentKey(pageKey, fieldKey);
    const value = flattened[fieldKey];
    
    try {
      // Check if setting already exists
      const existing = await prisma.setting.findUnique({
        where: { key: fullKey }
      });
      
      if (existing && !options.force) {
        stats.skipped++;
        if (options.verbose) {
          console.log(`  ⏭️  Skipped: ${fullKey} (already exists)`);
        }
        continue;
      }
      
      if (existing && options.force) {
        // Update existing
        await prisma.setting.update({
          where: { key: fullKey },
          data: {
            value: value,
            updatedBy: SYSTEM_USER_ID,
          }
        });
        stats.updated++;
        if (options.verbose) {
          console.log(`  ✏️  Updated: ${fullKey}`);
        }
      } else {
        // Create new
        await prisma.setting.create({
          data: {
            key: fullKey,
            value: value,
            updatedBy: SYSTEM_USER_ID,
          }
        });
        stats.created++;
        if (options.verbose) {
          console.log(`  ✅ Created: ${fullKey}`);
        }
      }
    } catch (error) {
      console.error(`  ❌ Error seeding ${fullKey}:`, error);
    }
  }
  
  return stats;
}

/**
 * Seed simple key-value settings
 */
async function seedSimpleSettings(
  settings: Record<string, any>,
  category: string,
  options: SeedOptions = {}
) {
  let stats = { created: 0, updated: 0, skipped: 0 };
  
  for (const [key, value] of Object.entries(settings)) {
    const existing = await prisma.setting.findUnique({ where: { key } });
    
    if (existing && !options.force) {
      stats.skipped++;
      if (options.verbose) {
        console.log(`      ⏭️  Skipped: ${key}`);
      }
      continue;
    }
    
    await prisma.setting.upsert({
      where: { key },
      create: {
        key,
        value,
        updatedBy: SYSTEM_USER_ID,
      },
      update: {
        value,
        updatedBy: SYSTEM_USER_ID,
        updatedAt: new Date(),
      },
    });
    
    if (existing) {
      stats.updated++;
      if (options.verbose) {
        console.log(`      ✏️  Updated: ${key}`);
      }
    } else {
      stats.created++;
      if (options.verbose) {
        console.log(`      ✅ Created: ${key}`);
      }
    }
  }
  
  return stats;
}

/**
 * Main seed function
 */
async function seedSettings(options: SeedOptions = {}) {
  console.log("🌱 Starting settings seed...\n");
  
  const totalStats = { created: 0, updated: 0, skipped: 0 };
  
  // 1. Seed Site Info
  console.log("🏢 Seeding Site Info...");
  const siteStats = await seedSimpleSettings(DEFAULT_SITE_INFO, "site", options);
  totalStats.created += siteStats.created;
  totalStats.updated += siteStats.updated;
  totalStats.skipped += siteStats.skipped;
  console.log(`   Created: ${siteStats.created}, Updated: ${siteStats.updated}, Skipped: ${siteStats.skipped}\n`);
  
  // 2. Seed Contact Info
  console.log("📞 Seeding Contact Info...");
  const contactStats = await seedSimpleSettings(DEFAULT_CONTACT_INFO, "contact", options);
  totalStats.created += contactStats.created;
  totalStats.updated += contactStats.updated;
  totalStats.skipped += contactStats.skipped;
  console.log(`   Created: ${contactStats.created}, Updated: ${contactStats.updated}, Skipped: ${contactStats.skipped}\n`);
  
  // 3. Seed Social Media
  console.log("🌐 Seeding Social Media...");
  const socialStats = await seedSimpleSettings(DEFAULT_SOCIAL_MEDIA, "social", options);
  totalStats.created += socialStats.created;
  totalStats.updated += socialStats.updated;
  totalStats.skipped += socialStats.skipped;
  console.log(`   Created: ${socialStats.created}, Updated: ${socialStats.updated}, Skipped: ${socialStats.skipped}\n`);
  
  // 4. Seed SEO
  console.log("🔍 Seeding SEO...");
  const seoStats = await seedSimpleSettings(DEFAULT_SEO, "seo", options);
  totalStats.created += seoStats.created;
  totalStats.updated += seoStats.updated;
  totalStats.skipped += seoStats.skipped;
  console.log(`   Created: ${seoStats.created}, Updated: ${seoStats.updated}, Skipped: ${seoStats.skipped}\n`);
  
  // 5. Seed Page Content
  console.log("📄 Seeding Page Content...\n");
  const pagesToSeed = options.pages || Object.keys(DEFAULT_PAGE_CONTENT) as PageIdentifier[];
  
  for (const pageKey of pagesToSeed) {
    const pageContent = DEFAULT_PAGE_CONTENT[pageKey];
    if (!pageContent) {
      console.log(`   ⚠️  Warning: No default content for page "${pageKey}"\n`);
      continue;
    }
    
    console.log(`   📄 ${pageKey}`);
    const stats = await seedPageSettings(pageKey, pageContent, options);
    
    totalStats.created += stats.created;
    totalStats.updated += stats.updated;
    totalStats.skipped += stats.skipped;
    
    console.log(`      Created: ${stats.created}, Updated: ${stats.updated}, Skipped: ${stats.skipped}`);
  }
  
  console.log("\n✅ Seed completed!");
  console.log(`📊 Total: ${totalStats.created} created, ${totalStats.updated} updated, ${totalStats.skipped} skipped\n`);
}

/**
 * Parse CLI arguments
 */
function parseArgs(): SeedOptions {
  const args = process.argv.slice(2);
  const options: SeedOptions = {
    force: args.includes('--force'),
    verbose: args.includes('--verbose') || args.includes('-v'),
  };
  
  const pagesArg = args.find(arg => arg.startsWith('--pages='));
  if (pagesArg) {
    options.pages = pagesArg.split('=')[1].split(',') as PageIdentifier[];
  }
  
  return options;
}

/**
 * Run script
 */
async function main() {
  try {
    const options = parseArgs();
    
    console.log("⚙️  Options:", options, "\n");
    
    if (options.force) {
      console.log("⚠️  WARNING: --force flag detected. Existing settings will be overwritten!\n");
    }
    
    await seedSettings(options);
    
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

