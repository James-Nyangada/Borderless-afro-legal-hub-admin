import { NextResponse } from 'next/server';
import { getDashboardAnalytics } from '@/lib/posthog';

export async function GET() {
  try {
    const data = await getDashboardAnalytics();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch analytics in API route', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
