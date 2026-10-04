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
      <div className="bg-heritage-900 text-heritage-100 py-1.5 px-4 text-xs font-medium border-b border-heritage-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span>Jaipur Ateliers Since 1990 • Urban Jaipur Fast Dispatch</span>
          </div>
          <div className="flex items-center space-x-6 text-xs">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1.5 bg-heritage-800 px-2 py-0.5 rounded border border-heritage-700">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded transition ${
                  language === 'en' ? 'bg-gold text-heritage-900 font-bold' : 'text-heritage-100 hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="text-heritage-500">|</span>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 rounded transition ${
                  language === 'hi' ? 'bg-gold text-heritage-900 font-bold' : 'text-heritage-100 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            <Link
              href="/admin/dashboard"
              className="hidden md:inline-flex items-center text-gold hover:text-gold-light transition"
            >
              Admin Portal
            </Link>

            <a
              href="tel:[BUSINESS PHONE]"
              onClick={() => trackEvent('phone_click', { placement: 'top_bar' })}
              className="flex items-center space-x-1 text-heritage-100 hover:text-gold transition"
            >
              <Phone className="w-3 h-3 text-gold" />
              <span>[BUSINESS PHONE]</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-heritage-800">
            <Link href="/shop" className="hover:text-gold-dark transition">
              {t.nav.shop}
            </Link>
            <Link href="/wedding" className="hover:text-gold-dark transition text-amber-900 font-semibold">
              {t.nav.weddingCollection}
            </Link>
            <Link href="/custom-tailoring" className="hover:text-gold-dark transition">
              {t.nav.customTailoring}
            </Link>
            <Link href="/uniforms" className="hover:text-gold-dark transition">
              {t.nav.uniforms}
            </Link>
            <Link href="/shop?filter=bestseller" className="hover:text-gold-dark transition">
              {t.nav.bestSellers}
            </Link>
            <Link href="/about" className="hover:text-gold-dark transition">
              {t.nav.aboutUs}
            </Link>
            <Link href="/contact" className="hover:text-gold-dark transition">
              {t.nav.contact}
            </Link>
          </nav>

          {/* Search, WhatsApp & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Desktop Search form */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative">
              <input
                type="text"
                placeholder={language === 'hi' ? 'खोजें (सूट, शेरवानी, कुर्ता)...' : 'Search suits, sherwanis, kurtas...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 pl-9 pr-3 py-1.5 text-xs bg-heritage-50 border border-heritage-200 rounded-full focus:outline-none focus:border-gold focus:w-64 transition-all"
              />
              <Search className="w-4 h-4 text-heritage-500 absolute left-3 top-2 pointer-events-none" />
            </form>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppClick}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition"
              title="Chat with Master Tailor on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/account?tab=wishlist"
              className="relative p-2 text-heritage-700 hover:text-gold transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-heritage-900 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-heritage-700 hover:text-gold transition"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-heritage-900 text-gold rounded-full text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              href="/account"
              className="p-2 text-heritage-700 hover:text-gold transition"
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

          <div className="flex flex-col space-y-3 font-medium text-heritage-900 text-sm">
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 border-b border-heritage-50"
            >
              {t.nav.shop}
            </Link>
            <Link
              href="/wedding"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 text-amber-900 font-semibold border-b border-heritage-50"
            >
              {t.nav.weddingCollection}
            </Link>
            <Link
              href="/custom-tailoring"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 border-b border-heritage-50"
            >
              {t.nav.customTailoring}
            </Link>
            <Link
              href="/uniforms"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 border-b border-heritage-50"
            >
              {t.nav.uniforms}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 border-b border-heritage-50"
            >
              {t.nav.aboutUs}
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 border-b border-heritage-50"
            >
              {t.nav.contact}
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 text-gold-dark font-semibold"
            >
              {t.nav.admin}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
