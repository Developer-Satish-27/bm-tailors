import { prisma } from '../lib/db';

export interface MeasurementProfileInput {
  userId: string;
  name: string;
  garmentType: string;
  measurements: Record<string, number | undefined>;
  notes?: string;
}

export interface CustomOrderInput {
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  garmentType: string;
  fabric?: string;
  color?: string;
  collar?: string;
  buttons?: string;
  cuff?: string;
  trouserStyle?: string;
  suitStyle?: string;
  fit?: string;
  measurementProfileId?: string;
  notes?: string;
}

export class TailoringService {
  static async saveMeasurementProfile(input: MeasurementProfileInput) {
    return prisma.measurementProfile.create({
      data: {
        userId: input.userId,
        name: input.name,
        garmentType: input.garmentType,
        measurementsJson: JSON.stringify(input.measurements),
        notes: input.notes,
      },
    });
  }

  static async getUserMeasurements(userId: string) {
    const profiles = await prisma.measurementProfile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return profiles.map((p) => ({
      ...p,
      measurements: JSON.parse(p.measurementsJson || '{}'),
    }));
  }

  static async submitCustomOrder(input: CustomOrderInput) {
    return prisma.customOrder.create({
      data: {
        userId: input.userId,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        garmentType: input.garmentType,
        fabric: input.fabric,
        color: input.color,
        collar: input.collar,
        buttons: input.buttons,
        cuff: input.cuff,
        trouserStyle: input.trouserStyle,
        suitStyle: input.suitStyle,
        fit: input.fit,
        measurementProfileId: input.measurementProfileId,
        notes: input.notes,
        status: 'ENQUIRY',
      },
    });
  }

  static async getCustomOrders(userId?: string) {
    const where = userId ? { userId } : {};
    return prisma.customOrder.findMany({
      where,
      include: {
        measurementProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateCustomOrderStatus(id: string, status: string, notes?: string, finalPrice?: number) {
    return prisma.customOrder.update({
      where: { id },
      data: {
        status,
        ...(notes ? { notes } : {}),
        ...(finalPrice !== undefined ? { finalPrice } : {}),
      },
    });
  }
}
