'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, RotateCcw } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export function ShopFilters({ categories }: { categories: CategoryItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSize = searchParams.get('size') || '';
  const currentFabric = searchParams.get('fabric') || '';
  const currentFilter = searchParams.get('filter') || '';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleClear = () => {
    router.push('/shop');
  };

  const sizes = ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', 'Kids'];
  const fabrics = ['Italian Wool', 'Raw Silk', 'Pure Linen', 'Egyptian Cotton'];

  return (
    <div className="bg-white p-5 rounded-xl border border-heritage-200 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-heritage-100">
        <div className="flex items-center space-x-2 text-xs font-bold text-heritage-900 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-gold-dark" />
          <span>Refine Selection</span>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-[11px] text-heritage-500 hover:text-gold-dark flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-heritage-900 uppercase tracking-wide">Category</h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => updateParam('category', '')}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition ${
              !currentCategory ? 'bg-heritage-900 text-gold font-bold' : 'text-heritage-700 hover:bg-heritage-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => updateParam('category', c.slug)}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition ${
                currentCategory === c.slug
                  ? 'bg-heritage-900 text-gold font-bold'
                  : 'text-heritage-700 hover:bg-heritage-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-2 pt-2 border-t border-heritage-100">
        <h4 className="text-xs font-bold text-heritage-900 uppercase tracking-wide">Highlights</h4>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => updateParam('filter', currentFilter === 'bestseller' ? '' : 'bestseller')}
            className={`px-2.5 py-1 text-xs rounded-full border transition ${
              currentFilter === 'bestseller'
                ? 'bg-heritage-900 text-gold border-heritage-900 font-bold'
                : 'bg-heritage-50 text-heritage-700 border-heritage-200 hover:border-gold'
            }`}
          >
            Best Sellers
          </button>
          <button
            type="button"
            onClick={() => updateParam('filter', currentFilter === 'new' ? '' : 'new')}
            className={`px-2.5 py-1 text-xs rounded-full border transition ${
              currentFilter === 'new'
                ? 'bg-heritage-900 text-gold border-heritage-900 font-bold'
                : 'bg-heritage-50 text-heritage-700 border-heritage-200 hover:border-gold'
            }`}
          >
            New Arrivals
          </button>
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-2 pt-2 border-t border-heritage-100">
        <h4 className="text-xs font-bold text-heritage-900 uppercase tracking-wide">Size</h4>
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => updateParam('size', currentSize === s ? '' : s)}
              className={`px-2 py-1 text-xs rounded border transition ${
                currentSize === s
                  ? 'bg-heritage-900 text-gold border-heritage-900 font-bold'
                  : 'bg-white text-heritage-700 border-heritage-200 hover:border-gold'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Fabric Filter */}
      <div className="space-y-2 pt-2 border-t border-heritage-100">
        <h4 className="text-xs font-bold text-heritage-900 uppercase tracking-wide">Fabric Selection</h4>
        <div className="space-y-1">
          {fabrics.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => updateParam('fabric', currentFabric === f ? '' : f)}
              className={`w-full text-left px-2.5 py-1 text-xs rounded transition ${
                currentFabric === f
                  ? 'bg-heritage-900 text-gold font-bold'
                  : 'text-heritage-700 hover:bg-heritage-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
