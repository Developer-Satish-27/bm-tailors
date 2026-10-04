import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await requireAdminUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            media: { take: 1, orderBy: { sortOrder: 'asc' } },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const counts = {
      total: await prisma.review.count(),
      pending: await prisma.review.count({ where: { status: 'PENDING' } }),
      approved: await prisma.review.count({ where: { status: 'APPROVED' } }),
      rejected: await prisma.review.count({ where: { status: 'REJECTED' } }),
    };

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        counts,
      },
    });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'SERVER_ERROR', message: isAuth ? 'Admin access required' : 'Error fetching reviews' } },
      { status: isAuth ? 403 : 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdminUser();
    const { reviewId, status } = await req.json();

    if (!reviewId || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Valid review ID and status are required.' } },
        { status: 400 }
      );
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
      include: { product: { select: { name: true } } },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'MODERATE_REVIEW',
        entityType: 'REVIEW',
        entityId: reviewId,
        metadata: JSON.stringify({ status, productName: updated.product.name }),
      },
    });

    return NextResponse.json({ success: true, data: { review: updated } });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'UPDATE_FAILED', message: err instanceof Error ? err.message : 'Review status update failed' } },
      { status: isAuth ? 403 : 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdminUser();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Review ID is required.' } },
        { status: 400 }
      );
    }

    await prisma.review.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'DELETE_REVIEW',
        entityType: 'REVIEW',
        entityId: id,
        metadata: JSON.stringify({ deleted: true }),
      },
    });

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'DELETE_FAILED', message: err instanceof Error ? err.message : 'Review deletion failed' } },
      { status: isAuth ? 403 : 400 }
    );
  }
}
