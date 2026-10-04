import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldAlert, Truck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Store Policies & Exchange Terms | B M Tailors Jaipur',
  description:
    'Official policies of B M Tailors: 7-day ready-made exchange policy, COD exchange restrictions, bespoke custom tailoring rules, and shipping.',
};

export default function PoliciesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner */}
      <div className="bg-heritage-900 text-white p-8 sm:p-12 rounded-2xl relative overflow-hidden">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Transparency & Governance</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
          Store Policies & Customer Protection
        </h1>
        <p className="text-xs sm:text-sm text-heritage-300 mt-2 max-w-2xl leading-relaxed">
          Clear, transparent operating policies governing online orders, custom made-to-measure tailoring, Cash on Delivery (COD) restrictions, and Jaipur deliveries.
        </p>
      </div>

      <div className="space-y-10 text-xs sm:text-sm text-heritage-700">
        {/* 1. Ready-Made 7-Day Exchange Policy */}
        <section id="exchange" className="p-6 bg-white rounded-xl border border-heritage-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-heritage-900 font-bold text-base">
            <RotateCcw className="w-5 h-5 text-gold-dark" />
            <h2 className="font-serif">1. Ready-Made Garments: 7-Day Exchange Policy</h2>
          </div>
          <p className="leading-relaxed">
            Ready-to-wear clothing purchased through the B M Tailors online store (such as ready-made shirts, standard-sized kurtas, and off-the-rack garments paid online) is eligible for a size or style exchange within <strong>7 days</strong> of verified delivery.
          </p>
          <div className="bg-heritage-50 p-4 rounded-lg space-y-1.5 border border-heritage-200 text-xs">
            <p className="font-bold text-heritage-900">Exchange Conditions:</p>
            <ul className="list-disc pl-5 space-y-1 text-heritage-600">
              <li>The garment must be unworn, unwashed, unaltered, and without fragrance or blemishes.</li>
              <li>Original brand tags, packaging, and the purchase invoice must remain intact.</li>
              <li>Exchanges can be initiated from your customer account dashboard or at our Jaipur atelier.</li>
            </ul>
          </div>
        </section>

        {/* 2. Strict COD Non-Exchangeable Policy */}
        <section id="cod" className="p-6 bg-amber-50/60 rounded-xl border border-amber-300 space-y-3">
          <div className="flex items-center space-x-2 text-amber-950 font-bold text-base">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif">2. Cash on Delivery (COD) Policy & Exchange Exclusions</h2>
          </div>
          <div className="p-4 bg-white rounded-lg border border-amber-200 space-y-2 text-xs">
            <p className="font-bold text-rose-700 uppercase tracking-wide">
              Important: COD Orders Are Strictly Non-Exchangeable
            </p>
            <p className="text-heritage-800 leading-relaxed">
              In strict accordance with B M Tailors store policies, any order purchased using <strong>Cash on Delivery (COD)</strong> is <strong>NOT eligible for exchange, return, or refund</strong> under any circumstances.
            </p>
            <p className="text-heritage-600 leading-relaxed">
              <strong>Rationale:</strong> Garments dispatched for COD are specifically reserved and prepared for the recipient. If you anticipate that you might require a size exchange, please choose an <strong>Online Payment method (UPI, Cards, Net Banking)</strong>, which fully supports our 7-Day Exchange Program.
            </p>
            <p className="text-heritage-600">
              A standard COD handling charge of ₹120 applies to all Cash on Delivery shipments in Jaipur.
            </p>
          </div>
        </section>

        {/* 3. Custom Tailoring & Bespoke Policy */}
        <section id="tailoring" className="p-6 bg-white rounded-xl border border-heritage-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-heritage-900 font-bold text-base">
            <FileText className="w-5 h-5 text-gold-dark" />
            <h2 className="font-serif">3. Custom Tailoring & Made-to-Measure Terms</h2>
          </div>
          <p className="leading-relaxed">
            Custom-tailored suits, sherwanis, bandhgalas, and bespoke shirts are hand-drafted and individually cut to your unique physiological measurements. Consequently, <strong>custom made-to-measure garments cannot be returned or exchanged for a refund.</strong>
          </p>
          <p className="leading-relaxed">
            However, we guarantee our fit! If any minor adjustment is required after your initial trial at our Jaipur atelier, our master cutters provide complimentary fitting adjustments within 14 days of garment collection.
          </p>
        </section>

        {/* 4. Shipping & Delivery Terms */}
        <section id="shipping" className="p-6 bg-white rounded-xl border border-heritage-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-heritage-900 font-bold text-base">
            <Truck className="w-5 h-5 text-gold-dark" />
            <h2 className="font-serif">4. Shipping & Dispatch (Urban Jaipur & Beyond)</h2>
          </div>
          <p className="leading-relaxed">
            Phase 1 shipping covers urban Jaipur pincodes (302001 - 302039). Orders are typically dispatched within 24 to 48 hours and delivered within 2 to 4 business days.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-heritage-600">
            <li>Orders of ₹2,999 and above receive <strong>Free Delivery</strong> in Jaipur.</li>
            <li>Orders under ₹2,999 incur a nominal ₹99 dispatch charge.</li>
            <li>Shipping coverage is continuously expanding across Rajasthan and Pan-India.</li>
          </ul>
        </section>

        {/* 5. Privacy & Sensitive Measurements */}
        <section id="privacy" className="p-6 bg-white rounded-xl border border-heritage-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-heritage-900 font-bold text-base">
            <Lock className="w-5 h-5 text-gold-dark" />
            <h2 className="font-serif">5. Customer Privacy & Measurement Vault</h2>
          </div>
          <p className="leading-relaxed">
            Your physiological body measurements, styling notes, and personal contact details are considered confidential atelier records. We do not transmit customer measurements to third-party advertising or analytics networks.
          </p>
        </section>
      </div>

      <div className="p-6 bg-heritage-100 rounded-xl text-center space-y-2 border border-heritage-200">
        <h4 className="font-serif font-bold text-base text-heritage-900">Have questions about an order or policy?</h4>
        <p className="text-xs text-heritage-600">Our customer team in Jaipur is available daily from 10:30 AM to 9:00 PM.</p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-block px-5 py-2.5 bg-heritage-900 text-gold font-bold text-xs rounded hover:bg-heritage-800 transition"
          >
            Contact Atelier Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
