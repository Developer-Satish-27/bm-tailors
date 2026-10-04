'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { useLanguage } from '@/lib/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { Home, Compass, MessageCircle, ShoppingBag, User } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { language } = useLanguage();

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { placement: 'mobile_bottom_nav' });
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
    window.open(
      `https://wa.me/${waNumber}?text=Namaste%20B%20M%20Tailors,%20I%20would%20like%20to%20enquire%20about%20men's%20tailoring.`,
      '_blank'
    );
  };

  // Only show on customer facing routes
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-heritage-200 py-2 px-3 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center text-[10px] font-medium transition ${
            pathname === '/' ? 'text-heritage-900 font-bold' : 'text-heritage-500 hover:text-heritage-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>{language === 'hi' ? 'होम' : 'Home'}</span>
        </Link>

        {/* Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center text-[10px] font-medium transition ${
            pathname.startsWith('/shop') ? 'text-heritage-900 font-bold' : 'text-heritage-500 hover:text-heritage-900'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>{language === 'hi' ? 'शॉप' : 'Shop'}</span>
        </Link>

        {/* WhatsApp */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="flex flex-col items-center justify-center text-[10px] font-medium text-emerald-700 hover:text-emerald-800 transition"
        >
          <div className="p-1.5 bg-emerald-100 rounded-full mb-0.5 text-emerald-600">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span>WhatsApp</span>
        </button>

        {/* Cart */}
        <Link
          href="/cart"
          className={`relative flex flex-col items-center justify-center text-[10px] font-medium transition ${
            pathname === '/cart' ? 'text-heritage-900 font-bold' : 'text-heritage-500 hover:text-heritage-900'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-heritage-900 text-gold text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span>{language === 'hi' ? 'कार्ट' : 'Cart'}</span>
        </Link>

        {/* Account */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center text-[10px] font-medium transition ${
            pathname.startsWith('/account') ? 'text-heritage-900 font-bold' : 'text-heritage-500 hover:text-heritage-900'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>{language === 'hi' ? 'अकाउंट' : 'Account'}</span>
        </Link>
      </div>
    </nav>
  );
}
