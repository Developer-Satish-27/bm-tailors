import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Coupon code and cart subtotal are required.' } },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: String(code).toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_COUPON', message: 'Invalid or inactive coupon code.' } },
        { status: 404 }
      );
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      return NextResponse.json(
        { success: false, error: { code: 'COUPON_NOT_STARTED', message: 'This coupon promotion has not started yet.' } },
        { status: 400 }
      );
    }

    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json(
        { success: false, error: { code: 'COUPON_EXPIRED', message: 'This coupon promotion has expired.' } },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minimumCartValue) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MIN_CART_VALUE_NOT_MET',
            message: `Minimum cart value of ₹${coupon.minimumCartValue} is required to apply code ${coupon.code}.`,
          },
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountAmount,
        type: coupon.type,
        value: coupon.value,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: err instanceof Error ? err.message : 'Coupon validation failed' } },
      { status: 500 }
    );
  }
}
