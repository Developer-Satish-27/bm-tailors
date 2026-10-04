import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { checkoutSchema } from '@/lib/validation';
import { CheckoutService } from '@/services/checkout.service';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in to place an order.' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = checkoutSchema.parse(body);

    const order = await CheckoutService.processCheckout({
      userId: user.id,
      addressId: validated.addressId,
      newAddress: validated.newAddress,
      paymentMethod: validated.paymentMethod,
      couponCode: validated.couponCode,
      notes: validated.notes,
      items: body.items, // optional direct buy now items
    });

    return NextResponse.json({
      success: true,
      data: {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus,
          isCod: order.isCod,
          isExchangeEligible: order.isExchangeEligible,
        },
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'CHECKOUT_FAILED', message: err instanceof Error ? err.message : 'Order processing failed.' } },
      { status: 400 }
    );
  }
}
