import React, { Suspense } from 'react';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/product/ProductCard';
import { ShopFilters } from '@/components/shop/ShopFilters';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ShopPageProps {
  searchParams: {
    category?: string;
    search?: string;
    size?: string;
    color?: string;
    fabric?: string;
    filter?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search, size, color, fabric, filter, minPrice, maxPrice } = searchParams;

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  const where: Record<string, any> = {
    isActive: true,
  };

  if (category) {
    where.category = { slug: category };
  }

  if (filter === 'bestseller') {
    where.isBestSeller = true;
  } else if (filter === 'new') {
    where.isNewArrival = true;
  }

  if (minPrice || maxPrice) {
    where.basePrice = {
      ...(minPrice ? { gte: Number(minPrice) } : {}),
      ...(maxPrice ? { lte: Number(maxPrice) } : {}),
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { fabricDetails: { contains: search } },
      { occasion: { contains: search } },
    ];
  }

  if (size || color || fabric) {
    where.variants = {
      some: {
        isActive: true,
        ...(size ? { size: { contains: size } } : {}),
        ...(color ? { color: { contains: color } } : {}),
        ...(fabric ? { fabric: { contains: fabric } } : {}),
      },
    };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      media: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const currentCategoryObj = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalogue Title Banner */}
      <div className="bg-heritage-900 text-white rounded-xl p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-semibold text-gold tracking-widest uppercase">
            B M Tailors Jaipur Catalogue
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            {currentCategoryObj ? currentCategoryObj.name : 'The Complete Collection'}
          </h1>
          <p className="text-xs sm:text-sm text-heritage-300 leading-relaxed">
            {currentCategoryObj?.description ||
              'Discover handcrafted bespoke cuts, royal Rajasthani heritage ensembles, executive suits, and immediate ready-to-wear essentials.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Dynamic Filters Sidebar */}
        <div className="lg:col-span-1">
          <Suspense fallback={<div className="p-4 bg-white rounded-xl border text-xs text-heritage-500">Loading filters...</div>}>
            <ShopFilters categories={categories} />
          </Suspense>
        </div>

        {/* Product Grid & Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-heritage-200 text-xs text-heritage-600">
            <p>
              Showing <span className="font-bold text-heritage-900">{products.length}</span> pieces
              {category && <span> in <strong className="text-heritage-900">{currentCategoryObj?.name}</strong></span>}
              {search && <span> matching "<strong className="text-heritage-900">{search}</strong>"</span>}
            </p>
          </div>

          {products.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-heritage-300 space-y-4">
              <Sparkles className="w-10 h-10 text-gold-dark mx-auto" />
              <h3 className="font-serif text-lg font-bold text-heritage-900">
                No products found
              </h3>
              <p className="text-xs text-heritage-600 max-w-md mx-auto">
                We could not find items matching your active filter criteria. Try clearing applied filters or explore our broad categories.
              </p>
              <div>
                <a
                  href="/shop"
                  className="inline-block px-5 py-2.5 bg-heritage-900 text-gold text-xs font-bold rounded hover:bg-heritage-800 transition"
                >
                  Clear All Filters & Browse
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
