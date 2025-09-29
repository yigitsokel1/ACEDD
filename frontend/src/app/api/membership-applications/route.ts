import { NextRequest, NextResponse } from 'next/server';
import { getMembershipApplicationsCollection } from '@/lib/mongodb';
import { MembershipApplication, CreateApplicationData } from '@/lib/types/member';

// GET - Tüm başvuruları getir
export async function GET() {
  try {
    const collection = await getMembershipApplicationsCollection();
    const applications = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    // MongoDB'nin _id'sini id'ye dönüştür
    const formattedApplications = applications.map(application => ({
      ...application,
      id: application._id.toString(),
      _id: undefined // _id'yi kaldır
    }));
    
    return NextResponse.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching membership applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch membership applications' },
      { status: 500 }
    );
  }
}

// POST - Yeni başvuru oluştur
export async function POST(request: NextRequest) {
  try {
    const applicationData: CreateApplicationData = await request.json();
    
    const newApplication: Omit<MembershipApplication, 'id'> = {
      ...applicationData,
      status: 'pending',
      applicationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const collection = await getMembershipApplicationsCollection();
    const result = await collection.insertOne(newApplication);
    
    if (result.insertedId) {
      const createdApplication = {
        ...newApplication,
        id: result.insertedId.toString(),
        _id: undefined
      };
      return NextResponse.json(createdApplication, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Failed to create membership application' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating membership application:', error);
    return NextResponse.json(
      { error: 'Failed to create membership application' },
      { status: 500 }
    );
  }
}
