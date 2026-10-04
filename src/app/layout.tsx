import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';
import { CartProvider } from '@/lib/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'B M Tailors — Crafting Confidence Since 1990 | Jaipur Men’s Fashion & Custom Tailoring',
  description:
    'Established in 1990 in Jaipur, Rajasthan. B M Tailors offers luxury bespoke suits, groom sherwanis, royal bandhgalas, made-to-measure tailoring, and ready-to-wear men’s fashion.',
  keywords: [
    'B M Tailors',
    'Men Tailors Jaipur',
    'Custom Tailoring Jaipur',
    'Groom Sherwani Jaipur',
    'Wedding Suits Jaipur',
    'Bespoke Tailoring Rajasthan',
    'Indo Western Men Jaipur',
    'Boys Formal Wear',
    'Uniform Manufacturers Jaipur',
  ],
  authors: [{ name: 'B M Tailors' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'B M Tailors — Crafting Confidence Since 1990',
    description:
      'Timeless Jaipur craftsmanship combined with modern bespoke precision. Explore ready-to-wear clothing or book an appointment at our atelier.',
    siteName: 'B M Tailors',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B M Tailors — Premium Men’s Tailoring Since 1990',
    description: 'Bespoke tailoring, royal wedding wear, and modern men’s fashion in Jaipur, Rajasthan.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/bm-tailor-logo.jpg',
    shortcut: '/images/bm-tailor-logo.jpg',
    apple: '/images/bm-tailor-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MensClothingStore',
    name: 'B M Tailors',
    foundingDate: '1990',
    description: 'Premier men’s custom tailoring, wedding groom wear, and ready-made clothing house in Jaipur, Rajasthan.',
    telephone: '[BUSINESS PHONE]',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    priceRange: '₹₹₹',
    openingHours: 'Mo-Su 10:30-21:00',
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-heritage-900 font-sans selection:bg-gold-light">
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <MobileNav />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
