import { prisma } from '../lib/db';
import { notificationService } from '../lib/notifications';

export interface UniformEnquiryInput {
  name: string;
  organization: string;
  sector: string;
  phone: string;
  email: string;
  quantity: number;
  uniformType: string;
  fabricPreference?: string;
  color?: string;
  designRequirements?: string;
  referenceFileUrl?: string;
  additionalRequirements?: string;
}

export class UniformService {
  static async submitEnquiry(input: UniformEnquiryInput) {
    const enquiry = await prisma.uniformEnquiry.create({
      data: {
        name: input.name,
        organization: input.organization,
        sector: input.sector,
        phone: input.phone,
        email: input.email,
        quantity: input.quantity,
        uniformType: input.uniformType,
        fabricPreference: input.fabricPreference,
        color: input.color,
        designRequirements: input.designRequirements,
        referenceFileUrl: input.referenceFileUrl,
        additionalRequirements: input.additionalRequirements,
        status: 'NEW',
      },
    });

    await notificationService.notifyUniformEnquiryReceived(input.organization, input.phone, input.uniformType);

    return enquiry;
  }

  static async getEnquiries() {
    return prisma.uniformEnquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateEnquiryStatus(id: string, status: string, adminNotes?: string) {
    return prisma.uniformEnquiry.update({
      where: { id },
      data: {
        status,
        ...(adminNotes ? { adminNotes } : {}),
      },
    });
  }
}
