import { NextRequest, NextResponse } from 'next/server';
import { getEventImagesCollection } from '@/lib/mongodb';

export interface Dataset {
  id: string;
  name: string;
  description: string;
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  tags: string[];
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  uploadedBy: string;
  source?: string;
  eventId?: string;
}

// GET - Tüm event images'ları getir
export async function GET() {
  try {
    const collection = await getEventImagesCollection();
    const eventImages = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(eventImages);
  } catch (error) {
    console.error('Error fetching event images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event images' },
      { status: 500 }
    );
  }
}

// POST - Yeni event image oluştur
export async function POST(request: NextRequest) {
  try {
    const eventImageData: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'> = await request.json();
    
    const newEventImage: Dataset = {
      ...eventImageData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadCount: 0,
    };

    const collection = await getEventImagesCollection();
    const result = await collection.insertOne(newEventImage);
    
    if (result.insertedId) {
      return NextResponse.json(newEventImage, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Failed to create event image' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating event image:', error);
    return NextResponse.json(
      { error: 'Failed to create event image' },
      { status: 500 }
    );
  }
}
