import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: { categories } });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: err instanceof Error ? err.message : 'Failed to fetch categories' } },
      { status: 500 }
    );
  }
}
