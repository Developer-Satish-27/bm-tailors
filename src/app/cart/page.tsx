'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { useLanguage } from '@/lib/LanguageContext';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Tag,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    couponCode,
    discount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Jaipur delivery logic (free above ₹2999, else ₹99)
  const shippingFee = subtotal >= 2999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg(null);
    const res = await applyCoupon(inputCoupon);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setInputCoupon('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-heritage-100 rounded-full flex items-center justify-center mx-auto text-heritage-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-heritage-900">{t.cart.emptyTitle}</h2>
        <p className="text-xs text-heritage-600 max-w-sm mx-auto">{t.cart.emptyDesc}</p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-heritage-900 text-gold font-bold text-xs rounded hover:bg-heritage-800 transition shadow"
          >
            <span>{t.cart.continueShopping}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-heritage-900">{t.cart.title}</h1>
        <p className="text-xs text-heritage-500 mt-1">Review your selected garments before proceed to checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Line Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-heritage-200 border-y border-heritage-200">
            {items.map((item) => (
              <div key={item.variantId} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 aspect-[3/4] bg-heritage-100 rounded overflow-hidden flex-shrink-0 border border-heritage-200">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-sm text-heritage-900">{item.name}</h3>
                    <p className="text-xs text-heritage-500">
                      Size: <strong>{item.size}</strong> • Color: <strong>{item.color}</strong>
                    </p>
                    {item.fabric && <p className="text-[11px] text-heritage-400">Fabric: {item.fabric}</p>}
                    <p className="text-xs font-bold text-heritage-900 pt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center space-x-6 self-end sm:self-center">
                  <div className="flex items-center border border-heritage-300 rounded bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-1.5 text-heritage-600 hover:text-heritage-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-heritage-900">{item.quantity}</span>
                    <button
                      type="button"
                      disabled={item.quantity >= item.stock}
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-1.5 text-heritage-600 hover:text-heritage-900 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-bold text-sm text-heritage-900 w-24 text-right">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="text-heritage-400 hover:text-rose-600 transition p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-heritage-600 pt-2">
            <Link href="/shop" className="hover:text-gold-dark font-medium underline">
              ← {language === 'hi' ? 'अन्य परिधान जोड़ें' : 'Continue Shopping'}
            </Link>
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-heritage-200 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-base text-heritage-900 pb-3 border-b border-heritage-100">
              Order Summary
            </h3>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-semibold text-heritage-800">
                {t.cart.applyCoupon}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. ROYAL10 / JAIPUR500"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-heritage-900 hover:bg-heritage-800 text-gold text-xs font-bold rounded transition"
                >
                  {t.cart.apply}
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-700 font-medium'}`}>
                  {couponMsg.text}
                </p>
              )}
              {couponCode && (
                <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
                  <span className="font-bold flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon: {couponCode}</span>
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-rose-600 hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Pricing Breakdown */}
            <div className="space-y-2.5 text-xs text-heritage-700 pt-3 border-t border-heritage-100">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-heritage-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t.cart.discount}</span>
                  <span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.cart.shipping}</span>
                <span className="font-semibold text-heritage-900">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
              <p className="text-[10px] text-heritage-400">
                {subtotal < 2999 ? 'Add items worth ₹' + (2999 - subtotal) + ' more for FREE Jaipur delivery' : 'Eligible for Free Urban Jaipur Dispatch'}
              </p>
              <div className="flex justify-between text-sm font-bold text-heritage-900 pt-3 border-t border-heritage-200">
                <span>{t.cart.total}</span>
                <span className="font-serif text-lg text-heritage-900">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              type="button"
              onClick={() => router.push('/checkout')}
              className="w-full py-3.5 bg-heritage-900 hover:bg-heritage-800 text-gold font-bold text-xs rounded transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>{t.cart.proceedToCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Important COD notice preview */}
            <div className="p-3 bg-heritage-50 rounded border border-heritage-200 text-[11px] text-heritage-600 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
              <p>
                <strong>COD Policy Reminder:</strong> Orders placed with Cash on Delivery will incur a ₹120 fee and are non-exchangeable. Online prepaid orders support our 7-day exchange program.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
