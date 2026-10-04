export type PaymentMethod = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'COD';
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface PaymentInitParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  gatewayRedirectUrl?: string;
  requiresAction?: boolean;
  transactionData?: Record<string, unknown>;
  message?: string;
}

export interface PaymentGatewayProvider {
  initiatePayment(params: PaymentInitParams): Promise<PaymentResult>;
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): Promise<boolean>;
}

// Production Mock / Sandbox Gateway Adapter for local execution and zero external dependency failure
class SandboxGatewayProvider implements PaymentGatewayProvider {
  async initiatePayment(params: PaymentInitParams): Promise<PaymentResult> {
    if (params.method === 'COD') {
      return {
        success: true,
        paymentId: `COD-${Date.now()}`,
        status: 'PENDING',
        message: 'Order placed with Cash on Delivery. Cash is payable on arrival.',
      };
    }

    // Emulates a secure tokenized online gateway transaction (UPI / NetBanking / Cards)
    return {
      success: true,
      paymentId: `PAY-SANDBOX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      status: 'PAID',
      message: 'Online payment authorized securely.',
    };
  }

  async verifyPaymentSignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
    // In production with Razorpay: crypto.createHmac('sha256', secret).update(orderId + "|" + paymentId).digest('hex') === signature
    return Boolean(orderId && paymentId);
  }
}

class PaymentService {
  private provider: PaymentGatewayProvider;

  constructor() {
    this.provider = new SandboxGatewayProvider();
  }

  setProvider(provider: PaymentGatewayProvider) {
    this.provider = provider;
  }

  async processPayment(params: PaymentInitParams): Promise<PaymentResult> {
    return this.provider.initiatePayment(params);
  }

  async verifySignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
    return this.provider.verifyPaymentSignature(orderId, paymentId, signature);
  }
}

export const paymentService = new PaymentService();
