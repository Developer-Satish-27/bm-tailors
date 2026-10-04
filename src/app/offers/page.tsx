import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/product/ProductCard';
import { Sparkles, Tag, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Special Offers & Promotions | B M Tailors Jaipur',
  description:
    'Exclusive promotional vouchers, festival offers, and discounts on luxury bespoke tailoring and ready-made menswear from B M Tailors.',
};

export default async function OffersPage() {
  const [coupons, saleProducts] = await Promise.all([
    prisma.coupon.findMany({
      where: { isActive: true },
      orderBy: { value: 'desc' },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [{ isOnSale: true }, { compareAtPrice: { gt: 0 } }],
      },
      include: {
        category: true,
        media: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
      },
      take: 8,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Offers Banner */}
      <div className="bg-heritage-900 text-white rounded-2xl p-8 sm:p-14 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-gold/40 text-xs text-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Jaipur Atelier Privileges</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Offers & Atelier Promotions
          </h1>
          <p className="text-xs sm:text-sm text-heritage-300 leading-relaxed">
            Apply seasonal promotional codes at checkout or discover ready-made menswear available at special atelier pricing.
          </p>
        </div>
      </div>

      {/* Active Coupons Grid */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-gold-dark uppercase">Available Coupons</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-900 mt-1">
            Exclusive Promotional Codes
          </h2>
          <p className="text-xs text-heritage-600 mt-1">
            Copy and apply these voucher codes directly in your shopping bag or checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="p-6 bg-white rounded-xl border-2 border-dashed border-heritage-300 hover:border-gold transition space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-heritage-900 text-gold font-bold text-xs rounded tracking-wider font-mono">
                  {c.code}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                  {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                </span>
              </div>

              <div className="space-y-1 text-xs text-heritage-700">
                <p className="font-bold text-heritage-900 text-sm">
                  {c.type === 'PERCENTAGE'
                    ? `Save ${c.value}% on your entire purchase`
                    : `Flat ₹${c.value} discount on your cart`}
                </p>
                <p className="text-[11px] text-heritage-500">
                  Minimum cart value: ₹{c.minimumCartValue.toLocaleString('en-IN')}
                </p>
                {c.maximumDiscount && (
                  <p className="text-[11px] text-heritage-500">
                    Maximum savings limit: ₹{c.maximumDiscount.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-heritage-100 flex items-center justify-between text-[11px] text-heritage-500">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
                  <span>Verified Store Coupon</span>
                </span>
                <Link
                  href="/shop"
                  className="font-bold text-heritage-900 hover:text-gold-dark flex items-center space-x-1"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Garments on Sale / Promotional Pricing */}
      {saleProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-heritage-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-gold-dark uppercase">Seasonal Reductions</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-900 mt-1">
                Promotional Ready-to-Wear
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-2 sm:mt-0 text-xs font-bold text-heritage-900 hover:text-gold-dark flex items-center space-x-1"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
