export type AnalyticsEvent =
  | 'view_product'
  | 'search'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'add_payment_info'
  | 'purchase'
  | 'whatsapp_click'
  | 'phone_click'
  | 'appointment_started'
  | 'appointment_completed'
  | 'custom_enquiry'
  | 'uniform_enquiry'
  | 'wishlist_add';

export function trackEvent(eventName: AnalyticsEvent, properties: Record<string, unknown> = {}) {
  try {
    if (typeof window === 'undefined') return;

    // Sanitize: Do not send sensitive personal details or measurements to external analytics
    const sanitizedProps = { ...properties };
    delete sanitizedProps.measurements;
    delete sanitizedProps.customerMeasurements;
    delete sanitizedProps.cardNumber;
    delete sanitizedProps.cvv;
    delete sanitizedProps.password;

    // Console logging in dev mode
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[ANALYTICS EVENT] ${eventName}:`, sanitizedProps);
    }

    // Google Analytics 4 (gtag) integration if initialized
    const win = window as unknown as { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void };
    if (typeof win.gtag === 'function') {
      win.gtag('event', eventName, sanitizedProps);
    }

    // Meta Pixel (fbq) integration if initialized
    if (typeof win.fbq === 'function') {
      if (eventName === 'purchase') {
        win.fbq('track', 'Purchase', sanitizedProps);
      } else if (eventName === 'add_to_cart') {
        win.fbq('track', 'AddToCart', sanitizedProps);
      } else if (eventName === 'begin_checkout') {
        win.fbq('track', 'InitiateCheckout', sanitizedProps);
      } else if (eventName === 'view_product') {
        win.fbq('track', 'ViewContent', sanitizedProps);
      } else {
        win.fbq('trackCustom', eventName, sanitizedProps);
      }
    }
  } catch (e) {
    console.error('Analytics tracking error:', e);
  }
}
