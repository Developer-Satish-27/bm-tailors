'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { AppointmentBookingModal } from '../appointment/AppointmentBookingModal';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

export function HeroSection() {
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    trackEvent('whatsapp_click', { placement: 'hero_section' });
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
    window.open(
      `https://wa.me/${waNumber}?text=Namaste%20B%20M%20Tailors,%20I%20would%20like%20to%20consult%20regarding%20custom%20tailoring.`,
      '_blank'
    );
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] bg-heritage-900 text-white flex items-center overflow-hidden">
      {/* Background Editorial Image with Luxury Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=2000&q=85"
          alt="B M Tailors Bespoke Craftsmanship"
          fill
          priority
          className="object-cover object-top opacity-35 filter brightness-75 scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-900 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl space-y-6">
          {/* Heritage Tag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-gold/30 text-xs font-semibold tracking-wider text-gold-light uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>ESTD. 1990 • JAIPUR, RAJASTHAN</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            {t.hero.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-heritage-300 font-normal leading-relaxed max-w-xl">
            {t.hero.subheadline}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="px-7 py-3.5 bg-gold hover:bg-gold-light text-heritage-900 font-bold rounded text-sm transition shadow-lg hover:shadow-gold/20 flex items-center space-x-2 group"
            >
              <span>{t.hero.shopCTA}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>

            <AppointmentBookingModal defaultType="CUSTOM_TAILORING" buttonLabel={t.hero.bookCTA} />

            <button
              type="button"
              onClick={handleWhatsApp}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded text-sm transition border border-white/20 flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{t.hero.whatsappCTA}</span>
            </button>
          </div>

          {/* Trust points banner */}
          <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-xs text-heritage-300">
            <div>
              <p className="font-serif text-lg font-bold text-white">34+ Years</p>
              <p className="text-[11px] text-heritage-400">Jaipur Tailoring Legacy</p>
            </div>
            <div>
              <p className="font-serif text-lg font-bold text-white">2 Ateliers</p>
              <p className="text-[11px] text-heritage-400">Centrally in Jaipur</p>
            </div>
            <div>
              <p className="font-serif text-lg font-bold text-white">Bespoke</p>
              <p className="text-[11px] text-heritage-400">Made-to-Measure & Ready</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
