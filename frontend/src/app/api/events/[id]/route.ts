import { NextRequest, NextResponse } from 'next/server';
import { getEventsCollection } from '@/lib/mongodb';
import { Event } from '@/app/(pages)/etkinlikler/constants';

// GET - Tek etkinlik getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await getEventsCollection();
    
    // MongoDB'de _id ile ara
    const { ObjectId } = require('mongodb');
    let event;
    
    try {
      event = await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid event ID format' },
        { status: 400 }
      );
    }
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    const formattedEvent = {
      ...event,
      id: event._id.toString(),
      _id: undefined
    };
    
    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Etkinlik güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData: Partial<Event> = await request.json();
    const updatedEvent = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const collection = await getEventsCollection();
    
    // MongoDB'de _id ile ara (id field'ı yok, sadece _id var)
    const { ObjectId } = require('mongodb');
    let event;
    
    try {
      event = await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid event ID format' },
        { status: 400 }
      );
    }
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // MongoDB'de _id ile güncelle
    const result = await collection.updateOne(
      { _id: event._id },
      { $set: updatedEvent }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (result.modifiedCount > 0) {
      const updatedEvent = await collection.findOne({ _id: event._id });
      if (updatedEvent) {
        const formattedEvent = {
          ...updatedEvent,
          id: updatedEvent._id.toString(),
          _id: undefined
        };
        return NextResponse.json(formattedEvent);
      } else {
        return NextResponse.json(
          { error: 'Event not found after update' },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Etkinlik sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await getEventsCollection();
    
    // MongoDB'de _id ile ara
    const { ObjectId } = require('mongodb');
    let event;
    
    try {
      event = await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid event ID format' },
        { status: 400 }
      );
    }
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // MongoDB'de _id ile sil
    const result = await collection.deleteOne({ _id: event._id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
