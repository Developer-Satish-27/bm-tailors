import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await requireAdminUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { user: { email: { contains: search } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { include: { profile: true } },
        items: true,
        payments: true,
        shipments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: { orders } });
  } catch (err: unknown) {
    const isAuth = err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN_ADMIN_ONLY');
    return NextResponse.json(
      { success: false, error: { code: isAuth ? 'FORBIDDEN' : 'SERVER_ERROR', message: isAuth ? 'Admin access required' : 'Error fetching orders' } },
      { status: isAuth ? 403 : 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdminUser();
    const { orderId, status, paymentStatus, internalNotes } = await req.json();

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(internalNotes ? { notes: internalNotes } : {}),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'UPDATE_ORDER_STATUS',
        entityType: 'ORDER',
        entityId: orderId,
        metadata: JSON.stringify({ status, paymentStatus, orderNumber: updated.orderNumber }),
      },
    });

    return NextResponse.json({ success: true, data: { order: updated } });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: err instanceof Error ? err.message : 'Failed to update order' } },
      { status: 400 }
    );
  }
}
