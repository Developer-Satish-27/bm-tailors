'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Search,
  Filter,
  RefreshCw,
  History,
  Check,
  TrendingDown,
  Layers,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface VariantItem {
  id: string;
  sku: string;
  size: string;
  color: string;
  fabric?: string | null;
  fit?: string | null;
  price: number;
  stockQuantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'LOW' | 'OUT' | 'HEALTHY'>('ALL');
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState<string>('Jaipur Atelier Workshop Restock');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      if (data.success && data.data?.variants) {
        setVariants(data.data.variants);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAdjustStock = async (variantId: string, quantity: number, reason: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          adjustmentQuantity: quantity,
          reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Stock updated: ${quantity > 0 ? `+${quantity}` : quantity} units`);
        setAdjustingId(null);
        fetchInventory();
      } else {
        alert(data.error?.message || 'Failed to adjust stock');
      }
    } catch {
      alert('Error updating stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics
  const totalUnits = variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  const lowStockCount = variants.filter((v) => v.stockQuantity > 0 && v.stockQuantity < 5).length;
  const outOfStockCount = variants.filter((v) => v.stockQuantity === 0).length;
  const healthyCount = variants.filter((v) => v.stockQuantity >= 5).length;

  // Filtered list
  const filteredVariants = variants.filter((v) => {
    const matchesSearch =
      search === '' ||
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.product.name.toLowerCase().includes(search.toLowerCase()) ||
      v.color.toLowerCase().includes(search.toLowerCase()) ||
      v.size.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'LOW') return v.stockQuantity > 0 && v.stockQuantity < 5;
    if (filterType === 'OUT') return v.stockQuantity === 0;
    if (filterType === 'HEALTHY') return v.stockQuantity >= 5;
    return true;
  });

  return (
    <div className="min-h-screen bg-heritage-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminHeader />

        {/* Toast Alert */}
        {notification && (
          <div className="fixed top-5 right-5 z-50 bg-heritage-900 text-gold px-4 py-3 rounded-xl shadow-2xl border border-gold/40 flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">{notification}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Boxes className="w-6 h-6 text-gold-dark" />
              <h1 className="font-serif text-2xl font-bold text-heritage-900">
                Inventory Ledger & Stock Control
              </h1>
            </div>
            <p className="text-xs text-heritage-500 mt-1">
              Real-time variant-level physical stock tracking, automatic low-stock alerts, and logged audit restocks.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchInventory}
              className="p-2.5 border border-heritage-200 rounded-lg hover:bg-heritage-50 text-heritage-600 transition flex items-center space-x-1.5 text-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Ledger</span>
            </button>
          </div>
        </div>

        {/* 4 Inventory Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-heritage-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-heritage-500 uppercase tracking-wider">
                Total Physical Units
              </span>
              <Layers className="w-4 h-4 text-heritage-400" />
            </div>
            <p className="font-serif text-2xl font-bold text-heritage-900">{totalUnits}</p>
            <p className="text-[10px] text-heritage-500">Across {variants.length} SKUs in stock</p>
          </div>

          <div
            onClick={() => setFilterType('LOW')}
            className={`p-5 rounded-2xl border shadow-sm space-y-1 cursor-pointer transition ${
              filterType === 'LOW'
                ? 'bg-amber-100/70 border-amber-400 ring-2 ring-amber-300'
                : 'bg-white border-heritage-200 hover:bg-amber-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                Low Stock Alert
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-serif text-2xl font-bold text-amber-800">{lowStockCount}</p>
            <p className="text-[10px] text-amber-700">Less than 5 units left</p>
          </div>

          <div
            onClick={() => setFilterType('OUT')}
            className={`p-5 rounded-2xl border shadow-sm space-y-1 cursor-pointer transition ${
              filterType === 'OUT'
                ? 'bg-rose-100/70 border-rose-400 ring-2 ring-rose-300'
                : 'bg-white border-heritage-200 hover:bg-rose-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                Out of Stock
              </span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="font-serif text-2xl font-bold text-rose-800">{outOfStockCount}</p>
            <p className="text-[10px] text-rose-600">Immediate manufacturing needed</p>
          </div>

          <div
            onClick={() => setFilterType('HEALTHY')}
            className={`p-5 rounded-2xl border shadow-sm space-y-1 cursor-pointer transition ${
              filterType === 'HEALTHY'
                ? 'bg-emerald-100/70 border-emerald-400 ring-2 ring-emerald-300'
                : 'bg-white border-heritage-200 hover:bg-emerald-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Healthy Stock
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-serif text-2xl font-bold text-emerald-800">{healthyCount}</p>
            <p className="text-[10px] text-emerald-600">5+ units in warehouse</p>
          </div>
        </div>

        {/* Search & Quick Filters */}
        <div className="bg-white p-4 rounded-xl border border-heritage-200 shadow-sm flex flex-col sm:flex-row gap-3 text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-heritage-400" />
            <input
              type="text"
              placeholder="Search by SKU (e.g. BMT-RTW-001-38), Garment name, Color, or Size..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-heritage-50/70 border border-heritage-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-2 rounded-lg font-medium transition ${
                filterType === 'ALL'
                  ? 'bg-heritage-900 text-white'
                  : 'bg-heritage-100 text-heritage-700 hover:bg-heritage-200'
              }`}
            >
              All ({variants.length})
            </button>
            <button
              onClick={() => setFilterType('LOW')}
              className={`px-3 py-2 rounded-lg font-medium transition ${
                filterType === 'LOW'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setFilterType('OUT')}
              className={`px-3 py-2 rounded-lg font-medium transition ${
                filterType === 'OUT'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              Out of Stock ({outOfStockCount})
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-2xl border border-heritage-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-heritage-700">
              <thead className="bg-heritage-100/60 text-heritage-900 uppercase font-bold tracking-wider text-[11px] border-b border-heritage-200">
                <tr>
                  <th className="p-4">SKU & Garment</th>
                  <th className="p-4">Size & Color</th>
                  <th className="p-4">Fabric / Fit</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4 text-center">Stock Level</th>
                  <th className="p-4 text-right">Quick Restock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-100">
                {loading && variants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-heritage-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gold-dark" />
                      Loading inventory ledger...
                    </td>
                  </tr>
                ) : filteredVariants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-heritage-500">
                      No variants found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVariants.map((v) => {
                    const isOut = v.stockQuantity === 0;
                    const isLow = v.stockQuantity > 0 && v.stockQuantity < 5;

                    return (
                      <tr key={v.id} className="hover:bg-heritage-50/60 transition group">
                        {/* SKU & Product */}
                        <td className="p-4">
                          <p className="font-mono font-bold text-heritage-900 tracking-tight">
                            {v.sku}
                          </p>
                          <Link
                            href={`/shop?slug=${v.product.slug}`}
                            target="_blank"
                            className="text-[11px] text-heritage-600 hover:text-gold-dark transition font-medium"
                          >
                            {v.product.name}
                          </Link>
                        </td>

                        {/* Size & Color */}
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-bold text-heritage-900 bg-heritage-100 px-2 py-0.5 rounded text-[11px]">
                            {v.size}
                          </span>
                          <span className="text-heritage-600 ml-2">{v.color}</span>
                        </td>

                        {/* Fabric & Fit */}
                        <td className="p-4 whitespace-nowrap text-heritage-600 text-[11px]">
                          {v.fabric || 'Standard Weave'}
                          {v.fit && <span className="text-heritage-400 ml-1">({v.fit})</span>}
                        </td>

                        {/* Price */}
                        <td className="p-4 whitespace-nowrap font-serif font-bold text-heritage-900">
                          ₹{v.price.toLocaleString('en-IN')}
                        </td>

                        {/* Stock Level Badge */}
                        <td className="p-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[11px] font-bold">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isOut
                                  ? 'bg-rose-500 animate-pulse'
                                  : isLow
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            <span
                              className={
                                isOut
                                  ? 'text-rose-700'
                                  : isLow
                                  ? 'text-amber-800'
                                  : 'text-emerald-800'
                              }
                            >
                              {v.stockQuantity} units
                            </span>
                          </div>
                        </td>

                        {/* Quick Restock Actions */}
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleAdjustStock(v.id, 5, 'Quick +5 Restock from Workshop')}
                              disabled={isSubmitting}
                              className="px-2.5 py-1 bg-heritage-100 hover:bg-gold/20 hover:text-heritage-900 text-heritage-700 rounded font-semibold text-[11px] transition border border-heritage-200"
                              title="Restock +5 units"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleAdjustStock(v.id, 10, 'Batch +10 Production Lot Restock')}
                              disabled={isSubmitting}
                              className="px-2.5 py-1 bg-heritage-100 hover:bg-gold/20 hover:text-heritage-900 text-heritage-700 rounded font-semibold text-[11px] transition border border-heritage-200"
                              title="Restock +10 units"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => {
                                setAdjustingId(v.id);
                                setAdjustAmount(5);
                              }}
                              className="px-3 py-1 bg-heritage-900 hover:bg-gold hover:text-heritage-900 text-white rounded font-bold text-[11px] transition shadow-sm"
                            >
                              Custom Adjust
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Adjustment Modal */}
        {adjustingId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-heritage-200 space-y-4">
              <div className="pb-3 border-b border-heritage-100">
                <h3 className="font-serif text-lg font-bold text-heritage-900">
                  Custom Inventory Adjustment
                </h3>
                <p className="text-xs text-heritage-500 mt-0.5">
                  Record inward shipment or audit deduction with automatic audit log.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-heritage-700 mb-1">
                    Adjustment Quantity (Use negative for shrinkage/returns)
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setAdjustAmount((prev) => prev - 1)}
                      className="p-2 border border-heritage-300 rounded-lg hover:bg-heritage-100"
                    >
                      <Minus className="w-4 h-4 text-heritage-600" />
                    </button>
                    <input
                      type="number"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(Number(e.target.value))}
                      className="flex-1 text-center font-bold text-base py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setAdjustAmount((prev) => prev + 1)}
                      className="p-2 border border-heritage-300 rounded-lg hover:bg-heritage-100"
                    >
                      <Plus className="w-4 h-4 text-heritage-600" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-heritage-700 mb-1">
                    Reason / Note (Logged in Audit Ledger)
                  </label>
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="e.g. New lot received from Jaipur master tailor"
                    className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-heritage-100">
                  <button
                    type="button"
                    onClick={() => setAdjustingId(null)}
                    className="px-4 py-2 border border-heritage-300 rounded-lg hover:bg-heritage-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleAdjustStock(adjustingId, adjustAmount, adjustReason)}
                    className="px-4 py-2 bg-gold hover:bg-gold-light text-heritage-900 font-bold rounded-lg transition"
                  >
                    {isSubmitting ? 'Updating...' : 'Commit Stock Change'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
