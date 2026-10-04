'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag, Plus, Check, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState('10');
  const [minimumCartValue, setMinimumCartValue] = useState('1999');
  const [maximumDiscount, setMaximumDiscount] = useState('1500');

  useEffect(() => {
    setCoupons([
      {
        id: 'c-1',
        code: 'ROYAL10',
        type: 'PERCENTAGE',
        value: 10,
        minimumCartValue: 1999,
        maximumDiscount: 1500,
        isActive: true,
      },
      {
        id: 'c-2',
        code: 'JAIPUR500',
        type: 'FIXED',
        value: 500,
        minimumCartValue: 4999,
        maximumDiscount: 500,
        isActive: true,
      },
    ]);
  }, []);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    const newCoupon = {
      id: `c-${Date.now()}`,
      code: code.toUpperCase().trim(),
      type,
      value: Number(value),
      minimumCartValue: Number(minimumCartValue),
      maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
      isActive: true,
    };
    setCoupons([...coupons, newCoupon]);
    setShowAddForm(false);
    setCode('');
  };

  const handleToggleActive = (id: string) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <div className="min-h-screen bg-heritage-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <AdminHeader />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/dashboard"
              className="p-2 bg-white rounded border border-heritage-200 text-heritage-700 hover:text-heritage-900"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-heritage-900">
                Coupons & Offers Management
              </h1>
              <p className="text-xs text-heritage-500">
                Configure percentage or fixed discounts, minimum cart values, and limits.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-heritage-900 text-gold font-bold text-xs rounded hover:bg-heritage-800 transition flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Coupon</span>
          </button>
        </div>

        {/* Add Coupon Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateCoupon}
            className="p-6 bg-white rounded-xl border border-heritage-300 shadow-sm space-y-4 text-xs"
          >
            <h3 className="font-serif font-bold text-sm text-heritage-900 pb-2 border-b">
              New Promotional Voucher Code
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. DIWALI20"
                  className="w-full px-3 py-2 border rounded uppercase font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded bg-heritage-50"
                >
                  <option value="PERCENTAGE">Percentage (% Off)</option>
                  <option value="FIXED">Fixed Amount (₹ Off)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Discount Value *</label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Minimum Cart Subtotal (₹)</label>
                <input
                  type="number"
                  value={minimumCartValue}
                  onChange={(e) => setMinimumCartValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Maximum Discount Cap (₹)</label>
                <input
                  type="number"
                  value={maximumDiscount}
                  onChange={(e) => setMaximumDiscount(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-heritage-900 text-gold font-bold rounded hover:bg-heritage-800 transition"
              >
                Save & Activate Coupon
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-heritage-200 text-heritage-800 font-semibold rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Coupons List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="p-5 bg-white rounded-xl border border-heritage-200 shadow-sm space-y-3 text-xs"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-mono font-bold text-sm text-heritage-900 bg-heritage-100 px-2 py-0.5 rounded">
                  {c.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-heritage-200 text-heritage-600'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="space-y-1 text-heritage-600">
                <p>
                  Benefit: <strong>{c.type === 'PERCENTAGE' ? `${c.value}% Off` : `₹${c.value} Flat Off`}</strong>
                </p>
                <p>Min Cart: <strong>₹{c.minimumCartValue.toLocaleString('en-IN')}</strong></p>
                {c.maximumDiscount && <p>Max Cap: <strong>₹{c.maximumDiscount.toLocaleString('en-IN')}</strong></p>}
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleActive(c.id)}
                  className="text-[11px] font-bold text-heritage-900 hover:text-gold-dark underline"
                >
                  {c.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
