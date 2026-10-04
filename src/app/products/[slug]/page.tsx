import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { media: true },
  });

  if (!product) return { title: 'Product Not Found | B M Tailors' };

  return {
    title: `${product.name} | B M Tailors Jaipur Since 1990`,
    description: product.shortDescription || product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | B M Tailors`,
      description: product.shortDescription || product.description.substring(0, 160),
      images: product.media.length > 0 ? [{ url: product.media[0].url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      media: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true }, orderBy: { price: 'asc' } },
      reviews: { where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      category: true,
      media: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true } },
    },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <ProductDetailClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-heritage-200">
          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest text-gold-dark uppercase">
              Curated Recommendations
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-900">
              You May Also Admire
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
