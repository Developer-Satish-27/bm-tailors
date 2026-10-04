'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import { AppointmentBookingModal } from '@/components/appointment/AppointmentBookingModal';
import { trackEvent } from '@/lib/analytics';
import {
  Scissors,
  Ruler,
  Layers,
  Sparkles,
  MessageCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

export default function CustomTailoringPage() {
  const { t, language } = useLanguage();

  // Customization builder state
  const [selectedGarment, setSelectedGarment] = useState('Royal Jodhpuri Bandhgala');
  const [selectedFabric, setSelectedFabric] = useState('Italian Merino Wool (Super 130s)');
  const [selectedCollar, setSelectedCollar] = useState('Structured Mandarin Collar');
  const [selectedFit, setSelectedFit] = useState('Tailored Slim Fit');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const garments = [
    'Royal Jodhpuri Bandhgala',
    'Black-Tie Tuxedo (Peak Lapel)',
    'Three-Piece Executive Suit',
    'Groom Heritage Sherwani',
    'Asymmetric Indo-Western Achkan',
    'Tailored French Linen Kurta',
  ];

  const fabrics = [
    'Italian Merino Wool (Super 130s)',
    'Jaipur Raw Silk (Matka & Mulberry)',
    '100% Pure French Linen (60s)',
    'Giza Egyptian Two-Ply Cotton',
    'Silk Brocade & Banarasi Weaves',
  ];

  const collars = [
    'Structured Mandarin Collar',
    'Satin Peak Lapel',
    'Notch Lapel (Italian Cut)',
    'Angrakha Overlap Neckline',
    'Band Collar with Concealed Placket',
  ];

  const fits = ['Tailored Slim Fit', 'Classic British Drape', 'Modern Euro-Slim', 'Comfort Regular Fit'];

  const handleSubmitCustomEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    trackEvent('custom_enquiry', { selectedGarment, selectedFabric, selectedFit });

    try {
      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          garmentType: selectedGarment,
          fabric: selectedFabric,
          collar: selectedCollar,
          fit: selectedFit,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch {
      alert('Network error. Please try again or reach out on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    trackEvent('whatsapp_click', { placement: 'custom_tailoring_page' });
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
    const msg = encodeURIComponent(
      `Namaste B M Tailors! I would like to consult on bespoke tailoring for: ${selectedGarment} in ${selectedFabric} (${selectedFit}).`
    );
    window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-16 lg:space-y-24 py-10">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-heritage-900 text-white rounded-2xl p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">
              Master Atelier • Established 1990
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              {t.customTailoring.title}
            </h1>
            <p className="text-sm sm:text-base text-heritage-300 leading-relaxed">
              {t.customTailoring.sub}. We combine traditional bench-made cutting with contemporary styling to construct garments that drape effortlessly on your posture.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <AppointmentBookingModal defaultType="CUSTOM_TAILORING" buttonLabel="Book Atelier Appointment" />
              <button
                type="button"
                onClick={handleWhatsApp}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.customTailoring.consultWhatsApp}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Tailoring Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-gold-dark uppercase">The Craftsmanship Journey</span>
          <h2 className="font-serif text-3xl font-bold text-heritage-900 mt-1">
            {t.customTailoring.stepsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: t.customTailoring.step1, desc: t.customTailoring.step1Desc },
            { step: '02', title: t.customTailoring.step2, desc: t.customTailoring.step2Desc },
            { step: '03', title: t.customTailoring.step3, desc: t.customTailoring.step3Desc },
            { step: '04', title: t.customTailoring.step4, desc: t.customTailoring.step4Desc },
            { step: '05', title: t.customTailoring.step5, desc: t.customTailoring.step5Desc },
            { step: '06', title: t.customTailoring.step6, desc: t.customTailoring.step6Desc },
            { step: '07', title: t.customTailoring.step7, desc: t.customTailoring.step7Desc },
            {
              step: '★',
              title: 'Digital Sizing Vault',
              desc: 'Your custom measurements are retained in your profile for future effortless orders.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 bg-white rounded-lg border border-heritage-200 hover:border-gold transition shadow-sm space-y-2"
            >
              <span className="font-serif text-2xl font-bold text-gold-dark">{item.step}</span>
              <h3 className="font-serif font-bold text-base text-heritage-900">{item.title}</h3>
              <p className="text-xs text-heritage-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Style & Fabric Customizer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-heritage-50 rounded-2xl p-6 sm:p-10 border border-heritage-200">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold tracking-widest text-gold-dark uppercase">Interactive Bespoke Studio</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-900 mt-1">
              Configure Your Custom Silhouette
            </h2>
            <p className="text-xs text-heritage-600 mt-1">
              Select your desired attributes below to request an atelier consultation or discuss on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Customization Options */}
            <div className="lg:col-span-7 space-y-6">
              {/* Garment Silhouette */}
              <div>
                <label className="block text-xs font-bold text-heritage-900 mb-2 uppercase tracking-wide">
                  1. Silhouette / Garment Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {garments.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGarment(g)}
                      className={`p-3 text-xs rounded border text-left font-medium transition ${
                        selectedGarment === g
                          ? 'bg-heritage-900 text-gold border-heritage-900 shadow font-bold'
                          : 'bg-white text-heritage-800 border-heritage-300 hover:border-gold'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric Choice */}
              <div>
                <label className="block text-xs font-bold text-heritage-900 mb-2 uppercase tracking-wide">
                  2. Master Fabric Choice
                </label>
                <div className="space-y-2">
                  {fabrics.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFabric(f)}
                      className={`w-full p-2.5 text-xs rounded border text-left font-medium transition ${
                        selectedFabric === f
                          ? 'bg-heritage-900 text-gold border-heritage-900 shadow font-bold'
                          : 'bg-white text-heritage-800 border-heritage-300 hover:border-gold'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collar / Lapel */}
              <div>
                <label className="block text-xs font-bold text-heritage-900 mb-2 uppercase tracking-wide">
                  3. Collar & Lapel Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {collars.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCollar(c)}
                      className={`p-2.5 text-xs rounded border text-left font-medium transition ${
                        selectedCollar === c
                          ? 'bg-heritage-900 text-gold border-heritage-900 shadow font-bold'
                          : 'bg-white text-heritage-800 border-heritage-300 hover:border-gold'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit Preference */}
              <div>
                <label className="block text-xs font-bold text-heritage-900 mb-2 uppercase tracking-wide">
                  4. Fit Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {fits.map((ft) => (
                    <button
                      key={ft}
                      type="button"
                      onClick={() => setSelectedFit(ft)}
                      className={`p-2.5 text-xs rounded border text-center font-medium transition ${
                        selectedFit === ft
                          ? 'bg-heritage-900 text-gold border-heritage-900 shadow font-bold'
                          : 'bg-white text-heritage-800 border-heritage-300 hover:border-gold'
                      }`}
                    >
                      {ft}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selection Summary & Booking Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-xl border border-heritage-300 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-base text-heritage-900 pb-2 border-b border-heritage-100">
                  Your Bespoke Configuration
                </h3>

                <div className="space-y-2 text-xs text-heritage-700">
                  <p><strong>Garment:</strong> {selectedGarment}</p>
                  <p><strong>Fabric:</strong> {selectedFabric}</p>
                  <p><strong>Collar / Lapel:</strong> {selectedCollar}</p>
                  <p><strong>Fit:</strong> {selectedFit}</p>
                </div>

                {submitted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <p className="font-bold">Consultation Enquiry Submitted!</p>
                    <p>Our master tailoring team in Jaipur will reach out to schedule your measurement session.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitCustomEnquiry} className="space-y-3 pt-3 border-t border-heritage-100">
                    <div>
                      <label className="block text-[11px] font-semibold text-heritage-800 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Yashwardhan Rathore"
                        className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-heritage-800 mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-heritage-800 mb-1">Custom Notes / Event Date</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Wedding scheduled for December in Jaipur"
                        className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-heritage-900 hover:bg-heritage-800 text-gold font-bold text-xs rounded transition flex items-center justify-center space-x-2"
                    >
                      <Scissors className="w-4 h-4 text-gold" />
                      <span>{submitting ? 'Submitting...' : 'Send Bespoke Enquiry'}</span>
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded transition flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Discuss Directly on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
