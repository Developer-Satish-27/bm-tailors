'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Award, MessageCircle } from 'lucide-react';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-heritage-900 text-heritage-100 border-t border-heritage-800 pt-16 pb-24 lg:pb-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3.5 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-lg bg-white p-1 border border-gold/40 shadow-sm shrink-0">
                <Image
                  src="/images/bm-tailor-logo.jpg"
                  alt="B.M. TAILOR Logo"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-gold transition">
                  B.M. TAILOR
                </span>
                <p className="text-xs text-gold tracking-widest font-semibold uppercase mt-0.5">
                  ESTABLISHED 1990 • JAIPUR, RAJASTHAN
                </p>
              </div>
            </Link>
            <p className="text-xs text-heritage-400 leading-relaxed max-w-sm">
              {t.brand.heritageStory}
            </p>
            <div className="pt-2 flex flex-wrap gap-3 text-xs text-heritage-300">
              <span className="flex items-center space-x-1.5 bg-heritage-800 px-2.5 py-1 rounded border border-heritage-700">
                <Award className="w-3.5 h-3.5 text-gold" />
                <span>Since 1990</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-heritage-800 px-2.5 py-1 rounded border border-heritage-700">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>Jaipur Ateliers</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-heritage-800 px-2.5 py-1 rounded border border-heritage-700">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Bespoke Quality</span>
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold">
              {language === 'hi' ? 'श्रेणियां' : 'Collections'}
            </h4>
            <ul className="space-y-2 text-xs text-heritage-300">
              <li>
                <Link href="/shop?category=mens-western-wear" className="hover:text-gold transition">
                  Men's Western Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=suits-tuxedos" className="hover:text-gold transition">
                  Suits & Tuxedos
                </Link>
              </li>
              <li>
                <Link href="/shop?category=traditional-ethnic-wear" className="hover:text-gold transition">
                  Traditional Bandhgalas
                </Link>
              </li>
              <li>
                <Link href="/wedding" className="hover:text-gold transition">
                  Groom Sherwanis
                </Link>
              </li>
              <li>
                <Link href="/shop?category=indo-western" className="hover:text-gold transition">
                  Indo-Western Ensembles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=boys-collection" className="hover:text-gold transition">
                  Boys Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?category=ready-made" className="hover:text-gold transition">
                  Ready-to-Wear Shirts
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold">
              {language === 'hi' ? 'सिलाई सेवाएं' : 'Atelier & Services'}
            </h4>
            <ul className="space-y-2 text-xs text-heritage-300">
              <li>
                <Link href="/custom-tailoring" className="hover:text-gold transition">
                  Custom Tailoring (7-Step Process)
                </Link>
              </li>
              <li>
                <Link href="/wedding" className="hover:text-gold transition">
                  Wedding & Groom Styling
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-gold transition">
                  Book Store Appointment
                </Link>
              </li>
              <li>
                <Link href="/uniforms" className="hover:text-gold transition">
                  Bulk Uniform Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/account?tab=measurements" className="hover:text-gold transition">
                  Saved Body Measurements
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-gold transition">
                  7-Day Ready-made Exchange Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Contact Placeholders */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold">
              {language === 'hi' ? 'संपर्क एवं स्टोर' : 'Atelier Contact'}
            </h4>
            <div className="space-y-2 text-xs text-heritage-300">
              <p className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                <span>Two Atelier Branches in Jaipur, Rajasthan</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>[BUSINESS PHONE]</span>
              </p>
              <p className="flex items-center space-x-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: [WHATSAPP NUMBER]</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>[BUSINESS EMAIL]</span>
              </p>
              <p className="flex items-center space-x-2 text-[11px] text-heritage-400 pt-1">
                <Clock className="w-3 h-3 text-gold flex-shrink-0" />
                <span>Mon - Sun: 10:30 AM - 9:00 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Policies and Copyright */}
        <div className="mt-12 pt-8 border-t border-heritage-800 text-xs text-heritage-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 1990 — {new Date().getFullYear()} B M Tailors. All Rights Reserved. Jaipur, Rajasthan, India.</p>
          <div className="flex flex-wrap items-center gap-4 text-heritage-400">
            <Link href="/policies#exchange" className="hover:text-gold transition">
              Exchange Policy (7 Days)
            </Link>
            <span>•</span>
            <Link href="/policies#cod" className="hover:text-gold transition">
              COD Terms
            </Link>
            <span>•</span>
            <Link href="/policies#shipping" className="hover:text-gold transition">
              Jaipur Delivery
            </Link>
            <span>•</span>
            <Link href="/policies#privacy" className="hover:text-gold transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/policies#terms" className="hover:text-gold transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
