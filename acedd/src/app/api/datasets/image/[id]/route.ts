import { NextRequest, NextResponse } from 'next/server';
import { getEventImagesCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Event images koleksiyonundan görsel getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await getEventImagesCollection();
    
    // Önce id field'ı ile arama yap
    let eventImage = await collection.findOne({ id });
    
    // Bulunamazsa _id ile arama yap
    if (!eventImage) {
      try {
        eventImage = await collection.findOne({ _id: new ObjectId(id) });
      } catch (objectIdError) {
        // ObjectId geçersizse hata döndür
        return NextResponse.json(
          { error: 'Invalid image ID format' },
          { status: 400 }
        );
      }
    }
    
    if (!eventImage) {
      return NextResponse.json(
        { error: 'Event image not found' },
        { status: 404 }
      );
    }
    
    // Base64 data URL'i döndür
    return NextResponse.json({
      id: eventImage.id || eventImage._id.toString(),
      fileUrl: eventImage.fileUrl,
      fileName: eventImage.fileName,
      fileType: eventImage.fileType
    });
  } catch (error) {
    console.error('Error fetching event image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event image' },
      { status: 500 }
    );
  }
}
