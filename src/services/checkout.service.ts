import { prisma } from '../lib/db';
import { shippingService } from '../lib/shipping';
import { paymentService, PaymentMethod } from '../lib/payments';
import { notificationService } from '../lib/notifications';

export interface CheckoutInput {
  userId: string;
  addressId?: string;
  newAddress?: {
    label?: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
  items?: Array<{ variantId: string; quantity: number }>; // If direct buy now
}

export class CheckoutService {
  static async processCheckout(input: CheckoutInput) {
    const { userId, addressId, newAddress, paymentMethod, couponCode, notes, items: directItems } = input;

    // 1. Validate User
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new Error('User not found');

    // 2. Validate / Resolve Address
    let targetAddress;
    if (addressId) {
      targetAddress = await prisma.address.findUnique({
        where: { id: addressId, userId },
      });
    } else if (newAddress) {
      targetAddress = await prisma.address.create({
        data: {
          userId,
          label: newAddress.label || 'Delivery',
          fullName: newAddress.fullName,
          phone: newAddress.phone,
          addressLine1: newAddress.addressLine1,
          addressLine2: newAddress.addressLine2,
          landmark: newAddress.landmark,
          city: newAddress.city || 'Jaipur',
          state: newAddress.state || 'Rajasthan',
          pincode: newAddress.pincode,
          isDefault: true,
        },
      });
    }

    if (!targetAddress) {
      throw new Error('Valid shipping address is required');
    }

    // 3. Resolve Cart Items / Direct Items
    let orderItemsToProcess: Array<{ variantId: string; quantity: number }> = [];

    if (directItems && directItems.length > 0) {
      orderItemsToProcess = directItems;
    } else {
      const userCart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });
      if (!userCart || userCart.items.length === 0) {
        throw new Error('Cart is empty');
      }
      orderItemsToProcess = userCart.items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      }));
    }

    // 4. Validate Current Prices & Stock Server-Side
    let subtotal = 0;
    const validatedLineItems: Array<{
      variant: any;
      product: any;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of orderItemsToProcess) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant || !variant.isActive || !variant.product.isActive) {
        throw new Error(`Product variant is no longer available.`);
      }

      if (variant.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${variant.product.name} (${variant.size}). Available: ${variant.stockQuantity}`);
      }

      const lineTotal = variant.price * item.quantity;
      subtotal += lineTotal;

      validatedLineItems.push({
        variant,
        product: variant.product,
        quantity: item.quantity,
        unitPrice: variant.price,
        totalPrice: lineTotal,
      });
    }

    // 5. Server-side Coupon Validation
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        const validDates = (!coupon.startsAt || coupon.startsAt <= now) && (!coupon.expiresAt || coupon.expiresAt >= now);
        if (validDates && subtotal >= coupon.minimumCartValue) {
          if (coupon.type === 'PERCENTAGE') {
            discount = (subtotal * coupon.value) / 100;
            if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
              discount = coupon.maximumDiscount;
            }
          } else {
            discount = coupon.value;
          }
        }
      }
    }

    // 6. Calculate Shipping
    const shippingCalc = await shippingService.calculateShipping(
      {
        city: targetAddress.city,
        state: targetAddress.state,
        pincode: targetAddress.pincode,
      },
      subtotal
    );

    const shippingFee = shippingCalc.shippingFee;

    // 7. COD Rules & Extra Handling
    const isCod = paymentMethod === 'COD';
    const codFee = isCod ? 120 : 0; // Configured COD fee
    const isExchangeEligible = !isCod; // Prompt Rule: COD orders are strictly NOT exchangeable

    const total = Math.max(0, subtotal - discount + shippingFee + codFee);

    // 8. Generate Human-Readable Order Number (e.g. BMT-2026-104928)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `BMT-2026-${randomSuffix}`;

    // 9. Atomic Database Transaction: Order Creation + Inventory Deduction
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: isCod ? 'ORDER_PLACED' : 'PAYMENT_CONFIRMED',
          paymentStatus: isCod ? 'PENDING' : 'PAID',
          subtotal,
          discount,
          shippingFee,
          codFee,
          tax: 0,
          total,
          isCod,
          isExchangeEligible,
          shippingAddressSnapshot: JSON.stringify(targetAddress),
          notes,
          items: {
            create: validatedLineItems.map((li) => ({
              productId: li.product.id,
              variantId: li.variant.id,
              productNameSnapshot: li.product.name,
              skuSnapshot: li.variant.sku,
              sizeSnapshot: li.variant.size,
              colorSnapshot: li.variant.color,
              fabricSnapshot: li.variant.fabric || li.product.fabricDetails,
              quantity: li.quantity,
              unitPrice: li.unitPrice,
              totalPrice: li.totalPrice,
            })),
          },
          payments: {
            create: {
              method: paymentMethod,
              amount: total,
              provider: isCod ? 'COD' : 'SANDBOX_GATEWAY',
              status: isCod ? 'PENDING' : 'PAID',
              providerPaymentId: isCod ? `COD-${orderNumber}` : `ONLINE-${orderNumber}`,
            },
          },
        },
      });

      // Safely reserve/deduct stock & log inventory transaction
      for (const li of validatedLineItems) {
        await tx.productVariant.update({
          where: { id: li.variant.id },
          data: {
            stockQuantity: {
              decrement: li.quantity,
            },
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            variantId: li.variant.id,
            type: 'SALE',
            quantity: -li.quantity,
            referenceType: 'ORDER',
            referenceId: order.id,
            note: `Order ${orderNumber} placed`,
          },
        });
      }

      // Empty cart after checkout
      if (!directItems) {
        await tx.cartItem.deleteMany({
          where: { cart: { userId } },
        });
      }

      return order;
    });

    // 10. Trigger Notifications
    await notificationService.notifyOrderPlaced(
      orderNumber,
      targetAddress.phone,
      user.email,
      total
    );

    return createdOrder;
  }
}
