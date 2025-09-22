import { NextRequest, NextResponse } from 'next/server';
import { getEventsCollection } from '@/lib/mongodb';
import { Event } from '@/app/(pages)/etkinlikler/constants';

// GET - Tüm etkinlikleri getir
export async function GET() {
  try {
    const collection = await getEventsCollection();
    const events = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    // MongoDB'nin _id'sini id'ye dönüştür
    const formattedEvents = events.map(event => ({
      ...event,
      id: event._id.toString(),
      _id: undefined // _id'yi kaldır
    }));
    
    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Yeni etkinlik oluştur
export async function POST(request: NextRequest) {
  try {
    const eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = await request.json();
    
    const newEvent: Omit<Event, 'id'> = {
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const collection = await getEventsCollection();
    const result = await collection.insertOne(newEvent);
    
    if (result.insertedId) {
      const createdEvent = {
        ...newEvent,
        id: result.insertedId.toString(),
        _id: undefined
      };
      return NextResponse.json(createdEvent, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
