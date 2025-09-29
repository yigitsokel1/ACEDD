import { NextRequest, NextResponse } from 'next/server';
import { getBoardMembersCollection } from '@/lib/mongodb';
import { BoardMember, CreateBoardMemberData } from '@/lib/types/member';

// GET - Tüm yönetim kurulu üyelerini getir
export async function GET() {
  try {
    const collection = await getBoardMembersCollection();
    const boardMembers = await collection.find({}).sort({ order: 1, createdAt: 1 }).toArray();
    
    // MongoDB'nin _id'sini id'ye dönüştür
    const formattedBoardMembers = boardMembers.map(boardMember => ({
      ...boardMember,
      id: boardMember._id.toString(),
      _id: undefined // _id'yi kaldır
    }));
    
    return NextResponse.json(formattedBoardMembers);
  } catch (error) {
    console.error('Error fetching board members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch board members' },
      { status: 500 }
    );
  }
}

// POST - Yeni yönetim kurulu üyesi oluştur
export async function POST(request: NextRequest) {
  try {
    const boardMemberData: CreateBoardMemberData = await request.json();
    
    const newBoardMember: Omit<BoardMember, 'id'> = {
      ...boardMemberData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const collection = await getBoardMembersCollection();
    const result = await collection.insertOne(newBoardMember);
    
    if (result.insertedId) {
      const createdBoardMember = {
        ...newBoardMember,
        id: result.insertedId.toString(),
        _id: undefined
      };
      return NextResponse.json(createdBoardMember, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Failed to create board member' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating board member:', error);
    return NextResponse.json(
      { error: 'Failed to create board member' },
      { status: 500 }
    );
  }
}
