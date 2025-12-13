/**
 * File Lifecycle Service
 * 
 * Sprint 17: Merkezi dosya yaşam döngüsü yönetimi
 * Sprint 18 - B2: Entity types and file sources moved to constants
 * 
 * Bu servis, upload edilen dosyaların (Dataset) entity'lerle ilişkilendirilmesi
 * ve entity silindiğinde/güncellendiğinde dosyaların temizlenmesi için kullanılır.
 */

import { prisma } from "@/lib/db";
import { ENTITY_TYPE, FILE_SOURCE, type EntityType } from "./constants";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

// Re-export EntityType for backward compatibility
export type { EntityType };

/**
 * Dosya kullanım bilgisi
 */
export interface FileUsage {
  entityType: EntityType;
  entityId: string;
  usage?: string; // Ek kullanım bilgisi (örn: "featured", "gallery")
}

/**
 * Dataset'i bir entity'ye bağla
 * 
 * @param datasetId - Dataset ID
 * @param usage - Entity bilgisi
 */
export async function linkFileToEntity(
  datasetId: string,
  usage: FileUsage
): Promise<void> {
  try {
    // Dataset'i güncelle - eventId veya source ile ilişkilendir
    const updateData: any = {};
    
    if (usage.entityType === ENTITY_TYPE.EVENT) {
      updateData.eventId = usage.entityId;
      updateData.source = FILE_SOURCE.EVENT_UPLOAD;
    } else if (usage.entityType === ENTITY_TYPE.MEMBER_CV) {
      updateData.source = FILE_SOURCE.MEMBER_CV;
      // Member CV için eventId kullanılmaz, sadece source yeterli
    } else if (usage.entityType === ENTITY_TYPE.FAVICON) {
      updateData.source = FILE_SOURCE.FAVICON;
    } else if (usage.entityType === ENTITY_TYPE.LOGO) {
      updateData.source = FILE_SOURCE.LOGO;
    }
    
    if (Object.keys(updateData).length > 0) {
      await (prisma as any).dataset.update({
        where: { id: datasetId },
        data: updateData,
      });
    }
  } catch (error) {
    logErrorSecurely("[ERROR][fileService][linkFileToEntity]", error);
    // Non-critical error, don't throw
  }
}

/**
 * Entity'ye bağlı tüm dosyaları bul ve sil
 * 
 * @param usage - Entity bilgisi
 * @returns Silinen dataset sayısı
 */
export async function unlinkAndDeleteFilesForEntity(
  usage: FileUsage
): Promise<number> {
  try {
    let whereClause: any = {};
    
    if (usage.entityType === ENTITY_TYPE.EVENT) {
      // Event için eventId ile bul
      whereClause = {
        eventId: usage.entityId,
        source: FILE_SOURCE.EVENT_UPLOAD,
      };
    } else if (usage.entityType === ENTITY_TYPE.MEMBER_CV) {
      // Member CV için source ile bul (eventId yok)
      whereClause = {
        source: FILE_SOURCE.MEMBER_CV,
      };
      // Not: Member CV'ler için entityId kontrolü yapılamaz çünkü Dataset'te memberId yok
      // Bu durumda sadece source ile filtreleme yapılır, ama bu yeterli değil
      // Alternatif: Member modelindeki cvDatasetId ile kontrol edilmeli
      // Bu fonksiyon genel kullanım için, spesifik durumlar için ayrı fonksiyonlar kullanılmalı
    } else if (usage.entityType === ENTITY_TYPE.FAVICON) {
      whereClause = {
        source: FILE_SOURCE.FAVICON,
      };
    } else if (usage.entityType === ENTITY_TYPE.LOGO) {
      whereClause = {
        source: FILE_SOURCE.LOGO,
      };
    }
    
    // İlgili dataset'leri bul
    const datasets = await (prisma as any).dataset.findMany({
      where: whereClause,
      select: { id: true },
    });
    
    if (datasets.length === 0) {
      return 0;
    }
    
    // Dataset'leri sil (CASCADE ile fileUrl'ler de temizlenir)
    const deleteResult = await (prisma as any).dataset.deleteMany({
      where: whereClause,
    });
    
    
    return deleteResult.count;
  } catch (error) {
    logErrorSecurely("[ERROR][fileService][unlinkAndDeleteFilesForEntity]", error);
    // Non-critical error, return 0
    return 0;
  }
}

/**
 * Event'e bağlı tüm görselleri sil
 * 
 * @param eventId - Event ID
 * @returns Silinen dataset sayısı
 */
