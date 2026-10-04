import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to submit an exchange request.' } },
        { status: 401 }
      );
    }

    const { orderId, orderItemId, reason } = await req.json();

    if (!orderId || !orderItemId || !reason) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Order ID, Item ID, and reason are required.' } },
        { status: 400 }
      );
    }

    // Verify order ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Order not found or unauthorized.' } },
        { status: 404 }
      );
    }

    // Check COD restriction: COD orders are strictly NOT exchangeable
    if (order.isCod || !order.isExchangeEligible) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'COD_NOT_EXCHANGEABLE',
            message: 'In accordance with store policy, Cash on Delivery (COD) orders and Custom garments are not eligible for exchange or return.',
          },
        },
        { status: 400 }
      );
    }

    // Check 7-day exchange window
    const orderDate = new Date(order.createdAt);
    const diffDays = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EXCHANGE_WINDOW_EXPIRED',
            message: 'The 7-day exchange period has expired for this order.',
          },
        },
        { status: 400 }
      );
    }

    const item = order.items.find((i) => i.id === orderItemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: { code: 'ITEM_NOT_FOUND', message: 'Item not found in this order.' } },
        { status: 404 }
      );
    }

    // Check for existing exchange request
    const existing = await prisma.exchangeRequest.findFirst({
      where: { orderItemId },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'ALREADY_REQUESTED', message: 'An exchange request has already been filed for this garment.' } },
        { status: 400 }
      );
    }

    const exchange = await prisma.exchangeRequest.create({
      data: {
        orderId: order.id,
        orderItemId: item.id,
        userId: user.id,
        reason,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      data: { exchange },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'EXCHANGE_ERROR', message: err instanceof Error ? err.message : 'Failed to process exchange' } },
      { status: 500 }
    );
  }
}
