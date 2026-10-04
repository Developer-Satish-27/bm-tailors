import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminUser();
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        media: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { product } });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'SERVER_ERROR', message: isAuth ? 'Admin access required' : 'Error fetching product' } },
      { status: isAuth ? 403 : 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdminUser();
    const body = await req.json();

    const allowedFields = [
      'name',
      'basePrice',
      'compareAtPrice',
      'isActive',
      'isBestSeller',
      'isFeatured',
      'isNewArrival',
      'isOnSale',
      'shortDescription',
      'description',
      'fabricDetails',
      'fitType',
      'occasion',
      'seoTitle',
      'seoDescription',
    ];

    const dataToUpdate: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        dataToUpdate[key] = body[key];
      }
    }

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: dataToUpdate,
      include: {
        category: true,
        variants: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'UPDATE_PRODUCT',
        entityType: 'PRODUCT',
        entityId: params.id,
        metadata: JSON.stringify(dataToUpdate),
      },
    });

    return NextResponse.json({ success: true, data: { product: updated } });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'UPDATE_FAILED', message: err instanceof Error ? err.message : 'Product update failed' } },
      { status: isAuth ? 403 : 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdminUser();

    // Check if product is in orders
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: params.id },
    });

    let result;
    if (orderItemsCount > 0) {
      // Soft-delete / Archive to preserve order history
      result = await prisma.product.update({
        where: { id: params.id },
        data: { isActive: false },
      });
    } else {
      // Hard delete if no orders
      result = await prisma.product.delete({
        where: { id: params.id },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: orderItemsCount > 0 ? 'ARCHIVE_PRODUCT' : 'DELETE_PRODUCT',
        entityType: 'PRODUCT',
        entityId: params.id,
        metadata: JSON.stringify({ hadOrders: orderItemsCount > 0 }),
      },
    });

    return NextResponse.json({
      success: true,
      data: { archived: orderItemsCount > 0, deleted: orderItemsCount === 0 },
    });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'DELETE_FAILED', message: err instanceof Error ? err.message : 'Failed to archive/delete product' } },
      { status: isAuth ? 403 : 400 }
    );
  }
}
