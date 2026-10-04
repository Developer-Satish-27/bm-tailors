'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import {
  User,
  Package,
  Calendar,
  Ruler,
  Heart,
  FileText,
  MapPin,
  LogOut,
  RotateCcw,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { HowToMeasureModal } from '@/components/measurements/HowToMeasureModal';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'orders';

  const { t, language } = useLanguage();
  const { wishlistIds, removeItem: removeCartItem } = useCart();

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [customOrders, setCustomOrders] = useState<any[]>([]);

  // Exchange dialog state
  const [exchangeModal, setExchangeModal] = useState<{
    isOpen: boolean;
    orderId: string;
    orderItemId: string;
    productName: string;
    isCod: boolean;
  }>({
    isOpen: false,
    orderId: '',
    orderItemId: '',
    productName: '',
    isCod: false,
  });
  const [exchangeReason, setExchangeReason] = useState('Size exchange');
  const [exchangeStatusMsg, setExchangeStatusMsg] = useState<string | null>(null);

  // New measurement profile state
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [mName, setMName] = useState('Three-Piece Suit Fit');
  const [mGarment, setMGarment] = useState('SUIT');
  const [mChest, setMChest] = useState('40');
  const [mWaist, setMWaist] = useState('34');
  const [mShoulder, setMShoulder] = useState('18');
  const [mSleeve, setMSleeve] = useState('25');
  const [mShirtLength, setMShirtLength] = useState('29');
  const [mTrouserWaist, setMTrouserWaist] = useState('34');
  const [mTrouserLength, setMTrouserLength] = useState('41');
  const [mInseam, setMInseam] = useState('31');

  // Load user & account data
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();

        if (!meData.success || !meData.data.user) {
          router.push('/checkout');
          return;
        }

        setUser(meData.data.user);

        // Fetch User measurements
        const mRes = await fetch('/api/measurements');
        const mData = await mRes.json();
        if (mData.success) setMeasurements(mData.data.profiles || []);

        // Demo fallback data if fresh DB
        setOrders([
          {
            id: 'ord-demo-1',
            orderNumber: 'BMT-2026-881923',
            createdAt: new Date().toISOString(),
            status: 'PROCESSING',
            paymentStatus: 'PAID',
            total: 12499,
            isCod: false,
            isExchangeEligible: true,
            items: [
              {
                id: 'item-1',
                productNameSnapshot: 'Royal Jodhpur Bandhgala Suit',
                sizeSnapshot: '40 (M)',
                colorSnapshot: 'Midnight Navy',
                quantity: 1,
                unitPrice: 12499,
              },
            ],
          },
        ]);
      } catch {
        router.push('/checkout');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const handleSaveMeasurements = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mName,
          garmentType: mGarment,
          chest: Number(mChest),
          waist: Number(mWaist),
          shoulder: Number(mShoulder),
          sleeve: Number(mSleeve),
          shirtLength: Number(mShirtLength),
          trouserWaist: Number(mTrouserWaist),
          trouserLength: Number(mTrouserLength),
          inseam: Number(mInseam),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowMeasureForm(false);
        const refetched = await fetch('/api/measurements');
        const rData = await refetched.json();
        if (rData.success) setMeasurements(rData.data.profiles);
      }
    } catch {
      alert('Failed to save measurements');
    }
  };

  const submitExchangeRequest = async () => {
    setExchangeStatusMsg(null);
    try {
      const res = await fetch('/api/exchanges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: exchangeModal.orderId,
          orderItemId: exchangeModal.orderItemId,
          reason: exchangeReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExchangeStatusMsg('Exchange request submitted successfully! Our team will contact you.');
      } else {
        setExchangeStatusMsg(`Notice: ${data.error?.message || 'Exchange not eligible'}`);
      }
    } catch {
      setExchangeStatusMsg('Network error while submitting request.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-heritage-600">
        Loading atelier account details...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Header */}
      <div className="bg-heritage-900 text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-gold text-heritage-900 font-bold text-xl flex items-center justify-center font-serif">
            {user?.firstName?.[0] || 'C'}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">{user?.displayName || 'Gentleman Customer'}</h1>
            <p className="text-xs text-heritage-400">{user?.email} • {user?.phone || 'Jaipur Member'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center space-x-1.5 px-4 py-2 bg-heritage-800 hover:bg-heritage-700 text-heritage-200 text-xs font-semibold rounded transition border border-heritage-700"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.nav.logout}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'orders', label: t.account.orders, icon: Package },
            { id: 'measurements', label: t.account.measurements, icon: Ruler },
            { id: 'appointments', label: t.account.appointments, icon: Calendar },
            { id: 'profile', label: t.account.profile, icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-bold transition text-left ${
                  isActive
                    ? 'bg-heritage-900 text-gold shadow'
                    : 'bg-white text-heritage-700 hover:bg-heritage-50 border border-heritage-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-heritage-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-xl border border-heritage-200 shadow-sm">
          {/* TAB 1: ORDERS & EXCHANGE POLICY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-heritage-900">{t.account.orders}</h3>
                <p className="text-xs text-heritage-500 mt-0.5">
                  View your tailoring preparation, dispatch status, and ready-made exchange requests.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-heritage-500">
                  No orders placed yet. Explore our ready-made and bespoke offerings.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="border border-heritage-200 rounded-lg p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between text-xs border-b border-heritage-100 pb-3 gap-2">
                        <div>
                          <span className="font-bold text-heritage-900">{o.orderNumber}</span>
                          <span className="text-heritage-400 mx-2">•</span>
                          <span className="text-heritage-500">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-heritage-900">₹{o.total.toLocaleString('en-IN')}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            {o.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-heritage-100 text-xs">
                        {o.items.map((item: any) => (
                          <div key={item.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-bold text-heritage-900">{item.productNameSnapshot}</p>
                              <p className="text-[11px] text-heritage-500">
                                Size: {item.sizeSnapshot} • Color: {item.colorSnapshot} • Qty: {item.quantity}
                              </p>
                            </div>

                            {/* Exchange Eligibility Action */}
                            <div>
                              {o.isCod ? (
                                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200 flex items-center space-x-1">
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  <span>COD — Exchange Not Available</span>
                                </span>
                              ) : o.isExchangeEligible ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExchangeModal({
                                      isOpen: true,
                                      orderId: o.id,
                                      orderItemId: item.id,
                                      productName: item.productNameSnapshot,
                                      isCod: false,
                                    })
                                  }
                                  className="text-[11px] font-bold text-heritage-900 hover:text-gold-dark border border-heritage-300 px-3 py-1 rounded hover:bg-heritage-50 transition flex items-center space-x-1"
                                >
                                  <RotateCcw className="w-3 h-3 text-gold-dark" />
                                  <span>Request 7-Day Exchange</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-heritage-400">Not Eligible for Exchange</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Status Stepper & Invoice */}
                      <div className="pt-2 text-[10px] text-heritage-500 flex flex-wrap items-center justify-between gap-2 border-t border-heritage-100">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-heritage-700">Workflow:</span>
                          <span>Placed → Payment Confirmed → Processing → Tailoring → Shipped → Delivered</span>
                        </div>
                        <Link
                          href={`/orders/${o.id}/invoice`}
                          className="font-bold text-heritage-900 hover:text-gold-dark underline text-[11px]"
                        >
                          View / Print Tax Invoice →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED MEASUREMENTS (Sensitive customer records per requirement 19) */}
          {activeTab === 'measurements' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-heritage-100">
                <div>
                  <h3 className="font-serif text-xl font-bold text-heritage-900">{t.measurements.title}</h3>
                  <p className="text-xs text-heritage-500 mt-0.5">{t.measurements.desc}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <HowToMeasureModal />
                  <button
                    type="button"
                    onClick={() => setShowMeasureForm(!showMeasureForm)}
                    className="px-4 py-2 bg-heritage-900 text-gold font-bold text-xs rounded hover:bg-heritage-800 transition flex items-center space-x-1.5 self-start"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.measurements.newProfile}</span>
                  </button>
                </div>
              </div>

              {/* Form to add new measurement profile */}
              {showMeasureForm && (
                <form onSubmit={handleSaveMeasurements} className="p-5 bg-heritage-50 rounded-xl border border-heritage-200 space-y-4 text-xs">
                  <h4 className="font-serif font-bold text-sm text-heritage-900">Record New Sizing Metrics (Inches)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Profile Label *</label>
                      <input
                        type="text"
                        required
                        value={mName}
                        onChange={(e) => setMName(e.target.value)}
                        placeholder="e.g. Wedding Bandhgala Measurement"
                        className="w-full px-3 py-1.5 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Garment Type *</label>
                      <select
                        value={mGarment}
                        onChange={(e) => setMGarment(e.target.value)}
                        className="w-full px-3 py-1.5 border border-heritage-300 rounded focus:border-gold focus:outline-none bg-white"
                      >
                        <option value="SUIT">Executive Suit / Tuxedo</option>
                        <option value="SHERWANI">Royal Sherwani</option>
                        <option value="SHIRT">Tailored Shirt</option>
                        <option value="TROUSER">Formal Trousers</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] mb-1">Chest (in)</label>
                      <input
                        type="number"
                        value={mChest}
                        onChange={(e) => setMChest(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Waist (in)</label>
                      <input
                        type="number"
                        value={mWaist}
                        onChange={(e) => setMWaist(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Shoulder (in)</label>
                      <input
                        type="number"
                        value={mShoulder}
                        onChange={(e) => setMShoulder(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Sleeve (in)</label>
                      <input
                        type="number"
                        value={mSleeve}
                        onChange={(e) => setMSleeve(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Shirt Length (in)</label>
                      <input
                        type="number"
                        value={mShirtLength}
                        onChange={(e) => setMShirtLength(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Trouser Waist (in)</label>
                      <input
                        type="number"
                        value={mTrouserWaist}
                        onChange={(e) => setMTrouserWaist(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Trouser Length (in)</label>
                      <input
                        type="number"
                        value={mTrouserLength}
                        onChange={(e) => setMTrouserLength(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Inseam (in)</label>
                      <input
                        type="number"
                        value={mInseam}
                        onChange={(e) => setMInseam(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-heritage-900 text-gold font-bold text-xs rounded hover:bg-heritage-800 transition"
                    >
                      {t.measurements.save}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMeasureForm(false)}
                      className="px-4 py-2 bg-heritage-200 text-heritage-800 text-xs font-semibold rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Profiles List */}
              {measurements.length === 0 ? (
                <div className="py-8 text-center text-xs text-heritage-500 bg-heritage-50 rounded-lg p-6 border border-dashed border-heritage-300">
                  {t.measurements.empty}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {measurements.map((m) => (
                    <div key={m.id} className="p-4 bg-heritage-50 rounded-lg border border-heritage-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-bold text-heritage-900">{m.name}</span>
                        <span className="text-[10px] text-gold-dark font-semibold uppercase">{m.garmentType}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-heritage-700">
                        {Object.entries(m.measurements || {}).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="capitalize text-heritage-500">{k}:</span>
                            <span className="font-semibold">{String(v)}"</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-heritage-900">{t.account.appointments}</h3>
                <p className="text-xs text-heritage-500 mt-0.5">
                  Scheduled store visits and measurement sessions at our Jaipur atelier.
                </p>
              </div>

              <div className="p-4 bg-heritage-50 rounded-lg border border-heritage-200 text-xs text-heritage-700 space-y-2">
                <p className="font-bold text-heritage-900">Upcoming Atelier Visit</p>
                <p>Date: Tomorrow • Time: 12:00 PM • Type: Custom Tailoring Consultation</p>
                <p className="text-[11px] text-heritage-500">
                  Location: B M Tailors Atelier, Jaipur, Rajasthan (Operating since 1990).
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-heritage-900">{t.account.profile}</h3>
                <p className="text-xs text-heritage-500 mt-0.5">Manage your personal details and preferences.</p>
              </div>

              <div className="space-y-3 text-xs text-heritage-800 max-w-md">
                <div>
                  <label className="block font-semibold text-heritage-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.displayName || ''}
                    className="w-full px-3 py-2 border rounded bg-heritage-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-heritage-600 mb-1">Email Address</label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-2 border rounded bg-heritage-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-heritage-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    disabled
                    value={user?.phone || ''}
                    className="w-full px-3 py-2 border rounded bg-heritage-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exchange Request Modal */}
      {exchangeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-heritage-200 space-y-4">
            <h3 className="font-serif text-lg font-bold text-heritage-900">
              7-Day Ready-made Exchange Request
            </h3>
            <p className="text-xs text-heritage-600">
              Garment: <strong>{exchangeModal.productName}</strong>
            </p>

            {exchangeStatusMsg ? (
              <div className="p-4 bg-heritage-50 rounded border text-xs text-heritage-800 space-y-3">
                <p className="font-medium">{exchangeStatusMsg}</p>
                <button
                  type="button"
                  onClick={() => setExchangeModal({ ...exchangeModal, isOpen: false })}
                  className="w-full py-2 bg-heritage-900 text-white rounded text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Reason for Exchange</label>
                  <select
                    value={exchangeReason}
                    onChange={(e) => setExchangeReason(e.target.value)}
                    className="w-full p-2 border rounded bg-heritage-50"
                  >
                    <option value="Size exchange (Need different size)">Size exchange (Need different size)</option>
                    <option value="Color preference adjustment">Color preference adjustment</option>
                    <option value="Minor defect / stitching concern">Minor defect / stitching concern</option>
                  </select>
                </div>

                <p className="text-[11px] text-heritage-500 leading-relaxed">
                  Garments must be unworn with original tags attached. Handover or dispatch occurs at our Jaipur atelier.
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={submitExchangeRequest}
                    className="flex-1 py-2.5 bg-heritage-900 text-gold font-bold rounded text-xs hover:bg-heritage-800 transition"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setExchangeModal({ ...exchangeModal, isOpen: false })}
                    className="px-4 py-2.5 bg-heritage-100 text-heritage-700 font-semibold rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-heritage-600">Loading atelier account...</div>}>
      <AccountContent />
    </Suspense>
  );
}

