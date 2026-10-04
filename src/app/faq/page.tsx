import React from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, RotateCcw, ShieldAlert, Scissors, Truck, Calendar, ArrowRight } from 'lucide-react';
import { AppointmentBookingModal } from '@/components/appointment/AppointmentBookingModal';

export const metadata = {
  title: 'Frequently Asked Questions (FAQs) | B M Tailors Jaipur',
  description:
    'Answers to common questions regarding bespoke custom tailoring, ready-made purchases, 7-day exchange rules, COD terms, and atelier appointments in Jaipur.',
};

export default function FAQPage() {
  const faqs = [
    {
      category: 'Orders & Exchange Policy',
      icon: RotateCcw,
      items: [
        {
          q: 'What is the exchange policy for ready-made garments?',
          a: 'Ready-made purchases made via online payment are eligible for an exchange within 7 days of delivery. The item must be in unworn, unwashed condition with original tags and invoice attached.',
        },
        {
          q: 'Why are Cash on Delivery (COD) orders not eligible for exchange?',
          a: 'In accordance with our strict store policy, Cash on Delivery (COD) orders cannot be returned or exchanged under any circumstances. Garments prepared for COD orders are held specifically for the buyer. If you think you might need a size exchange, please choose an Online Payment method (UPI, Cards, Net Banking) at checkout.',
        },
        {
          q: 'Can custom made-to-measure garments be exchanged or refunded?',
          a: 'No. Custom-tailored garments are hand-drafted and individually cut to your unique body measurements and cannot be returned. However, we offer complimentary fitting adjustments within 14 days of collection at our Jaipur atelier.',
        },
      ],
    },
    {
      category: 'Bespoke Tailoring & Measurements',
      icon: Scissors,
      items: [
        {
          q: 'How does the 7-step custom tailoring process work?',
          a: '1) Choose your style, 2) Discuss occasion requirements, 3) Select fabrics and details, 4) Book an atelier appointment, 5) Master measurement, 6) Bench tailoring begins, 7) Final trial fitting and delivery in Jaipur.',
        },
        {
          q: 'Can I save my measurements online for repeat orders?',
          a: 'Yes! Once you create or log into your account, you can store multiple measurement profiles (e.g. Wedding Sherwani, 3-Piece Suit, Shirt) in your private measurement vault. Our master cutting team references this data for future orders.',
        },
        {
          q: 'Can I bring my own fabric to your Jaipur atelier?',
          a: 'Yes, our master cutters accommodate customer-supplied fabrics. You can book a "Custom Tailoring Consultation" appointment to discuss cutting charges and yardage requirements.',
        },
      ],
    },
    {
      category: 'Atelier Appointments & Visits',
      icon: Calendar,
      items: [
        {
          q: 'Is an appointment mandatory to visit your Jaipur atelier?',
          a: 'Walk-ins are always welcome during our store hours (10:30 AM – 9:00 PM). However, booking an appointment guarantees dedicated time with our senior master cutter for wedding and groom consultations.',
        },
        {
          q: 'Where are your atelier branches located in Jaipur?',
          a: 'B M Tailors operates two dedicated branches in Jaipur, Rajasthan, established since 1990. Exact branch visits can be scheduled through our appointment booking system.',
        },
      ],
    },
    {
      category: 'Shipping & Delivery in Jaipur',
      icon: Truck,
      items: [
        {
          q: 'What is the delivery timeline for ready-made purchases?',
          a: 'Orders in Urban Jaipur are dispatched within 24-48 hours and delivered within 2-4 business days.',
        },
        {
          q: 'What are the delivery charges?',
          a: 'Delivery is FREE for orders of ₹2,999 and above in Jaipur. For orders below ₹2,999, a flat delivery fee of ₹99 applies. Cash on Delivery orders incur an additional ₹120 handling charge.',
        },
      ],
    },
    {
      category: 'Institutional & Uniform Manufacturing',
      icon: HelpCircle,
      items: [
        {
          q: 'What is the minimum quantity for bulk uniform orders?',
          a: 'The minimum order quantity for bulk institutional quotations is 5 pieces. We supply schools, colleges, hotels, hospitals, security forces, corporate offices, and industrial factories.',
        },
        {
          q: 'Can uniforms be purchased through the standard online cart?',
          a: 'No. Uniform manufacturing involves custom fabric sourcing, logo embroidery, and institutional sizing. Please use our dedicated Uniforms page to submit a quotation enquiry.',
        },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner */}
      <div className="bg-heritage-900 text-white rounded-2xl p-8 sm:p-14 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Atelier Knowledge Base</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-heritage-300 leading-relaxed">
            Everything you need to know about bespoke tailoring, store visits in Jaipur, order dispatch, and our transparent store policies.
          </p>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-10">
        {faqs.map((sec) => {
          const Icon = sec.icon;
          return (
            <div key={sec.category} className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-heritage-200">
                <Icon className="w-5 h-5 text-gold-dark" />
                <h2 className="font-serif text-xl font-bold text-heritage-900">{sec.category}</h2>
              </div>

              <div className="space-y-3">
                {sec.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white rounded-xl border border-heritage-200 shadow-sm space-y-2 text-xs"
                  >
                    <h3 className="font-bold text-heritage-900 text-sm">{item.q}</h3>
                    <p className="text-heritage-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Banner */}
      <div className="p-8 bg-heritage-100 rounded-2xl border border-heritage-200 text-center space-y-4">
        <h3 className="font-serif text-xl font-bold text-heritage-900">Still have a question?</h3>
        <p className="text-xs text-heritage-600 max-w-md mx-auto">
          Our master tailoring desk in Jaipur is available daily from 10:30 AM to 9:00 PM to assist you.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-heritage-900 text-gold font-bold text-xs rounded hover:bg-heritage-800 transition"
          >
            Contact Customer Desk
          </Link>
          <AppointmentBookingModal defaultType="STORE_VISIT" />
        </div>
      </div>
    </div>
  );
}
