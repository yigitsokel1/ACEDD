import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Dataset } from '../route';

// GET - Tek veri seti getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const collection = db.collection('datasets');
    const dataset = await collection.findOne({ id: params.id });
    
    if (!dataset) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(dataset);
  } catch (error) {
    console.error('Error fetching dataset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dataset' },
      { status: 500 }
    );
  }
}

// PUT - Veri seti güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updateData: Partial<Dataset> = await request.json();
    const updatedDataset = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const db = await getDatabase();
    const collection = db.collection('datasets');
    const result = await collection.updateOne(
      { id: params.id },
      { $set: updatedDataset }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }
    
    if (result.modifiedCount > 0) {
      const updatedDataset = await collection.findOne({ id: params.id });
      return NextResponse.json(updatedDataset);
    } else {
      return NextResponse.json(
        { error: 'Failed to update dataset' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating dataset:', error);
    return NextResponse.json(
      { error: 'Failed to update dataset' },
      { status: 500 }
    );
  }
}

// DELETE - Veri seti sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const collection = db.collection('datasets');
    const result = await collection.deleteOne({ id: params.id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    console.error('Error deleting dataset:', error);
    return NextResponse.json(
      { error: 'Failed to delete dataset' },
      { status: 500 }
    );
  }
}
