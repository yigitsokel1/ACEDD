import { NextRequest, NextResponse } from 'next/server';
import { getMembersCollection } from '@/lib/mongodb';
import { UpdateMemberData } from '@/lib/types/member';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Belirli bir üyeyi getir
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid member ID' },
        { status: 400 }
      );
    }

    const collection = await getMembersCollection();
    const member = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // MongoDB'nin _id'sini id'ye dönüştür
    const formattedMember = {
      ...member,
      id: member._id.toString(),
      _id: undefined
    };
    
    return NextResponse.json(formattedMember);
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}

// PUT - Üye bilgilerini güncelle
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid member ID' },
        { status: 400 }
      );
    }

    const updateData: UpdateMemberData = await request.json();
    
    const collection = await getMembersCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'No changes made' },
        { status: 400 }
      );
    }

    // Güncellenmiş üyeyi getir
    const updatedMember = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!updatedMember) {
      return NextResponse.json(
        { error: 'Member not found after update' },
        { status: 404 }
      );
    }
    
    const formattedMember = {
      ...updatedMember,
      id: updatedMember._id.toString(),
      _id: undefined
    };
    
    return NextResponse.json(formattedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

// DELETE - Üyeyi sil
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid member ID' },
        { status: 400 }
      );
    }

    const collection = await getMembersCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