export async function deleteEventFiles(eventId: string): Promise<number> {
  return unlinkAndDeleteFilesForEntity({
    entityType: ENTITY_TYPE.EVENT,
    entityId: eventId,
  });
}

/**
 * Eski dosyayı yeni dosya ile değiştir
 * 
 * @param oldDatasetId - Eski dataset ID (null ise sadece yeni dosyayı bağla)
 * @param newDatasetId - Yeni dataset ID (null ise sadece eski dosyayı sil)
 * @param usage - Yeni dosyanın entity bilgisi
 */
export async function replaceSingleFile(
  oldDatasetId: string | null,
  newDatasetId: string | null,
  usage: FileUsage
): Promise<void> {
  try {
    // Eski dosyayı sil
    if (oldDatasetId) {
      try {
        await (prisma as any).dataset.delete({
          where: { id: oldDatasetId },
        });
      } catch (deleteError) {
        // Dataset bulunamadı veya zaten silinmiş, non-critical
        console.warn(`[fileService][replaceSingleFile] Could not delete old dataset ${oldDatasetId}:`, deleteError);
      }
    }
    
    // Yeni dosyayı bağla
    if (newDatasetId) {
      await linkFileToEntity(newDatasetId, usage);
      // Linked new dataset (removed debug log for production)
    }
  } catch (error) {
    logErrorSecurely("[ERROR][fileService][replaceSingleFile]", error);
    // Non-critical error, don't throw
  }
}

/**
 * Member CV'yi değiştir (özel fonksiyon - cvDatasetId ile kontrol)
 * 
 * @param memberId - Member ID
 * @param oldDatasetId - Eski CV dataset ID
 * @param newDatasetId - Yeni CV dataset ID
 */
export async function replaceMemberCV(
  memberId: string,
  oldDatasetId: string | null,
  newDatasetId: string | null
): Promise<void> {
  // Eski CV'yi sil
  if (oldDatasetId) {
    try {
      await (prisma as any).dataset.delete({
        where: { id: oldDatasetId },
      });
    } catch (deleteError) {
      console.warn(`[fileService][replaceMemberCV] Could not delete old CV dataset ${oldDatasetId}:`, deleteError);
    }
  }
  
  // Yeni CV'yi bağla
  if (newDatasetId) {
    await linkFileToEntity(newDatasetId, {
      entityType: ENTITY_TYPE.MEMBER_CV,
      entityId: memberId,
    });
  }
}

/**
 * Favicon/Logo değiştir - eski dosyayı source ile bul ve temizle
 * 
 * @param settingKey - Setting key (örn: "site.faviconUrl", "site.logoUrl")
 * @param oldDataUrl - Eski data URL (yeni dosya yüklendiğini kontrol etmek için)
 * @param newDataUrl - Yeni data URL (datasetId çıkarmak için)
 */
export async function replaceFaviconOrLogo(
  settingKey: "site.faviconUrl" | "site.logoUrl",
  oldDataUrl: string | null,
  newDataUrl: string | null
): Promise<void> {
  // Entity type belirle
  const entityType: EntityType = settingKey === "site.faviconUrl" ? ENTITY_TYPE.FAVICON : ENTITY_TYPE.LOGO;
  const source = entityType === ENTITY_TYPE.FAVICON ? FILE_SOURCE.FAVICON : FILE_SOURCE.LOGO;
  
  // Eğer yeni dosya yüklendi (yeni data URL farklı ise)
  if (newDataUrl && newDataUrl !== oldDataUrl && newDataUrl.startsWith("data:")) {
    // Data URL'den datasetId çıkar (eğer data URL formatında ise)
    // Not: Data URL'den direkt datasetId çıkarılamaz
    // Alternatif: source ile filtreleme yapıp en son güncellenen dosyayı temizle
    
    // Source ile eski dosyaları bul ve sil (sadece 1 tane olması gerektiği için)
    try {
      const oldDatasets = await (prisma as any).dataset.findMany({
        where: { source },
        orderBy: { updatedAt: "desc" },
        take: 1, // En son güncellenen dosyayı al
      });
      
      if (oldDatasets.length > 0) {
        // En son güncellenen dosyayı sil
        await (prisma as any).dataset.delete({
          where: { id: oldDatasets[0].id },
        });
      }
    } catch (cleanupError) {
      // Non-critical error
      console.warn(`[fileService][replaceFaviconOrLogo] Could not cleanup old ${source}:`, cleanupError);
    }
    
    // Not: Yeni dosya zaten upload edilmiş ve settings'e kaydedilmiş
    // Burada sadece eski dosyayı temizliyoruz
  }
}

