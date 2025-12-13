/**
 * API Route: /api/upload
 * 
 * POST /api/upload
 * - Body: FormData with 'file' field(s)
 * - Returns: { success: true, datasetIds: string[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { FILE_SOURCE } from "@/modules/files/constants";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

export async function POST(request: NextRequest) {
  try {
    // Sprint 14.7: Upload requires ADMIN or SUPER_ADMIN (admin panelinde kullanılıyor)
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const data = await request.formData();
    const files = data.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedDatasetIds: string[] = [];

    for (const file of files) {
      // Sprint 17: PDF ve image dosyalarını destekle
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      
      if (!isImage && !isPdf) {
        return NextResponse.json({ error: 'Sadece görsel (image) veya PDF dosyaları yüklenebilir' }, { status: 400 });
      }

      // Dosya boyutunu kontrol et (PDF için 10MB, image için 5MB limit)
      const maxSize = isPdf ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
      const maxSizeMB = isPdf ? 10 : 5;
      if (file.size > maxSize) {
        return NextResponse.json({ error: `Dosya boyutu ${maxSizeMB}MB'dan küçük olmalıdır` }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Base64'e çevir
      const base64String = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64String}`;

      // Dosya türüne göre kategori ve metadata belirle
      let category = 'Diğer';
      let tags: string[] = [];
      let source = 'upload';
      let name = file.name.split('.')[0];
      
      if (isImage) {
        category = 'Görsel';
        tags = ['görsel', 'etkinlik', 'eğitim', 'fotoğraf'];
        source = FILE_SOURCE.EVENT_UPLOAD;
        name = `Etkinlik Görseli - ${name}`;
      } else if (isPdf) {
        category = 'Belge';
        tags = ['pdf', 'belge', 'cv', 'döküman'];
        source = FILE_SOURCE.MEMBER_CV;
        name = `CV - ${name}`;
      }

      // Prisma ile dataset oluştur
      try {
        // Type assertion to bypass TypeScript error until TS server cache is cleared
        const dataset = await (prisma as any).dataset.create({
          data: {
            name: name,
            description: `${category} için yüklenen dosya: ${file.name}. Dosya boyutu: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
            category: category,
            fileUrl: dataUrl, // Base64 data URL
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            tags: JSON.stringify(tags), // JSON string olarak sakla
            isPublic: true,
            downloadCount: 0,
            uploadedBy: 'Admin',
            source: source,
            eventId: null, // İlişkili ID'ler daha sonra güncellenebilir
          },
        });

        uploadedDatasetIds.push(dataset.id);
      } catch (dbError) {
        logErrorSecurely("[ERROR][API][UPLOAD][CREATE_DATASET]", dbError);
        return NextResponse.json(
          { error: "Dosya kaydedilirken bir hata oluştu" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      datasetIds: uploadedDatasetIds
    });

  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][UPLOAD][POST]", error);

    return NextResponse.json(
      {
        error: "Dosya yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
