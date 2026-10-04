'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';
import { Heart, Scissors } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    compareAtPrice?: number | null;
    category?: { name: string; slug: string } | null;
    media?: Array<{ url: string; altText?: string | null }>;
    variants?: Array<{ id: string; size: string; stockQuantity: number }>;
  };
}

export function ProductCard({ product }: { product: ProductCardProps['product'] }) {
  const { wishlistIds, toggleWishlist } = useCart();
  const isWishlisted = wishlistIds.includes(product.id);

  const mainImage = product.media && product.media.length > 0
    ? product.media[0].url
    : 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80';

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.basePrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border border-heritage-200 overflow-hidden hover:shadow-md transition duration-300">
      {/* Image container */}
      <div className="relative aspect-[3/4] bg-heritage-100 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top group-hover:scale-105 transition duration-500"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-2.5 left-2.5 bg-heritage-900 text-gold text-[10px] font-bold px-2 py-0.5 rounded shadow">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow'
              : 'bg-white/80 text-heritage-600 hover:text-rose-600'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <Link
            href={`/products/${product.slug}`}
            className="w-full block py-2 bg-heritage-900/90 backdrop-blur hover:bg-heritage-900 text-white text-xs font-semibold text-center rounded transition shadow"
          >
            Select Size & Details
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-2">
        <div>
          {product.category && (
            <p className="text-[11px] font-semibold tracking-wider text-gold-dark uppercase mb-1">
              {product.category.name}
            </p>
          )}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-sm sm:text-base font-bold text-heritage-900 group-hover:text-gold-dark transition line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Available Sizes preview */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-wrap gap-1 text-[10px] text-heritage-500">
            <span className="font-medium text-heritage-400">Sizes:</span>
            {product.variants.slice(0, 4).map((v) => (
              <span key={v.id} className="bg-heritage-50 px-1 py-0.5 rounded border border-heritage-100">
                {v.size.split(' ')[0]}
              </span>
            ))}
            {product.variants.length > 4 && <span>+{product.variants.length - 4}</span>}
          </div>
        )}

        {/* Pricing */}
        <div className="pt-1 flex items-baseline space-x-2">
          <span className="font-bold text-sm sm:text-base text-heritage-900">
            ₹{product.basePrice.toLocaleString('en-IN')}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
            <span className="text-xs text-heritage-400 line-through">
              ₹{product.compareAtPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
