import { prisma } from '../db';

export type NotificationChannel = 'WHATSAPP' | 'SMS' | 'EMAIL';

export interface NotificationPayload {
  userId?: string;
  type: string;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  content: string;
}

export interface NotificationProvider {
  send(payload: NotificationPayload): Promise<{ success: boolean; providerMessageId?: string; error?: string }>;
}

class WhatsAppProvider implements NotificationProvider {
  async send(payload: NotificationPayload) {
    // Adapter connecting to WhatsApp Cloud API / Twilio
    console.log(`[WHATSAPP DISPATCH] To: ${payload.recipient} | Message: ${payload.content}`);
    return { success: true, providerMessageId: `WA-MSG-${Date.now()}` };
  }
}

class SmsProvider implements NotificationProvider {
  async send(payload: NotificationPayload) {
    // Adapter connecting to Fast2SMS / MSG91
    console.log(`[SMS DISPATCH] To: ${payload.recipient} | Message: ${payload.content}`);
    return { success: true, providerMessageId: `SMS-MSG-${Date.now()}` };
  }
}

class EmailProvider implements NotificationProvider {
  async send(payload: NotificationPayload) {
    // Adapter connecting to Resend / SendGrid / Postmark
    console.log(`[EMAIL DISPATCH] To: ${payload.recipient} | Subject: ${payload.subject} | Body: ${payload.content}`);
    return { success: true, providerMessageId: `EMAIL-MSG-${Date.now()}` };
  }
}

class NotificationService {
  private whatsapp = new WhatsAppProvider();
  private sms = new SmsProvider();
  private email = new EmailProvider();

  async send(payload: NotificationPayload) {
    let result = { success: false, providerMessageId: undefined as string | undefined };

    try {
      if (payload.channel === 'WHATSAPP') {
        result = await this.whatsapp.send(payload);
      } else if (payload.channel === 'SMS') {
        result = await this.sms.send(payload);
      } else if (payload.channel === 'EMAIL') {
        result = await this.email.send(payload);
      }

      // Persist in Notification database table
      await prisma.notification.create({
        data: {
          userId: payload.userId,
          type: payload.type,
          channel: payload.channel,
          recipient: payload.recipient,
          subject: payload.subject,
          content: payload.content,
          status: result.success ? 'SENT' : 'FAILED',
          providerMessageId: result.providerMessageId,
          sentAt: result.success ? new Date() : null,
        },
      });

      return result;
    } catch (err: unknown) {
      console.error('Failed to dispatch notification:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Unknown notification error' };
    }
  }

  // Pre-configured notification triggers
  async notifyOrderPlaced(orderNumber: string, customerPhone: string, customerEmail?: string, total?: number) {
    const text = `Namaste! Your B M Tailors order #${orderNumber} of ₹${total} has been placed successfully. Track your tailoring & delivery status on our portal.`;
    await this.send({
      type: 'ORDER_PLACED',
      channel: 'WHATSAPP',
      recipient: customerPhone,
      content: text,
    });

    if (customerEmail) {
      await this.send({
        type: 'ORDER_PLACED',
        channel: 'EMAIL',
        recipient: customerEmail,
        subject: `B M Tailors — Order Confirmation #${orderNumber}`,
        content: `Thank you for choosing B M Tailors (Since 1990). Your order #${orderNumber} for ₹${total} is now being prepared by our master craftsmen.`,
      });
    }
  }

  async notifyAppointmentBooked(customerName: string, phone: string, date: string, time: string, type: string) {
    const text = `Namaste ${customerName}, your appointment at B M Tailors Jaipur atelier for "${type}" is confirmed for ${date} at ${time}. We look forward to welcoming you.`;
    await this.send({
      type: 'APPOINTMENT_CONFIRMED',
      channel: 'WHATSAPP',
      recipient: phone,
      content: text,
    });
  }

  async notifyUniformEnquiryReceived(orgName: string, contactPhone: string, uniformType: string) {
    const text = `Greetings from B M Tailors Institutional Division. We have received your quotation request for ${uniformType} for "${orgName}". Our institutional sales officer will connect with you within 24 hours.`;
    await this.send({
      type: 'UNIFORM_ENQUIRY_RECEIVED',
      channel: 'WHATSAPP',
      recipient: contactPhone,
      content: text,
    });
  }
}

export const notificationService = new NotificationService();
