import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    await requireAdminUser();

    const variants = await prisma.productVariant.findMany({
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { stockQuantity: 'asc' },
    });

    const lowStockAlerts = variants.filter((v) => v.stockQuantity < 5);

    return NextResponse.json({
      success: true,
      data: {
        variants,
        lowStockAlerts,
        totalItems: variants.length,
      },
    });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'SERVER_ERROR', message: isAuth ? 'Admin access required' : 'Inventory fetch error' } },
      { status: isAuth ? 403 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminUser();
    const { variantId, adjustmentQuantity, reason } = await req.json();

    if (!variantId || typeof adjustmentQuantity !== 'number') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Variant ID and adjustment quantity are required.' } },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const v = await tx.productVariant.update({
        where: { id: variantId },
        data: {
          stockQuantity: {
            increment: adjustmentQuantity,
          },
        },
      });

      await tx.inventoryTransaction.create({
        data: {
          variantId,
          type: adjustmentQuantity > 0 ? 'RESTOCK' : 'ADJUSTMENT',
          quantity: adjustmentQuantity,
          referenceType: 'ADMIN_MANUAL',
          referenceId: admin.id,
          note: reason || 'Manual stock adjustment by admin',
        },
      });

      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action: 'ADJUST_INVENTORY',
          entityType: 'INVENTORY',
          entityId: variantId,
          metadata: JSON.stringify({ adjustmentQuantity, reason }),
        },
      });

      return v;
    });

    return NextResponse.json({ success: true, data: { variant: updated } });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'ADJUSTMENT_FAILED', message: err instanceof Error ? err.message : 'Inventory adjustment failed' } },
      { status: 400 }
    );
  }
}
