'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { trackEvent } from '@/lib/analytics';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  MessageCircle,
  Phone,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { itemCount, wishlistIds } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackEvent('search', { query: searchQuery.trim() });
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { placement: 'header' });
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
    window.open(`https://wa.me/${waNumber}?text=Namaste%20B%20M%20Tailors,%20I%20would%20like%20to%20enquire%20about%20your%20collection%20and%20tailoring.`, '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-heritage-100 shadow-sm">
      {/* Top Heritage Notice Bar */}
      <div className="bg-heritage-900 text-heritage-100 py-2 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-xs font-medium border-b border-heritage-800">
        <div className="w-full flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="tracking-wide">Jaipur Ateliers Since 1990 • Urban Jaipur Fast Dispatch</span>
          </div>
          <div className="flex items-center gap-3 text-xs whitespace-nowrap">
            {/* Language Switcher */}
            <div className="flex items-center bg-heritage-800 rounded-lg p-0.5 border border-heritage-700/80">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap transition ${
                  language === 'en' ? 'bg-gold text-heritage-900 shadow-sm' : 'text-heritage-200 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap transition ${
                  language === 'hi' ? 'bg-gold text-heritage-900 shadow-sm' : 'text-heritage-200 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            <Link
              href="/admin/dashboard"
              className="hidden md:inline-flex items-center px-2.5 py-1 rounded-md text-gold hover:text-gold-light hover:bg-heritage-800 transition whitespace-nowrap"
            >
              Admin Portal
            </Link>

            <a
              href="tel:[BUSINESS PHONE]"
              onClick={() => trackEvent('phone_click', { placement: 'top_bar' })}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-heritage-200 hover:text-gold hover:bg-heritage-800 transition whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>[BUSINESS PHONE]</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Bar (Full Screen Width) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-heritage-900 hover:text-gold transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Identity / Official Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 overflow-hidden rounded-md border border-heritage-200/80 shadow-sm bg-white p-0.5">
                <Image
                  src="/images/bm-tailor-logo.jpg"
                  alt="B.M. TAILOR Official Brand Logo"
                  width={52}
                  height={52}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-heritage-900 group-hover:text-gold-dark transition duration-200">
                  B.M. TAILOR
                </span>
                <div className="flex items-center space-x-1.5 text-[9px] sm:text-[10px] tracking-widest text-heritage-500 font-semibold uppercase">
                  <span>ESTD. 1990</span>
                  <span>•</span>
                  <span className="text-gold-dark">JAIPUR</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links with Equal Padding, Margins & Whitespace-Nowrap */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium">
            <Link
              href="/shop"
              className="px-3 py-2 rounded-lg text-heritage-800 hover:text-gold-dark hover:bg-heritage-50/80 whitespace-nowrap transition-all duration-150"
            >
              {t.nav.shop}
            </Link>
            <Link
              href="/wedding"
              className="px-3 py-2 rounded-lg text-amber-900 font-semibold hover:text-gold-dark hover:bg-amber-50/60 whitespace-nowrap transition-all duration-150"
            >
              {t.nav.weddingCollection}
            </Link>
            <Link
              href="/custom-tailoring"
              className="px-3 py-2 rounded-lg text-heritage-800 hover:text-gold-dark hover:bg-heritage-50/80 whitespace-nowrap transition-all duration-150"
            >
              {t.nav.customTailoring}
            </Link>
            <Link
              href="/uniforms"
              className="px-3 py-2 rounded-lg text-heritage-800 hover:text-gold-dark hover:bg-heritage-50/80 whitespace-nowrap transition-all duration-150"
            >
              {t.nav.uniforms}
            </Link>
            <Link
              href="/shop?filter=bestseller"
              className="px-3 py-2 rounded-lg text-heritage-800 hover:text-gold-dark hover:bg-heritage-50/80 whitespace-nowrap transition-all duration-150"
            >
              {t.nav.bestSellers}
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 rounded-lg text-heritage-800 hover:text-gold-dark hover:bg-heritage-50/80 whitespace-nowrap transition-all duration-150"
            >
              {t.nav.aboutUs}
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 rounded-lg text-heritage-800 hover:text-gold-dark hover:bg-heritage-50/80 whitespace-nowrap transition-all duration-150"
            >
              {t.nav.contact}
            </Link>
          </nav>

          {/* Search, WhatsApp & Actions with Equal Dimensions & Symmetrical Padding */}
          <div className="flex items-center gap-2 xl:gap-3">
            {/* Desktop Search form */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative">
              <input
                type="text"
                placeholder={language === 'hi' ? 'खोजें (सूट, शेरवानी)...' : 'Search suits, sherwanis, kurtas...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 2xl:w-64 pl-9 pr-3 h-10 text-xs bg-heritage-50/90 border border-heritage-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
              <Search className="w-4 h-4 text-heritage-500 absolute left-3 top-3 pointer-events-none" />
            </form>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppClick}
              className="hidden sm:inline-flex items-center space-x-1.5 h-10 px-3.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 rounded-lg whitespace-nowrap transition-all"
              title="Chat with Master Tailor on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>WhatsApp</span>
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/account?tab=wishlist"
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-heritage-700 hover:text-gold-dark hover:bg-heritage-50 border border-transparent hover:border-heritage-200 transition-all"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-heritage-900 rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-heritage-700 hover:text-gold-dark hover:bg-heritage-50 border border-transparent hover:border-heritage-200 transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-heritage-900 text-gold rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              href="/account"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-heritage-700 hover:text-gold-dark hover:bg-heritage-50 border border-transparent hover:border-heritage-200 transition-all"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-heritage-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder={language === 'hi' ? 'खोजें (सूट, शेरवानी)...' : 'Search suits, sherwanis, fabrics...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-heritage-50 border border-heritage-200 rounded-lg focus:outline-none focus:border-gold"
            />
            <Search className="w-4 h-4 text-heritage-500 absolute left-3 top-3 pointer-events-none" />
          </form>

          <div className="flex flex-col gap-1 font-medium text-heritage-900 text-sm">
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-heritage-50 whitespace-nowrap transition"
            >
              {t.nav.shop}
            </Link>
            <Link
              href="/wedding"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-amber-900 font-semibold hover:bg-amber-50/60 whitespace-nowrap transition"
            >
              {t.nav.weddingCollection}
            </Link>
            <Link
              href="/custom-tailoring"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-heritage-50 whitespace-nowrap transition"
            >
              {t.nav.customTailoring}
            </Link>
            <Link
              href="/uniforms"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-heritage-50 whitespace-nowrap transition"
            >
              {t.nav.uniforms}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-heritage-50 whitespace-nowrap transition"
            >
              {t.nav.aboutUs}
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-heritage-50 whitespace-nowrap transition"
            >
              {t.nav.contact}
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-gold-dark font-semibold hover:bg-heritage-50 whitespace-nowrap transition"
            >
              {t.nav.admin}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
