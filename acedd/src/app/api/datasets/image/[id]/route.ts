/**
 * API Route: /api/datasets/image/[id]
 * 
 * GET /api/datasets/image/[id]
 * - Returns: { id: string, fileUrl: string, fileName: string, fileType: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logErrorSecurely } from "@/lib/utils/secureLogging";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Prisma ile dataset'i getir
    const dataset = await prisma.dataset.findUnique({
      where: { id },
    });
    
    if (!dataset) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }
    
    // Validate fileUrl format
    if (!dataset.fileUrl || typeof dataset.fileUrl !== 'string') {
      logErrorSecurely("[ERROR][API][DATASETS][IMAGE][GET_BY_ID] Invalid fileUrl", new Error(`Invalid fileUrl for dataset ${id}`));
      return NextResponse.json(
        { error: 'Invalid file URL in dataset' },
        { status: 500 }
      );
    }
    
    // Check if fileUrl is a valid Base64 data URL
    if (!dataset.fileUrl.startsWith('data:image/') && !dataset.fileUrl.startsWith('data:')) {
      logErrorSecurely("[ERROR][API][DATASETS][IMAGE][GET_BY_ID] Invalid data URL format", new Error(`fileUrl is not a data URL for dataset ${id}`));
      return NextResponse.json(
        { error: 'Invalid file URL format (not a data URL)' },
        { status: 500 }
      );
    }
    
    // Dataset bilgilerini döndür
    return NextResponse.json({
      id: dataset.id,
      fileUrl: dataset.fileUrl,
      fileName: dataset.fileName,
      fileType: dataset.fileType,
    });
  } catch (error) {
    logErrorSecurely("[ERROR][API][DATASETS][IMAGE][GET_BY_ID]", error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dataset',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
