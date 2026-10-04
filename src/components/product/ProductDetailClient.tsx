'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { useLanguage } from '@/lib/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import {
  Heart,
  ShoppingBag,
  ShieldAlert,
  Truck,
  RotateCcw,
  Ruler,
  MessageCircle,
  Check,
  AlertCircle,
  Star,
  Sparkles,
} from 'lucide-react';
import { ProductReviewModal } from './ProductReviewModal';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    fabricDetails?: string | null;
    fitType?: string | null;
    occasion?: string | null;
    basePrice: number;
    compareAtPrice?: number | null;
    category: { name: string; slug: string };
    media: Array<{ id: string; url: string; altText?: string | null }>;
    variants: Array<{
      id: string;
      sku: string;
      size: string;
      color: string;
      fabric?: string | null;
      price: number;
      compareAtPrice?: number | null;
      stockQuantity: number;
    }>;
    reviews: Array<{
      id: string;
      rating: number;
      title?: string | null;
      body: string;
      customerDisplayName: string;
      createdAt: Date;
    }>;
  };
}

export function ProductDetailClient({ product }: ProductDetailProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { addItem, wishlistIds, toggleWishlist } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const isWishlisted = wishlistIds.includes(product.id);
  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity <= 0;

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const currentCompareAt = selectedVariant?.compareAtPrice || product.compareAtPrice;
  const discountPercent =
    currentCompareAt && currentCompareAt > currentPrice
      ? Math.round(((currentCompareAt - currentPrice) / currentCompareAt) * 100)
      : null;

  const images =
    product.media.length > 0
      ? product.media
      : [{ id: 'default', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80', altText: product.name }];

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      fabric: selectedVariant.fabric || product.fabricDetails || undefined,
      price: selectedVariant.price,
      image: images[0].url,
      quantity: 1,
      stock: selectedVariant.stockQuantity,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleWhatsAppEnquiry = () => {
    trackEvent('whatsapp_click', {
      placement: 'product_detail',
      productName: product.name,
      variantSku: selectedVariant?.sku,
    });
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
    const message = encodeURIComponent(
      `Namaste B M Tailors! I am interested in "${product.name}" (SKU: ${selectedVariant?.sku}, Size: ${selectedVariant?.size}, Price: ₹${currentPrice}). Please share availability and customization options.`
    );
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] bg-heritage-100 rounded-xl overflow-hidden border border-heritage-200 shadow-sm">
            <Image
              src={images[activeImageIndex]?.url || images[0].url}
              alt={images[activeImageIndex]?.altText || product.name}
              fill
              priority
              className="object-cover object-top transition duration-500"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-heritage-900 text-gold text-xs font-bold px-3 py-1 rounded shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                    activeImageIndex === idx ? 'border-gold shadow' : 'border-heritage-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Attributes & Purchase Engine */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category & Title */}
          <div>
            <span className="text-xs font-bold tracking-widest text-gold-dark uppercase">
              {product.category.name}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-900 mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-heritage-500 mt-0.5">SKU: {selectedVariant?.sku}</p>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-3 pt-2 border-t border-heritage-100">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-heritage-900">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {currentCompareAt && currentCompareAt > currentPrice && (
              <span className="text-base text-heritage-400 line-through">
                ₹{currentCompareAt.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              {t.product.inclusiveTaxes}
            </span>
          </div>

          {/* Size Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-heritage-900">{t.product.selectSize}</span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-gold-dark font-semibold hover:underline flex items-center space-x-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{t.product.sizeGuide}</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.variants.map((v) => {
                const isSelected = v.id === selectedVariantId;
                const isVariantOos = v.stockQuantity <= 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={isVariantOos}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`py-2 px-3 text-xs rounded border text-center transition font-medium ${
                      isSelected
                        ? 'bg-heritage-900 text-gold border-heritage-900 font-bold shadow'
                        : isVariantOos
                        ? 'bg-heritage-100 text-heritage-400 border-heritage-200 line-through cursor-not-allowed'
                        : 'bg-white text-heritage-800 border-heritage-300 hover:border-gold'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color & Fabric info */}
          <div className="space-y-1.5 text-xs text-heritage-700 bg-heritage-50 p-3.5 rounded-lg border border-heritage-200">
            <p><strong>Color:</strong> {selectedVariant?.color}</p>
            {product.fabricDetails && <p><strong>Fabric:</strong> {product.fabricDetails}</p>}
            {product.fitType && <p><strong>Fit:</strong> {product.fitType}</p>}
            {product.occasion && <p><strong>Occasion:</strong> {product.occasion}</p>}
            <p className="pt-1">
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{t.product.outOfStock}</span>
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.product.inStock} ({selectedVariant.stockQuantity} ready in Jaipur)</span>
                </span>
              )}
            </p>
          </div>

          {/* Action Buttons: Add to Cart / Buy Now / Wishlist */}
          <div className="space-y-3 pt-2">
            {addedNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded font-medium flex items-center space-x-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Garment added to your shopping bag!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="w-full py-3 bg-heritage-900 hover:bg-heritage-800 text-gold font-bold text-xs rounded transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-gold" />
                <span>{t.product.addToCart}</span>
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full py-3 bg-gold hover:bg-gold-light text-heritage-900 font-bold text-xs rounded transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{t.product.buyNow}</span>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`flex-1 py-2.5 px-4 rounded border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-white border-heritage-300 text-heritage-700 hover:border-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
                <span>{isWishlisted ? t.product.inWishlist : t.product.addToWishlist}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppEnquiry}
                className="flex-1 py-2.5 px-4 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center space-x-2 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{t.product.whatsappInquiry}</span>
              </button>
            </div>
          </div>

          {/* Delivery & Strict COD Exchange Policy Callouts */}
          <div className="space-y-3 pt-3 border-t border-heritage-200 text-xs text-heritage-700">
            <div className="flex items-start space-x-2.5">
              <Truck className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-heritage-900">{t.product.deliveryEstimate}</p>
                <p className="text-[11px] text-heritage-500">Free delivery on orders above ₹2,999</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <RotateCcw className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-heritage-900">7-Day Ready-made Exchange</p>
                <p className="text-[11px] text-heritage-500">
                  Ready-made sizes can be exchanged within 7 days in unworn condition.
                </p>
              </div>
            </div>

            {/* Strict Notice for COD orders as required by Prompt #17 & #26 */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2.5 text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[11px]">IMPORTANT COD POLICY NOTICE</p>
                <p className="text-[11px] leading-relaxed">
                  Cash on Delivery (COD) orders are <strong>NOT eligible for exchange or return</strong> under any circumstances.
                </p>
              </div>
            </div>
          </div>

          {/* Garment Description */}
          <div className="pt-4 border-t border-heritage-100 space-y-2">
            <h3 className="font-serif font-bold text-sm text-heritage-900">
              Tailoring & Design Description
            </h3>
            <p className="text-xs text-heritage-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Verified Reviews Section (Strictly authentic, no fakes per rule 32) */}
      <section className="pt-10 border-t border-heritage-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-bold text-heritage-900">
            {t.product.reviews}
          </h3>
          <ProductReviewModal productId={product.id} productName={product.name} />
        </div>
        {product.reviews.length === 0 ? (
          <div className="p-6 bg-heritage-50 rounded-lg border border-dashed border-heritage-200 text-center max-w-md">
            <Star className="w-6 h-6 text-gold mx-auto mb-2 opacity-50" />
            <p className="text-xs text-heritage-600">{t.product.noReviews}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((r) => (
              <div key={r.id} className="p-4 bg-white rounded border border-heritage-200 space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="flex text-gold">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-xs text-heritage-900">{r.customerDisplayName}</span>
                </div>
                {r.title && <p className="font-semibold text-xs text-heritage-800">{r.title}</p>}
                <p className="text-xs text-heritage-600">{r.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-heritage-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-heritage-100">
              <h3 className="font-serif text-lg font-bold text-heritage-900">
                B M Tailors Men’s Size Guide (Inches)
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="text-heritage-400 hover:text-heritage-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <table className="w-full text-xs text-left border border-heritage-200">
              <thead className="bg-heritage-900 text-gold uppercase text-[10px]">
                <tr>
                  <th className="p-2 border">Size</th>
                  <th className="p-2 border">Chest</th>
                  <th className="p-2 border">Waist</th>
                  <th className="p-2 border">Shoulder</th>
                  <th className="p-2 border">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-100">
                <tr><td className="p-2 border font-bold">38 (S)</td><td className="p-2 border">38-39"</td><td className="p-2 border">32-33"</td><td className="p-2 border">17.5"</td><td className="p-2 border">28.5"</td></tr>
                <tr><td className="p-2 border font-bold">40 (M)</td><td className="p-2 border">40-41"</td><td className="p-2 border">34-35"</td><td className="p-2 border">18.0"</td><td className="p-2 border">29.0"</td></tr>
                <tr><td className="p-2 border font-bold">42 (L)</td><td className="p-2 border">42-43"</td><td className="p-2 border">36-37"</td><td className="p-2 border">18.5"</td><td className="p-2 border">29.5"</td></tr>
                <tr><td className="p-2 border font-bold">44 (XL)</td><td className="p-2 border">44-45"</td><td className="p-2 border">38-39"</td><td className="p-2 border">19.0"</td><td className="p-2 border">30.0"</td></tr>
              </tbody>
            </table>

            <p className="text-[11px] text-heritage-500 leading-relaxed">
              For custom made-to-measure garments with personalized millimeter fit, please visit our <strong>Custom Tailoring</strong> section to book a measurement session at our Jaipur atelier.
            </p>

            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-2 bg-heritage-900 text-white rounded text-xs font-semibold"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
