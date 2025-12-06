import { NextRequest, NextResponse } from 'next/server';
import { getBoardMembersCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Belirli bir yönetim kurulu üyesini getir
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid board member ID' },
        { status: 400 }
      );
    }

    const collection = await getBoardMembersCollection();
    const boardMember = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!boardMember) {
      return NextResponse.json(
        { error: 'Board member not found' },
        { status: 404 }
      );
    }

    // MongoDB'nin _id'sini id'ye dönüştür
    const formattedBoardMember = {
      ...boardMember,
      id: boardMember._id.toString(),
      _id: undefined
    };
    
    return NextResponse.json(formattedBoardMember);
  } catch (error) {
    console.error('Error fetching board member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch board member' },
      { status: 500 }
    );
  }
}

// PUT - Yönetim kurulu üyesi bilgilerini güncelle
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid board member ID' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    
    const collection = await getBoardMembersCollection();
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
        { error: 'Board member not found' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'No changes made' },
        { status: 400 }
      );
    }

    // Güncellenmiş yönetim kurulu üyesini getir
    const updatedBoardMember = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!updatedBoardMember) {
      return NextResponse.json(
        { error: 'Board member not found after update' },
        { status: 404 }
      );
    }
    
    const formattedBoardMember = {
      ...updatedBoardMember,
      id: updatedBoardMember._id.toString(),
      _id: undefined
    };
    
    return NextResponse.json(formattedBoardMember);
  } catch (error) {
    console.error('Error updating board member:', error);
    return NextResponse.json(
      { error: 'Failed to update board member' },
      { status: 500 }
    );
  }
}

// DELETE - Yönetim kurulu üyesini sil
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid board member ID' },
        { status: 400 }
      );
    }

    const collection = await getBoardMembersCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Board member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Board member deleted successfully' });
  } catch (error) {
    console.error('Error deleting board member:', error);
    return NextResponse.json(
      { error: 'Failed to delete board member' },
      { status: 500 }
    );
  }
}
