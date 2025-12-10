/**
 * API Route: /api/datasets/[id]
 * 
 * GET /api/datasets/[id]
 * - Returns: Dataset (single dataset by ID)
 * 
 * PUT /api/datasets/[id]
 * - Body: Partial<UpdateDatasetRequest>
 * - Returns: Dataset (updated dataset)
 * 
 * DELETE /api/datasets/[id]
 * - Returns: { message: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";

/**
 * Helper function to parse JSON string to array
 */
function parseJsonArray(jsonString: string | null | undefined): string[] | null {
  if (!jsonString) return null;
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Helper function to format Prisma Dataset to frontend Dataset
 */
function formatDataset(prismaDataset: {
  id: string;
  name: string;
  description: string | null;
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  tags: string | null;
  isPublic: boolean;
  downloadCount: number;
  uploadedBy: string;
  source: string;
  eventId: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: prismaDataset.id,
    name: prismaDataset.name,
    description: prismaDataset.description,
    category: prismaDataset.category,
    fileUrl: prismaDataset.fileUrl,
    fileName: prismaDataset.fileName,
    fileSize: prismaDataset.fileSize,
    fileType: prismaDataset.fileType,
    tags: parseJsonArray(prismaDataset.tags),
    isPublic: prismaDataset.isPublic,
    downloadCount: prismaDataset.downloadCount,
    createdAt: prismaDataset.createdAt.toISOString(),
    updatedAt: prismaDataset.updatedAt.toISOString(),
    uploadedBy: prismaDataset.uploadedBy,
    source: prismaDataset.source,
    eventId: prismaDataset.eventId,
  };
}

// GET - Tek veri seti getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const dataset = await prisma.dataset.findUnique({
      where: { id },
    });
    
    if (!dataset) {
      return NextResponse.json(
        { error: 'Veri seti bulunamadı' },
        { status: 404 }
      );
    }
    
    const formattedDataset = formatDataset(dataset);
    return NextResponse.json(formattedDataset);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][DATASETS][GET_BY_ID]", error);
    console.error("[ERROR][API][DATASETS][GET_BY_ID] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Veri seti yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// PUT - Veri seti güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprint 6: Datasets CRUD requires ADMIN or SUPER_ADMIN
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const { id } = await params;
    const body = await request.json();

    // Prepare update data
    const updateData: any = {};
    
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.fileUrl !== undefined) updateData.fileUrl = body.fileUrl;
    if (body.fileName !== undefined) updateData.fileName = body.fileName;
    if (body.fileSize !== undefined) updateData.fileSize = body.fileSize;
    if (body.fileType !== undefined) updateData.fileType = body.fileType;
    if (body.tags !== undefined) {
      updateData.tags = body.tags && Array.isArray(body.tags) ? JSON.stringify(body.tags) : null;
    }
    if (body.isPublic !== undefined) updateData.isPublic = body.isPublic;
    if (body.downloadCount !== undefined) updateData.downloadCount = body.downloadCount;
    if (body.uploadedBy !== undefined) updateData.uploadedBy = body.uploadedBy;
    if (body.source !== undefined) updateData.source = body.source;
    if (body.eventId !== undefined) updateData.eventId = body.eventId || null;

    const updatedDataset = await prisma.dataset.update({
      where: { id },
      data: updateData,
    });
    
    const formattedDataset = formatDataset(updatedDataset);
    return NextResponse.json(formattedDataset);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    // Prisma error handling
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      // Record not found
      return NextResponse.json(
        { error: 'Veri seti bulunamadı' },
        { status: 404 }
      );
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][DATASETS][UPDATE]", error);
    console.error("[ERROR][API][DATASETS][UPDATE] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Veri seti güncellenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// DELETE - Veri seti sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprint 6: Datasets CRUD requires ADMIN or SUPER_ADMIN
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const { id } = await params;
    
    await prisma.dataset.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Veri seti başarıyla silindi' });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }
    
    // Prisma error handling
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      // Record not found
      return NextResponse.json(
        { error: 'Veri seti bulunamadı' },
        { status: 404 }
      );
    }

    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("[ERROR][API][DATASETS][DELETE]", error);
    console.error("[ERROR][API][DATASETS][DELETE] Details:", errorDetails);

    return NextResponse.json(
      {
        error: "Veri seti silinirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
