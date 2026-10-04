import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/product/ProductCard';
import { AppointmentBookingModal } from '@/components/appointment/AppointmentBookingModal';
import { Sparkles, Calendar, MessageCircle, ArrowRight, Crown } from 'lucide-react';

export const revalidate = 60;

export default async function WeddingPage() {
  const weddingProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        slug: { in: ['sherwani', 'indo-western', 'traditional-ethnic-wear', 'suits-tuxedos'] },
      },
    },
    include: {
      category: true,
      media: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  return (
    <div className="space-y-16 lg:space-y-24 py-10">
      {/* Wedding Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[60vh] bg-heritage-900 rounded-2xl overflow-hidden flex items-center p-8 sm:p-14 text-white shadow-2xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80"
              alt="B M Tailors Royal Wedding Collection"
              fill
              priority
              className="object-cover object-top opacity-30 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-heritage-900 via-heritage-900/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-gold/40 text-xs text-gold">
              <Crown className="w-3.5 h-3.5" />
              <span>Jaipur Imperial Groom Atelier</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              The Royal Wedding Collection
            </h1>
            <p className="text-sm sm:text-base text-heritage-300 leading-relaxed">
              Crafted exclusively for the royal Indian groom and his entourage. From handcrafted zardozi sherwanis and bespoke Jodhpuri Bandhgalas to Italian-cut cocktail tuxedos.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <AppointmentBookingModal defaultType="WEDDING_CONSULTATION" buttonLabel="Book Wedding Consultation" />
              <Link
                href="/custom-tailoring"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded text-xs transition border border-white/20 flex items-center space-x-2"
              >
                <span>Custom Made-to-Measure</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-gold-dark uppercase">Ensembles</span>
          <h2 className="font-serif text-3xl font-bold text-heritage-900">
            Wedding Sartorial Silhouettes
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Royal Sherwani', slug: 'sherwani', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80' },
            { title: 'Indo-Western', slug: 'indo-western', img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80' },
            { title: 'Jodhpuri Bandhgala', slug: 'traditional-ethnic-wear', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80' },
            { title: 'Nehru Jackets', slug: 'indian-wear', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80' },
            { title: 'Three-Piece Suits', slug: 'mens-western-wear', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80' },
            { title: 'Black-Tie Tuxedos', slug: 'suits-tuxedos', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80' },
          ].map((cat) => (
            <Link
              key={cat.title}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-heritage-900 shadow hover:shadow-xl transition"
            >
              <Image src={cat.img} alt={cat.title} fill className="object-cover opacity-80 group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-white">
                <span className="font-serif font-bold text-xs sm:text-sm group-hover:text-gold transition">
                  {cat.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Wedding Ensembles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-gold-dark uppercase">Available to Order</p>
            <h2 className="font-serif text-3xl font-bold text-heritage-900">Featured Wedding Pieces</h2>
          </div>
          <Link
            href="/shop"
            className="mt-2 sm:mt-0 text-xs font-bold text-heritage-900 hover:text-gold-dark flex items-center space-x-1"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {weddingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
