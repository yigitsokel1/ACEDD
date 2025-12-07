/**
 * API Route: /api/datasets/image/[id]
 * 
 * GET /api/datasets/image/[id]
 * - Returns: { id: string, fileUrl: string, fileName: string, fileType: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
      console.error(`[Dataset Image API] Invalid fileUrl for dataset ${id}:`, dataset.fileUrl);
      return NextResponse.json(
        { error: 'Invalid file URL in dataset' },
        { status: 500 }
      );
    }
    
    // Log fileUrl format for debugging
    const fileUrlLength = dataset.fileUrl.length;
    const fileUrlPreview = dataset.fileUrl.substring(0, 100);
    const fileUrlEnd = dataset.fileUrl.substring(Math.max(0, fileUrlLength - 50));
    console.log(`[Dataset Image API] Dataset ${id}:`);
    console.log(`  - fileUrl length: ${fileUrlLength} chars`);
    console.log(`  - fileUrl starts with: ${fileUrlPreview}...`);
    console.log(`  - fileUrl ends with: ...${fileUrlEnd}`);
    console.log(`  - fileUrl is data URL: ${dataset.fileUrl.startsWith('data:')}`);
    
    // Check if fileUrl is a valid Base64 data URL
    if (!dataset.fileUrl.startsWith('data:image/') && !dataset.fileUrl.startsWith('data:')) {
      console.error(`[Dataset Image API] fileUrl is not a data URL:`, dataset.fileUrl.substring(0, 200));
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
    console.error('Error fetching dataset:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dataset',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
