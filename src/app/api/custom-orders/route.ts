import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { customOrderSchema } from '@/lib/validation';
import { TailoringService } from '@/services/tailoring.service';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const body = await req.json();
    const validated = customOrderSchema.parse(body);

    const order = await TailoringService.submitCustomOrder({
      ...validated,
      userId: user?.id,
    });

    return NextResponse.json({
      success: true,
      data: { customOrder: order },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'CUSTOM_ORDER_FAILED', message: err instanceof Error ? err.message : 'Failed to submit bespoke order' } },
      { status: 400 }
    );
  }
}
