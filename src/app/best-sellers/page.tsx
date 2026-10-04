import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/product/ProductCard';
import { Award, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Best Sellers & Timeless Classics | B M Tailors Jaipur',
  description:
    'Our most celebrated bespoke Bandhgalas, executive suits, royal sherwanis, and ready-to-wear shirts crafted since 1990.',
};

export default async function BestSellersPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isBestSeller: true },
    include: {
      category: true,
      media: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="bg-heritage-900 text-white rounded-2xl p-8 sm:p-14 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-gold/40 text-xs text-gold">
            <Award className="w-3.5 h-3.5" />
            <span>Patron Favorites Since 1990</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Best Sellers & Iconic Cuts
          </h1>
          <p className="text-sm text-heritage-300 leading-relaxed">
            The defining silhouettes that have shaped B M Tailors across three decades in Jaipur. Handcrafted with master precision, floating canvas chest construction, and premium fabrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
