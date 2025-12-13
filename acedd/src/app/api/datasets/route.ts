/**
 * API Route: /api/datasets
 * 
 * GET /api/datasets
 * - Returns: Dataset[] (array of datasets, sorted by createdAt desc)
 * 
 * POST /api/datasets
 * - Body: CreateDatasetRequest
 * - Returns: Dataset (created dataset)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole, createAuthErrorResponse } from "@/lib/auth/adminAuth";
import { logErrorSecurely } from "@/lib/utils/secureLogging";

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

// GET - Tüm datasets'ları getir
export async function GET() {
  try {
    const datasets = await prisma.dataset.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedDatasets = datasets.map(formatDataset);
    
    return NextResponse.json(formattedDatasets);
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][DATASETS][GET]", error);

    return NextResponse.json(
      {
        error: "Veri setleri yüklenirken bir hata oluştu",
        message: "Lütfen daha sonra tekrar deneyin",
      },
      { status: 500 }
    );
  }
}

// POST - Yeni dataset oluştur
export async function POST(request: NextRequest) {
  try {
    // Sprint 6: Datasets CRUD requires ADMIN or SUPER_ADMIN
    requireRole(request, ["SUPER_ADMIN", "ADMIN"]);
    
    const body = await request.json();

    // Validation
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'İsim zorunludur' },
        { status: 400 }
      );
    }

    if (!body.fileUrl || typeof body.fileUrl !== 'string') {
      return NextResponse.json(
        { error: 'Dosya URL zorunludur' },
        { status: 400 }
      );
    }

    // Create dataset
    const dataset = await prisma.dataset.create({
      data: {
        name: body.name.trim(),
        description: body.description || null,
        category: body.category || 'Görsel',
        fileUrl: body.fileUrl,
        fileName: body.fileName || 'unknown',
        fileSize: body.fileSize || 0,
        fileType: body.fileType || 'image/jpeg',
        tags: body.tags && Array.isArray(body.tags) ? JSON.stringify(body.tags) : null,
        isPublic: body.isPublic ?? true,
        downloadCount: 0,
        uploadedBy: body.uploadedBy || 'Admin',
        source: body.source || 'manual',
        eventId: body.eventId || null,
      },
    });

    const formattedDataset = formatDataset(dataset);
    
    return NextResponse.json(formattedDataset, { status: 201 });
  } catch (error) {
    // Auth error handling
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return createAuthErrorResponse(error.message);
    }

    logErrorSecurely("[ERROR][API][DATASETS][CREATE]", error);

    return NextResponse.json(
      {
        error: "Veri seti kaydedilirken bir hata oluştu",
        message: "Lütfen bilgilerinizi kontrol edip tekrar deneyin",
      },
      { status: 500 }
    );
  }
}
