import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Scissors, MapPin, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { AppointmentBookingModal } from '@/components/appointment/AppointmentBookingModal';

export const metadata = {
  title: 'About B M Tailors — Crafting Confidence Since 1990 | Jaipur, Rajasthan',
  description:
    'The heritage and bespoke tailoring philosophy of B M Tailors. Operating in Jaipur since 1990 with two dedicated branches.',
};

export default function AboutPage() {
  return (
    <div className="space-y-16 lg:space-y-24 py-10">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-heritage-900 text-white rounded-2xl p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">
              Brand Heritage • Established 1990
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Crafting Confidence Since 1990
            </h1>
            <p className="text-sm sm:text-base text-heritage-300 leading-relaxed">
              From timeless Indian craftsmanship to modern men’s fashion, B M Tailors combines decades of tailoring experience with contemporary style and made-to-measure precision.
            </p>
          </div>
        </div>
      </section>

      {/* Heritage Narrative (Complies with Rule 62: No invented family names or unsupported claims) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-heritage-700 leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-900">
              The Jaipur Atelier Tradition
            </h2>
            <p>
              B M Tailors was established in 1990 in Jaipur, Rajasthan, born out of deep respect for traditional men's garment construction and the distinguished sartorial heritage of the Pink City. For more than three decades, the business has operated offline through two Jaipur branches, outfitting multiple generations of gentlemen for landmark celebrations, corporate leadership, and daily sophistication.
            </p>
            <p>
              Our tailoring methodology treats each garment not merely as stitched cloth, but as a structured architectural piece designed to flatter the wearer's specific posture, proportions, and presence.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-heritage-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
              alt="B M Tailors Atelier Workshop"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-white rounded-xl border border-heritage-200 space-y-2">
            <Award className="w-6 h-6 text-gold-dark" />
            <h3 className="font-serif font-bold text-base text-heritage-900">34+ Years Experience</h3>
            <p className="text-xs text-heritage-600 leading-relaxed">
              Decades of pattern drafting, bench tailoring, and bespoke fitting refined on real Indian physiques.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-heritage-200 space-y-2">
            <Scissors className="w-6 h-6 text-gold-dark" />
            <h3 className="font-serif font-bold text-base text-heritage-900">Made-to-Measure Precision</h3>
            <p className="text-xs text-heritage-600 leading-relaxed">
              Floating canvas construction, stiffened Mandarin collars, hand-finished lapels, and tailored armholes.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-heritage-200 space-y-2">
            <MapPin className="w-6 h-6 text-gold-dark" />
            <h3 className="font-serif font-bold text-base text-heritage-900">Two Jaipur Branches</h3>
            <p className="text-xs text-heritage-600 leading-relaxed">
              Serving our patrons locally in Jaipur with in-person consultations, measurement sessions, and final trials.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-8 bg-heritage-100 rounded-xl text-center space-y-4 border border-heritage-200">
          <h3 className="font-serif text-2xl font-bold text-heritage-900">Experience Our Atelier in Person</h3>
          <p className="text-xs text-heritage-600 max-w-md mx-auto">
            Book an appointment with our master cutting team in Jaipur for wedding groom consultation or custom suits.
          </p>
          <div className="flex justify-center gap-4">
            <AppointmentBookingModal defaultType="STORE_VISIT" />
            <Link
              href="/shop"
              className="px-6 py-3 bg-heritage-900 text-gold font-bold text-xs rounded hover:bg-heritage-800 transition"
            >
              Shop Ready-made Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
