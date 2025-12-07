import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Dynamic Favicon API Route
 * 
 * Returns the favicon from settings as an image response
 * Next.js will automatically use this for /favicon.ico requests
 */
export async function GET(request: NextRequest) {
  try {
    // Get favicon URL and updatedAt timestamp for cache busting
    const faviconSetting = await prisma.setting.findUnique({
      where: { key: 'site.faviconUrl' },
      select: { value: true, updatedAt: true },
    });

    const faviconUrl = faviconSetting?.value && typeof faviconSetting.value === 'string' 
      ? faviconSetting.value 
      : null;
    
    // If no favicon is set, return 404 (Next.js will use default)
    if (!faviconUrl || !faviconUrl.trim()) {
      return new NextResponse(null, { status: 404 });
    }

    // If it's a data URL, extract the base64 data and return as image
    if (faviconUrl.startsWith('data:')) {
      const matches = faviconUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Use updatedAt timestamp for ETag (cache validation)
        const etag = faviconSetting?.updatedAt 
          ? `"${faviconSetting.updatedAt.getTime()}"` 
          : `"${Date.now()}"`;
        
        // Check if client has cached version (If-None-Match header)
        const ifNoneMatch = request.headers.get('if-none-match');
        if (ifNoneMatch === etag) {
          return new NextResponse(null, { status: 304 }); // Not Modified
        }
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'ETag': etag,
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
      }
    }

    // If it's an external URL, redirect to it
    if (faviconUrl.startsWith('http://') || faviconUrl.startsWith('https://')) {
      return NextResponse.redirect(faviconUrl);
    }

    // Fallback: return 404
    return new NextResponse(null, { status: 404 });
  } catch (error) {
    console.error('[Favicon API] Error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
