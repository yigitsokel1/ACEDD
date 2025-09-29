import { NextRequest, NextResponse } from 'next/server';
import { getMembersCollection } from '@/lib/mongodb';
import { Member, CreateMemberData } from '@/lib/types/member';

// GET - Tüm üyeleri getir
export async function GET() {
  try {
    const collection = await getMembersCollection();
    const members = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    // MongoDB'nin _id'sini id'ye dönüştür
    const formattedMembers = members.map(member => ({
      ...member,
      id: member._id.toString(),
      _id: undefined // _id'yi kaldır
    }));
    
    return NextResponse.json(formattedMembers);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST - Yeni üye oluştur
export async function POST(request: NextRequest) {
  try {
    const memberData: CreateMemberData = await request.json();
    
    const newMember: Omit<Member, 'id'> = {
      ...memberData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const collection = await getMembersCollection();
    const result = await collection.insertOne(newMember);
    
    if (result.insertedId) {
      const createdMember = {
        ...newMember,
        id: result.insertedId.toString(),
        _id: undefined
      };
      return NextResponse.json(createdMember, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Failed to create member' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
