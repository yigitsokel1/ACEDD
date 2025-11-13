import { NextRequest, NextResponse } from 'next/server';
import { getMembershipApplicationsCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Belirli bir başvuruyu getir
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    const collection = await getMembershipApplicationsCollection();
    const application = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // MongoDB'nin _id'sini id'ye dönüştür
    const formattedApplication = {
      ...application,
      id: application._id.toString(),
      _id: undefined
    };
    
    return NextResponse.json(formattedApplication);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// PUT - Başvuru durumunu güncelle (onay/red)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    const { status, notes, reviewedBy } = await request.json();
    
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      );
    }

    const collection = await getMembershipApplicationsCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          status,
          notes,
          reviewedBy,
          reviewedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'No changes made' },
        { status: 400 }
      );
    }

    // Güncellenmiş başvuruyu getir
    const updatedApplication = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!updatedApplication) {
      return NextResponse.json(
        { error: 'Application not found after update' },
        { status: 404 }
      );
    }
    
    const formattedApplication = {
      ...updatedApplication,
      id: updatedApplication._id.toString(),
      _id: undefined
    };
    
    return NextResponse.json(formattedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

// DELETE - Başvuruyu sil
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    const collection = await getMembershipApplicationsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
