/**
 * API Route: /api/download/cv/[datasetId]
 * 
 * GET /api/download/cv/[datasetId]
 * - Returns: PDF file as binary stream with appropriate headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logErrorSecurely } from "@/lib/utils/secureLogging";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ datasetId: string }> }
) {
  try {
    const { datasetId } = await params;
    
    // Prisma ile dataset'i getir
    const dataset = await (prisma as any).dataset.findUnique({
      where: { id: datasetId },
    });
    
    if (!dataset) {
      return NextResponse.json(
        { error: 'CV bulunamadı' },
        { status: 404 }
      );
    }
    
    // Sadece PDF dosyalarını serve et (Sprint 18 B5: MIME güvenliği)
    if (dataset.fileType !== 'application/pdf' || !dataset.fileType.startsWith('application/pdf')) {
      return NextResponse.json(
        { error: 'Bu dosya bir PDF değil' },
        { status: 400 }
      );
    }
    
    // Base64 data URL'den base64 string'i çıkar
    // Sprint 17: Base64 string'deki whitespace ve geçersiz karakterleri temizle
    let base64Data: string;
    if (dataset.fileUrl.startsWith('data:application/pdf;base64,')) {
      base64Data = dataset.fileUrl.replace(/^data:application\/pdf;base64,/, '');
    } else if (dataset.fileUrl.startsWith('data:')) {
      // Genel data URL formatı (base64 olmayan durumlar için)
      const match = dataset.fileUrl.match(/^data:[^;]+;base64,(.+)$/);
      if (!match || !match[1]) {
        return NextResponse.json(
          { error: 'Geçersiz base64 formatı' },
          { status: 500 }
        );
      }
      base64Data = match[1];
    } else {
      return NextResponse.json(
        { error: 'Geçersiz CV dosyası formatı' },
        { status: 500 }
      );
    }
    
    // Base64 string'deki whitespace karakterlerini temizle (space, newline, tab, vb.)
    base64Data = base64Data.replace(/\s+/g, '');
    
    // Base64 validation: sadece geçerli base64 karakterler olmalı
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
      return NextResponse.json(
        { error: 'Geçersiz base64 karakterler içeriyor' },
        { status: 500 }
      );
    }
    
    try {
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      
      // PDF dosyasını response olarak döndür
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(dataset.fileName || 'cv.pdf')}"`,
          'Content-Length': pdfBuffer.length.toString(),
          'Cache-Control': 'public, max-age=3600', // 1 saat cache
        },
      });
    } catch (decodeError) {
      logErrorSecurely("[ERROR][API][DOWNLOAD][CV][DECODE]", decodeError);
      return NextResponse.json(
        { 
          error: 'CV decode edilirken bir hata oluştu',
          message: decodeError instanceof Error ? decodeError.message : 'Unknown decode error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    logErrorSecurely("[ERROR][API][DOWNLOAD][CV]", error);
    return NextResponse.json(
      { 
        error: 'CV indirilirken bir hata oluştu',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
