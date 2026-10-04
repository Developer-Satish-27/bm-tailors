'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { useLanguage } from '@/lib/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import {
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  User,
  MapPin,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { items, subtotal, discount, couponCode, clearCart } = useCart();

  // Authentication state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Auth toggle form for unauthenticated customers
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Address selection / new address
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [state, setState] = useState('Rajasthan');
  const [pincode, setPincode] = useState('302001');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'COD'>('UPI');
  const [notes, setNotes] = useState('');

  // Processing & Success states
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Check user session
  const checkSession = async () => {
    try {
      setCheckingAuth(true);
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.data.user) {
        setCurrentUser(data.data.user);
        setFullName(data.data.user.displayName || '');
        setPhone(data.data.user.phone || '');
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Shipping & Pricing
  const isCod = paymentMethod === 'COD';
  const shippingFee = subtotal >= 2999 || subtotal === 0 ? 0 : 99;
  const codFee = isCod ? 120 : 0;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee + codFee);

  // Handle Authentication submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        authMode === 'login'
          ? { email: authEmail, password: authPassword }
          : {
              email: authEmail,
              password: authPassword,
              phone: authPhone,
              firstName: authFirstName,
              lastName: authLastName,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        await checkSession();
      } else {
        setAuthError(data.error?.message || 'Authentication failed');
      }
    } catch {
      setAuthError('Connection error during authentication');
    }
  };

  // Handle Checkout submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    setOrderError(null);

    trackEvent('begin_checkout', { subtotal, grandTotal, paymentMethod, isCod });

    try {
      const payload = {
        paymentMethod,
        couponCode: couponCode || undefined,
        notes: notes || undefined,
        newAddress: {
          fullName,
          phone,
          addressLine1,
          addressLine2: addressLine2 || undefined,
          landmark: landmark || undefined,
          city,
          state,
          pincode,
          label: 'Delivery Address',
        },
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setCompletedOrder(data.data.order);
        clearCart();
        trackEvent('purchase', {
          orderNumber: data.data.order.orderNumber,
          total: data.data.order.total,
          isCod: data.data.order.isCod,
        });
      } else {
        setOrderError(data.error?.message || 'Failed to complete order');
      }
    } catch {
      setOrderError('A communication error occurred while processing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-heritage-900">Your bag is empty</h2>
        <p className="text-xs text-heritage-600">Please select garments to continue to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-heritage-900 text-gold text-xs font-bold rounded"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  // Order Confirmed State
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
        <h1 className="font-serif text-3xl font-bold text-heritage-900">Order Confirmed!</h1>
        <p className="text-xs text-heritage-600 max-w-md mx-auto">
          Thank you for choosing B M Tailors. Your order is now in preparation by our master craftsmen in Jaipur.
        </p>

        <div className="bg-white p-6 rounded-xl border border-heritage-200 text-xs text-left max-w-md mx-auto space-y-3 shadow-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-heritage-500">Order Reference</span>
            <span className="font-bold text-heritage-900">{completedOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-heritage-500">Total Amount</span>
            <span className="font-bold text-heritage-900">₹{completedOrder.total.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-heritage-500">Payment Status</span>
            <span className={`font-bold ${completedOrder.isCod ? 'text-amber-800' : 'text-emerald-700'}`}>
              {completedOrder.isCod ? 'Pay on Delivery (COD)' : 'Payment Verified (Online)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-heritage-500">Exchange Eligibility</span>
            <span className="font-bold">
              {completedOrder.isCod ? (
                <span className="text-rose-600">COD — Not Eligible for Exchange</span>
              ) : (
                <span className="text-emerald-700">7-Day Ready-made Exchange Available</span>
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/account?tab=orders"
            className="px-6 py-3 bg-heritage-900 text-gold text-xs font-bold rounded hover:bg-heritage-800 transition shadow"
          >
            Track in My Account
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 bg-heritage-100 text-heritage-900 text-xs font-bold rounded hover:bg-heritage-200 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-heritage-900">{t.checkout.title}</h1>
        <p className="text-xs text-heritage-500 mt-1">Authenticated Express Checkout • Urban Jaipur Dispatch</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Customer Authentication Check (Requirement 24: Guest checkout NOT allowed) */}
          {!currentUser ? (
            <div className="bg-white p-6 rounded-xl border border-gold/40 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-heritage-900">
                <Lock className="w-5 h-5 text-gold-dark" />
                <h2 className="font-serif font-bold text-lg">{t.checkout.loginRequired}</h2>
              </div>
              <p className="text-xs text-heritage-600 leading-relaxed">
                {t.checkout.loginSub}
              </p>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="flex border-b border-heritage-200">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`pb-2 px-4 text-xs font-bold transition border-b-2 ${
                    authMode === 'login' ? 'border-heritage-900 text-heritage-900' : 'border-transparent text-heritage-400'
                  }`}
                >
                  Existing Customer Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`pb-2 px-4 text-xs font-bold transition border-b-2 ${
                    authMode === 'register' ? 'border-heritage-900 text-heritage-900' : 'border-transparent text-heritage-400'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3 pt-2">
                {authMode === 'register' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-heritage-700 mb-1">First Name *</label>
                        <input
                          type="text"
                          required
                          value={authFirstName}
                          onChange={(e) => setAuthFirstName(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-heritage-700 mb-1">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={authLastName}
                          onChange={(e) => setAuthLastName(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-heritage-700 mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-heritage-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. gentleman@example.com"
                    className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-heritage-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-heritage-900 hover:bg-heritage-800 text-gold text-xs font-bold rounded transition"
                  >
                    {authMode === 'login' ? 'Sign In & Continue Checkout' : 'Register & Continue Checkout'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Authenticated Customer Banner */
            <div className="bg-heritage-50 p-4 rounded-xl border border-heritage-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-heritage-900 text-gold flex items-center justify-center font-bold text-xs">
                  {currentUser.firstName?.[0] || 'C'}
                </div>
                <div>
                  <p className="text-xs font-bold text-heritage-900">{currentUser.displayName || currentUser.email}</p>
                  <p className="text-[11px] text-heritage-500">Logged in • {currentUser.email}</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
                Verified Customer
              </span>
            </div>
          )}

          {/* Section 2: Delivery Address Form */}
          <div className="bg-white p-6 rounded-xl border border-heritage-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-heritage-900 pb-2 border-b border-heritage-100">
              <MapPin className="w-4 h-4 text-gold-dark" />
              <h2 className="font-serif font-bold text-base">{t.checkout.shippingAddress}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">{t.checkout.fullName} *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">{t.checkout.phone} *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">{t.checkout.addressLine1} *</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="House / Flat No., Apartment / Commercial Landmark"
                  className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">{t.checkout.addressLine2}</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Street, Sector, Mohalla"
                  className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">{t.checkout.city}</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none bg-heritage-50"
                />
              </div>
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">{t.checkout.state}</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none bg-heritage-50"
                />
              </div>
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">{t.checkout.pincode} *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="302001"
                  className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection & Crucial COD Warning */}
          <div className="bg-white p-6 rounded-xl border border-heritage-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-heritage-900 pb-2 border-b border-heritage-100">
              <CreditCard className="w-4 h-4 text-gold-dark" />
              <h2 className="font-serif font-bold text-base">{t.checkout.paymentMethod}</h2>
            </div>

            <div className="space-y-3">
              {/* Online Option */}
              <label
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition ${
                  paymentMethod !== 'COD' ? 'border-heritage-900 bg-heritage-50/50' : 'border-heritage-200 hover:border-heritage-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod !== 'COD'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="mt-1 text-heritage-900 focus:ring-gold"
                />
                <div className="ml-3 space-y-1">
                  <span className="font-bold text-xs text-heritage-900 flex items-center space-x-2">
                    <span>{t.checkout.onlinePayment}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                      Recommended
                    </span>
                  </span>
                  <p className="text-[11px] text-heritage-600 leading-relaxed">
                    {t.checkout.onlinePaymentDesc}
                  </p>
                </div>
              </label>

              {/* Cash on Delivery Option with Prominent Exchange Warning */}
              <label
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition ${
                  paymentMethod === 'COD' ? 'border-amber-600 bg-amber-50/40' : 'border-heritage-200 hover:border-amber-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="ml-3 space-y-1.5 flex-1">
                  <span className="font-bold text-xs text-heritage-900 flex items-center justify-between">
                    <span>{t.checkout.codPayment}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                      +₹120 Handling Fee
                    </span>
                  </span>
                  <p className="text-[11px] text-heritage-600 leading-relaxed">
                    {t.checkout.codPaymentDesc}
                  </p>

                  {/* Red Warning Banner for COD */}
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-800 font-semibold flex items-start space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {t.checkout.codWarningBanner}
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-heritage-200 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-base text-heritage-900 pb-3 border-b border-heritage-100">
              {t.checkout.orderReview}
            </h3>

            {/* Line items preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-heritage-100 pr-1">
              {items.map((i) => (
                <div key={i.variantId} className="pt-2 first:pt-0 flex justify-between text-xs">
                  <div>
                    <p className="font-semibold text-heritage-900 line-clamp-1">{i.name}</p>
                    <p className="text-[11px] text-heritage-500">
                      Qty: {i.quantity} • Size: {i.size}
                    </p>
                  </div>
                  <span className="font-bold text-heritage-900">
                    ₹{(i.price * i.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-heritage-700 pt-3 border-t border-heritage-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Jaipur Delivery</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              {isCod && (
                <div className="flex justify-between text-amber-800 font-medium">
                  <span>COD Handling Charge</span>
                  <span>₹{codFee}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-heritage-900 pt-3 border-t border-heritage-200">
                <span>Grand Total</span>
                <span className="font-serif text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {orderError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="button"
              disabled={submitting || !currentUser || !fullName || !phone || !addressLine1}
              onClick={handlePlaceOrder}
              className="w-full py-3.5 bg-heritage-900 hover:bg-heritage-800 text-gold font-bold text-xs rounded transition flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {submitting ? (
                <span>{t.checkout.processing}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>{t.checkout.placeOrder}</span>
                </>
              )}
            </button>

            {!currentUser && (
              <p className="text-[11px] text-center text-rose-600 font-semibold">
                * Please sign in or register above to complete your order.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
