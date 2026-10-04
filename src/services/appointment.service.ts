import { prisma } from '../lib/db';
import { notificationService } from '../lib/notifications';

export interface BookAppointmentInput {
  userId?: string;
  type: 'CUSTOM_TAILORING' | 'WEDDING_CONSULTATION' | 'MEASUREMENT' | 'STORE_VISIT';
  date: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
}

export class AppointmentService {
  static async getAvailableSlots(date: string) {
    const defaultSlots = ['10:30 AM', '12:00 PM', '02:30 PM', '04:30 PM', '06:30 PM', '08:00 PM'];

    // Check existing appointments on this date
    const booked = await prisma.appointment.findMany({
      where: {
        date,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: { startTime: true },
    });

    const bookedCounts: Record<string, number> = {};
    for (const b of booked) {
      bookedCounts[b.startTime] = (bookedCounts[b.startTime] || 0) + 1;
    }

    // Maximum 2 appointments per slot
    return defaultSlots.map((slot) => ({
      time: slot,
      isAvailable: (bookedCounts[slot] || 0) < 2,
      remainingSlots: Math.max(0, 2 - (bookedCounts[slot] || 0)),
    }));
  }

  static async bookAppointment(input: BookAppointmentInput) {
    const { userId, type, date, startTime, customerName, customerPhone, customerEmail, notes } = input;

    // Verify slot capacity
    const currentInSlot = await prisma.appointment.count({
      where: {
        date,
        startTime,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (currentInSlot >= 2) {
      throw new Error('This time slot is fully booked. Please select another time or date.');
    }

    const appt = await prisma.appointment.create({
      data: {
        userId,
        type,
        date,
        startTime,
        customerName,
        customerPhone,
        customerEmail,
        notes,
        status: 'CONFIRMED',
      },
    });

    // Send WhatsApp & Email confirmations
    await notificationService.notifyAppointmentBooked(customerName, customerPhone, date, startTime, type);

    return appt;
  }

  static async getUserAppointments(userId: string) {
    return prisma.appointment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAllAppointments() {
    return prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}
