import { NextResponse } from 'next/server';
import { getBlogViewsMap } from '@/lib/posthog';

export async function GET() {
  try {
    const viewsMap = await getBlogViewsMap();
    return NextResponse.json({ views: viewsMap });
  } catch (error) {
    console.error('Failed to fetch blog views:', error);
    return NextResponse.json({ views: {} }, { status: 500 });
  }
}
