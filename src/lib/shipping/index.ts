export interface AddressInput {
  pincode: string;
  city: string;
  state: string;
}

export interface ShippingCalculation {
  shippingFee: number;
  isEligibleForDelivery: boolean;
  estimatedDeliveryDays: string;
  provider: string;
  zone: 'URBAN_JAIPUR' | 'REST_OF_RAJASTHAN' | 'PAN_INDIA';
  freeShippingApplied: boolean;
}

export interface ShippingProvider {
  calculate(address: AddressInput, subtotal: number): Promise<ShippingCalculation>;
  createShipment(orderId: string, address: AddressInput): Promise<{ trackingNumber: string; providerShipmentId: string }>;
}

class JaipurUrbanShippingProvider implements ShippingProvider {
  // Phase 1 focus: Urban Jaipur pincodes starting with 302
  async calculate(address: AddressInput, subtotal: number): Promise<ShippingCalculation> {
    const isJaipur = address.pincode.startsWith('302') || address.city.trim().toLowerCase() === 'jaipur';

    let zone: 'URBAN_JAIPUR' | 'REST_OF_RAJASTHAN' | 'PAN_INDIA' = 'URBAN_JAIPUR';
    if (isJaipur) {
      zone = 'URBAN_JAIPUR';
    } else if (address.state.trim().toLowerCase() === 'rajasthan') {
      zone = 'REST_OF_RAJASTHAN';
    } else {
      zone = 'PAN_INDIA';
    }

    // Free shipping threshold ₹2999
    const freeShipping = subtotal >= 2999;
    let baseFee = 99;

    if (zone === 'URBAN_JAIPUR') {
      baseFee = freeShipping ? 0 : 99;
    } else if (zone === 'REST_OF_RAJASTHAN') {
      baseFee = freeShipping ? 0 : 149;
    } else {
      baseFee = freeShipping ? 0 : 199;
    }

    return {
      shippingFee: baseFee,
      isEligibleForDelivery: true,
      estimatedDeliveryDays: zone === 'URBAN_JAIPUR' ? '2 - 3 Business Days' : '4 - 6 Business Days',
      provider: 'JAIPUR_EXPRESS_LOGISTICS',
      zone,
      freeShippingApplied: freeShipping,
    };
  }

  async createShipment(orderId: string, _address: AddressInput): Promise<{ trackingNumber: string; providerShipmentId: string }> {
    const trackingNumber = `JPR-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      trackingNumber,
      providerShipmentId: `SHIP-${orderId.substring(0, 8)}`,
    };
  }
}

class ShippingService {
  private provider: ShippingProvider;

  constructor() {
    this.provider = new JaipurUrbanShippingProvider();
  }

  setProvider(provider: ShippingProvider) {
    this.provider = provider;
  }

  async calculateShipping(address: AddressInput, subtotal: number): Promise<ShippingCalculation> {
    return this.provider.calculate(address, subtotal);
  }

  async createShipment(orderId: string, address: AddressInput) {
    return this.provider.createShipment(orderId, address);
  }
}

export const shippingService = new ShippingService();
