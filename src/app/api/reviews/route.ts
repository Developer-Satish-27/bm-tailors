import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const { productId, rating, title, body, customerDisplayName } = await req.json();

    if (!productId || !rating || !body || !customerDisplayName) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Rating, comment, and name are required.' } },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user?.id,
        rating: Number(rating),
        title,
        body,
        customerDisplayName,
        status: 'APPROVED',
      },
    });

    return NextResponse.json({ success: true, data: { review } });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'REVIEW_FAILED', message: err instanceof Error ? err.message : 'Failed to save review' } },
      { status: 500 }
    );
  }
}
