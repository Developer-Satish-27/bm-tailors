'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Calendar,
  Building2,
  Star,
  Ticket,
  FileText,
  Plus,
  ExternalLink,
} from 'lucide-react';

export function AdminHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/uniforms', label: 'Uniforms', icon: Building2 },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { href: '/admin/cms', label: 'CMS & Settings', icon: FileText },
  ];

  return (
    <header className="bg-heritage-900 text-white rounded-2xl shadow-lg border border-heritage-800 overflow-hidden mb-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-heritage-800/80">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-white p-1 border border-gold/40 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
            <Image
              src="/images/bm-tailor-logo.jpg"
              alt="B.M. TAILOR Official Logo"
              width={48}
              height={48}
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide">
                B.M. TAILOR Atelier Administration
              </h1>
            </div>
            <p className="text-xs text-heritage-400 mt-0.5">
              Production Portal • Jaipur, Rajasthan • Est. 1990
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-gold hover:bg-gold-light text-heritage-900 font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-heritage-800 hover:bg-heritage-700 text-heritage-200 rounded-lg flex items-center space-x-1.5 transition border border-heritage-700/60"
          >
            <span>Public Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-heritage-400" />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center space-x-1 px-4 py-2 overflow-x-auto bg-heritage-950/40 scrollbar-none text-xs">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gold text-heritage-900 font-bold shadow-sm'
                  : 'text-heritage-300 hover:text-white hover:bg-heritage-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-heritage-900' : 'text-heritage-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
