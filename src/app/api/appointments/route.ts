import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { appointmentSchema } from '@/lib/validation';
import { AppointmentService } from '@/services/appointment.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    if (!date) {
      return NextResponse.json(
        { success: false, error: { code: 'DATE_REQUIRED', message: 'Date parameter (YYYY-MM-DD) is required.' } },
        { status: 400 }
      );
    }

    const slots = await AppointmentService.getAvailableSlots(date);
    return NextResponse.json({ success: true, data: { slots } });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'SLOTS_FETCH_ERROR', message: err instanceof Error ? err.message : 'Failed to fetch slots' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const body = await req.json();
    const validated = appointmentSchema.parse(body);

    const appointment = await AppointmentService.bookAppointment({
      userId: user?.id,
      type: validated.type,
      date: validated.date,
      startTime: validated.startTime,
      customerName: validated.customerName,
      customerPhone: validated.customerPhone,
      customerEmail: validated.customerEmail || undefined,
      notes: validated.notes,
    });

    return NextResponse.json({
      success: true,
      data: { appointment },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENT_FAILED', message: err instanceof Error ? err.message : 'Failed to book appointment' } },
      { status: 400 }
    );
  }
}
