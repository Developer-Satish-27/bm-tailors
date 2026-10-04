import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/product/ProductCard';
import { HeroSection } from '@/components/home/HeroSection';
import { AppointmentBookingModal } from '@/components/appointment/AppointmentBookingModal';
import {
  ShieldCheck,
  Scissors,
  Award,
  Truck,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
  Calendar,
  Layers,
} from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation every minute

export default async function HomePage() {
  const [categories, bestSellers, sherwanis, suits, boys] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true, isBestSeller: true },
      include: {
        category: true,
        media: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
        reviews: { where: { status: 'APPROVED' } },
      },
      take: 4,
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        category: { slug: 'sherwani' },
      },
      include: {
        category: true,
        media: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
      },
      take: 2,
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        category: { slug: { in: ['suits-tuxedos', 'mens-western-wear'] } },
      },
      include: {
        category: true,
        media: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
      },
      take: 2,
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        category: { slug: 'boys-collection' },
      },
      include: {
        category: true,
        media: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
      },
      take: 2,
    }),
  ]);

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold tracking-widest text-gold-dark uppercase mb-1">
            Curated Menswear
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-sm text-heritage-600 mt-2">
            Explore our ready-to-wear pieces and made-to-measure tailoring categories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-lg bg-heritage-900 aspect-[3/4] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition duration-700 opacity-80 group-hover:opacity-90"
                />
              ) : (
                <div className="w-full h-full bg-heritage-800 flex items-center justify-center">
                  <Scissors className="w-8 h-8 text-gold" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                <p className="text-[11px] font-semibold text-gold tracking-widest uppercase">Explore</p>
                <h3 className="font-serif text-lg sm:text-xl font-bold group-hover:text-gold transition">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Wedding Collection Spotlight */}
      <section className="bg-heritage-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-heritage-800 border border-gold/30 rounded-full text-xs text-gold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Imperial Wedding Atelier</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Crafted for the Royal Groom
              </h2>
              <p className="text-sm sm:text-base text-heritage-300 leading-relaxed">
                From hand-embroidered raw silk sherwanis and bespoke Jodhpuri Bandhgalas to Italian cut tuxedos and layered Indo-Western sets, B M Tailors has styled Jaipur’s finest grooms for generations.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs text-heritage-200 pt-2">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span>Royal Groom Sherwanis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span>Indo-Western Achkans</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span>Jodhpuri Bandhgalas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span>Black-Tie Tuxedos</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/wedding"
                  className="px-6 py-3 bg-gold hover:bg-gold-light text-heritage-900 font-bold rounded text-sm transition shadow-lg flex items-center space-x-2"
                >
                  <span>Explore Wedding Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <AppointmentBookingModal defaultType="WEDDING_CONSULTATION" />
              </div>
            </div>

            {/* Wedding Visual Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sherwanis.map((p) => (
                <div key={p.id} className="bg-heritage-800 rounded-lg p-3 border border-heritage-700 shadow-xl">
                  <div className="relative aspect-[3/4] rounded overflow-hidden mb-3">
                    {p.media[0] && (
                      <Image
                        src={p.media[0].url}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-base text-white truncate">{p.name}</h4>
                  <p className="text-xs text-gold mt-1 font-semibold">₹{p.basePrice.toLocaleString('en-IN')}</p>
                  <Link
                    href={`/products/${p.slug}`}
                    className="mt-3 block text-center py-2 bg-heritage-700 hover:bg-heritage-600 rounded text-xs font-medium text-heritage-200 transition"
                  >
                    View Details & Measurements
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Best Sellers (Dynamic Database Products) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-gold-dark uppercase mb-1">
              Client Favorites
            </p>
            <h2 className="font-serif text-3xl font-bold text-heritage-900">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop?filter=bestseller"
            className="mt-2 sm:mt-0 text-sm font-semibold text-heritage-900 hover:text-gold-dark flex items-center space-x-1 group"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. Custom Tailoring Experience (7 Steps) */}
      <section className="bg-white border-y border-heritage-200 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-gold-dark uppercase">
              Bespoke Made-to-Measure
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-900 mt-2">
              The Custom Tailoring Experience
            </h2>
            <p className="text-sm text-heritage-600 mt-3 leading-relaxed">
              Every body is unique. For custom orders, we do not compromise with generic sizing. Follow our time-tested 7-step process from fabric selection to millimeter precision fitting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Choose Your Style', desc: 'Select from Bandhgala, Tuxedo, 3-Piece Suit, or Royal Indo-Western.' },
              { step: '02', title: 'Discuss Requirements', desc: 'Share your event details, style preferences, and comfort desires.' },
              { step: '03', title: 'Select Fabrics & Details', desc: 'Fine Italian wool, raw silk, custom collars, lapels, and crested buttons.' },
              { step: '04', title: 'Book Store Appointment', desc: 'Reserve an exclusive time slot at our Jaipur atelier with our master cutters.' },
              { step: '05', title: 'Master Measurement', desc: 'Up to 18 anatomical body measurements taken with posture evaluation.' },
              { step: '06', title: 'Tailoring Begins', desc: 'Hand drafting, floating canvas construction, and meticulous needlework.' },
              { step: '07', title: 'Trial & Delivery', desc: 'Baste trial fitting to ensure perfection followed by timely delivery.' },
              { step: '★', title: 'Saved Profile', desc: 'Your measurements are securely saved in your customer profile for repeat orders.' },
            ].map((s) => (
              <div key={s.step} className="p-5 bg-heritage-50 rounded-lg border border-heritage-200 hover:border-gold transition">
                <span className="font-serif text-2xl font-bold text-gold-dark">{s.step}</span>
                <h3 className="font-serif font-bold text-base text-heritage-900 mt-2">{s.title}</h3>
                <p className="text-xs text-heritage-600 mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center flex flex-wrap justify-center gap-4">
            <Link
              href="/custom-tailoring"
              className="px-6 py-3 bg-heritage-900 hover:bg-heritage-800 text-white font-semibold rounded text-sm transition"
            >
              Explore Custom Tailoring Details
            </Link>
            <AppointmentBookingModal defaultType="CUSTOM_TAILORING" />
          </div>
        </div>
      </section>

      {/* 6. Editorial Highlights: Suits, Tuxedos & Boys */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Suits & Tuxedos */}
          <div className="bg-heritage-900 text-white rounded-xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10 max-w-md">
              <span className="text-xs font-semibold text-gold tracking-widest uppercase">Executive & Black-Tie</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">Suits & Tuxedos Atelier</h3>
              <p className="text-xs sm:text-sm text-heritage-300 leading-relaxed">
                Precision cut two-piece business suits, three-piece vest sets, and pure silk satin peak lapel tuxedos engineered for presence.
              </p>
              <Link
                href="/shop?category=suits-tuxedos"
                className="inline-flex items-center space-x-2 text-xs font-bold text-gold hover:text-white transition pt-2"
              >
                <span>Browse Suits & Tuxedos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-heritage-800">
              {suits.map((s) => (
                <div key={s.id} className="text-xs">
                  <p className="font-medium text-white truncate">{s.name}</p>
                  <p className="text-gold font-bold">₹{s.basePrice.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Boys Collection */}
          <div className="bg-heritage-100 rounded-xl p-8 sm:p-10 flex flex-col justify-between border border-heritage-300">
            <div className="space-y-4 max-w-md">
              <span className="text-xs font-semibold text-gold-dark tracking-widest uppercase">Little Gentlemen</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-900">Boys Collection</h3>
              <p className="text-xs sm:text-sm text-heritage-700 leading-relaxed">
                Celebratory kurta sets, Nehru jacket combinations, and miniature tailored formal suits crafted with breathable cotton linings for boys.
              </p>
              <Link
                href="/shop?category=boys-collection"
                className="inline-flex items-center space-x-2 text-xs font-bold text-heritage-900 hover:text-gold-dark transition pt-2"
              >
                <span>Browse Boys Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-heritage-200">
              {boys.map((b) => (
                <div key={b.id} className="text-xs">
                  <p className="font-medium text-heritage-900 truncate">{b.name}</p>
                  <p className="text-gold-dark font-bold">₹{b.basePrice.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why B M Tailors (Trust Points - No invented claims) */}
      <section className="bg-heritage-50 border-y border-heritage-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-heritage-900">Why B M Tailors</h2>
            <p className="text-xs sm:text-sm text-heritage-600 mt-2">
              An offline institution in Jaipur since 1990, now providing a modern digital shopping and appointment experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            <div className="p-4 bg-white rounded border border-heritage-200 space-y-2">
              <Award className="w-6 h-6 text-gold mx-auto" />
              <h4 className="font-semibold text-xs text-heritage-900">Since 1990</h4>
              <p className="text-[11px] text-heritage-500">Over 34 years of tailoring heritage</p>
            </div>
            <div className="p-4 bg-white rounded border border-heritage-200 space-y-2">
              <Scissors className="w-6 h-6 text-gold mx-auto" />
              <h4 className="font-semibold text-xs text-heritage-900">Custom Tailoring</h4>
              <p className="text-[11px] text-heritage-500">Bespoke cutting for your physique</p>
            </div>
            <div className="p-4 bg-white rounded border border-heritage-200 space-y-2">
              <Layers className="w-6 h-6 text-gold mx-auto" />
              <h4 className="font-semibold text-xs text-heritage-900">Made-to-Measure</h4>
              <p className="text-[11px] text-heritage-500">Millimeter fitting precision</p>
            </div>
            <div className="p-4 bg-white rounded border border-heritage-200 space-y-2">
              <Sparkles className="w-6 h-6 text-gold mx-auto" />
              <h4 className="font-semibold text-xs text-heritage-900">Premium Fabrics</h4>
              <p className="text-[11px] text-heritage-500">Italian wools, raw silks & linens</p>
            </div>
            <div className="p-4 bg-white rounded border border-heritage-200 space-y-2">
              <MapPin className="w-6 h-6 text-gold mx-auto" />
              <h4 className="font-semibold text-xs text-heritage-900">Jaipur-Based</h4>
              <p className="text-[11px] text-heritage-500">Two dedicated city ateliérs</p>
            </div>
            <div className="p-4 bg-white rounded border border-heritage-200 space-y-2">
              <Truck className="w-6 h-6 text-gold mx-auto" />
              <h4 className="font-semibold text-xs text-heritage-900">Delivery Support</h4>
              <p className="text-[11px] text-heritage-500">Swift dispatch across Urban Jaipur</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Brand Heritage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-heritage-900 text-white rounded-2xl p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-2xl space-y-5">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Heritage & Philosophy</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Crafting Confidence Since 1990
            </h2>
            <p className="text-sm text-heritage-300 leading-relaxed">
              From timeless Indian craftsmanship to modern men’s fashion, B M Tailors combines decades of tailoring experience with contemporary style and made-to-measure precision. Operating from Jaipur with two dedicated branches, we uphold the sacred relationship between master cutter and gentleman.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 text-xs font-bold text-gold hover:text-white transition"
              >
                <span>Read the Complete Atelier Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Verified Customer Reviews (Strict empty state per requirement 32/59) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-900">Customer Testimonials</h2>
          <p className="text-xs text-heritage-500 mt-1">Authentic reviews from verified atelier patrons.</p>
        </div>

        <div className="p-8 sm:p-10 rounded-xl bg-heritage-100 border border-dashed border-heritage-300 text-center max-w-2xl mx-auto space-y-3">
          <ShieldCheck className="w-8 h-8 text-gold-dark mx-auto" />
          <h4 className="font-serif font-bold text-base text-heritage-900">
            Verified Reviews from Jaipur Patrons
          </h4>
          <p className="text-xs text-heritage-600 leading-relaxed">
            We only display authentic reviews submitted by customers who have purchased or visited our Jaipur ateliers. As our digital platform launches, new verified buyer ratings will appear here following moderation.
          </p>
        </div>
      </section>

      {/* 10. Atelier Appointment Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-heritage-900 via-heritage-800 to-heritage-900 rounded-2xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 border border-heritage-700 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Book Your Atelier Appointment
            </h2>
            <p className="text-xs sm:text-sm text-heritage-300 leading-relaxed">
              Experience one-on-one consultation with our master cutters in Jaipur for wedding ensembles, business suits, or precise measurements.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-wrap gap-4">
            <AppointmentBookingModal defaultType="STORE_VISIT" />
            <a
              href="https://wa.me/919999999999?text=Namaste%20B%20M%20Tailors,%20I%20would%20like%20to%20book%20a%20tailoring%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
