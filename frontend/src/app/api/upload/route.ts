import { NextRequest, NextResponse } from 'next/server';
import { getEventImagesCollection } from '@/lib/mongodb';

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

      // Benzersiz ID oluştur
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const datasetId = `${timestamp}-${randomString}`;

      // Yüklenen görseli event_images koleksiyonuna ekle
      try {
        const eventImagesCollection = await getEventImagesCollection();
        
        // Dosya türüne göre kategori belirle
        let category = 'Etkinlik';
        let tags = ['etkinlik', 'görsel', 'eğitim'];
        
        if (file.type.includes('image/')) {
          category = 'Görsel';
          tags = ['görsel', 'etkinlik', 'eğitim', 'fotoğraf'];
        }
        
        const datasetEntry = {
          id: datasetId,
          name: `Etkinlik Görseli - ${file.name.split('.')[0]}`,
          description: `Etkinlik için yüklenen görsel dosyası: ${file.name}. Dosya boyutu: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
          category: category,
          fileUrl: dataUrl, // Base64 data URL kullan
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          tags: tags,
          isPublic: true,
          downloadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          uploadedBy: 'Admin',
          source: 'event-upload',
          eventId: null // Etkinlik ID'si daha sonra güncellenebilir
        };

        await eventImagesCollection.insertOne(datasetEntry);
        uploadedDatasetIds.push(datasetId);
        console.log('Görsel event_images koleksiyonuna eklendi:', datasetId);
      } catch (dbError) {
        console.error('Event images koleksiyonuna ekleme hatası:', dbError);
        return NextResponse.json(
          { error: 'Failed to save to event images' },
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
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
