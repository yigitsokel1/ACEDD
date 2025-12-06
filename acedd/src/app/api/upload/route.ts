/**
 * API Route: /api/upload
 * 
 * POST /api/upload
 * - Body: FormData with 'file' field(s)
 * - Returns: { success: true, datasetIds: string[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files = data.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedDatasetIds: string[] = [];

    for (const file of files) {
      // Dosya türünü kontrol et
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      }

      // Dosya boyutunu kontrol et (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Base64'e çevir
      const base64String = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64String}`;

      // Dosya türüne göre kategori belirle
      let category = 'Etkinlik';
      let tags = ['etkinlik', 'görsel', 'eğitim'];
      
      if (file.type.includes('image/')) {
        category = 'Görsel';
        tags = ['görsel', 'etkinlik', 'eğitim', 'fotoğraf'];
      }

      // Prisma ile dataset oluştur
      try {
        // Type assertion to bypass TypeScript error until TS server cache is cleared
        const dataset = await (prisma as any).dataset.create({
          data: {
            name: `Etkinlik Görseli - ${file.name.split('.')[0]}`,
            description: `Etkinlik için yüklenen görsel dosyası: ${file.name}. Dosya boyutu: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
            category: category,
            fileUrl: dataUrl, // Base64 data URL
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            tags: JSON.stringify(tags), // JSON string olarak sakla
            isPublic: true,
            downloadCount: 0,
            uploadedBy: 'Admin',
            source: 'event-upload',
            eventId: null, // Etkinlik ID'si daha sonra güncellenebilir
          },
        });

        uploadedDatasetIds.push(dataset.id);
        console.log('Görsel Prisma Dataset olarak eklendi:', dataset.id);
      } catch (dbError) {
        console.error('Dataset oluşturma hatası:', dbError);
        return NextResponse.json(
          { error: 'Failed to save dataset' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      datasetIds: uploadedDatasetIds
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload files',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
