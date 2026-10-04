import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { measurementProfileSchema } from '@/lib/validation';
import { TailoringService } from '@/services/tailoring.service';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to view saved measurements.' } },
        { status: 401 }
      );
    }

    const profiles = await TailoringService.getUserMeasurements(user.id);
    return NextResponse.json({ success: true, data: { profiles } });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: err instanceof Error ? err.message : 'Failed to fetch measurements' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to save measurements.' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = measurementProfileSchema.parse(body);

    const { name, garmentType, notes, ...measurements } = validated;

    const profile = await TailoringService.saveMeasurementProfile({
      userId: user.id,
      name,
      garmentType,
      measurements,
      notes,
    });

    return NextResponse.json({ success: true, data: { profile } });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'SAVE_ERROR', message: err instanceof Error ? err.message : 'Failed to save measurements' } },
      { status: 400 }
    );
  }
}
