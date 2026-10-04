'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle, Clock, Truck, Eye, AlertCircle, FileText } from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: string;
  paymentStatus: string;
  isCod: boolean;
  isExchangeEligible: boolean;
  user: {
    email: string;
    profile?: { displayName?: string } | null;
  };
  items: Array<{
    id: string;
    productNameSnapshot: string;
    sizeSnapshot: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export function AdminOrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const statuses = [
    'ORDER_PLACED',
    'PAYMENT_CONFIRMED',
    'PROCESSING',
    'TAILORING',
    'READY',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    filterStatus === 'ALL'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1 rounded transition ${
            filterStatus === 'ALL'
              ? 'bg-heritage-900 text-gold font-bold'
              : 'bg-heritage-100 text-heritage-700 hover:bg-heritage-200'
          }`}
        >
          All ({orders.length})
        </button>
        {statuses.slice(0, 6).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1 rounded transition ${
              filterStatus === st
                ? 'bg-heritage-900 text-gold font-bold'
                : 'bg-heritage-100 text-heritage-700 hover:bg-heritage-200'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto border border-heritage-200 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-heritage-100 text-heritage-800 font-bold uppercase text-[10px] tracking-wider border-b border-heritage-200">
            <tr>
              <th className="p-3">Order Number</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Amount & Payment</th>
              <th className="p-3">Exchange Policy</th>
              <th className="p-3">Status Workflow</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-heritage-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-heritage-500">
                  No orders matching this filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-heritage-50/70 transition">
                  {/* Order Number & Date */}
                  <td className="p-3 font-medium">
                    <p className="font-bold text-heritage-900">{o.orderNumber}</p>
                    <p className="text-[10px] text-heritage-500">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </td>

                  {/* Customer */}
                  <td className="p-3">
                    <p className="font-semibold text-heritage-900">
                      {o.user.profile?.displayName || 'Gentleman Customer'}
                    </p>
                    <p className="text-[10px] text-heritage-500">{o.user.email}</p>
                  </td>

                  {/* Items */}
                  <td className="p-3">
                    <div className="space-y-0.5">
                      {o.items.map((i) => (
                        <p key={i.id} className="text-heritage-800">
                          {i.quantity}x {i.productNameSnapshot} ({i.sizeSnapshot})
                        </p>
                      ))}
                    </div>
                  </td>

                  {/* Amount & Method */}
                  <td className="p-3">
                    <p className="font-bold text-heritage-900">₹{o.total.toLocaleString('en-IN')}</p>
                    <span
                      className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        o.isCod ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {o.isCod ? 'COD (Cash on Delivery)' : 'Paid Online'}
                    </span>
                  </td>

                  {/* Exchange Indicator (Strict rule: COD orders = Exchange Not Available) */}
                  <td className="p-3">
                    {o.isCod ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                        <span>COD — Exchange Not Available</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        7-Day Exchange Eligible
                      </span>
                    )}
                  </td>

                  {/* Status Dropdown & Invoice Action */}
                  <td className="p-3 space-y-1.5">
                    <select
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="px-2 py-1 text-xs border border-heritage-300 rounded font-semibold bg-white focus:outline-none focus:border-gold block w-full"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>

                    <Link
                      href={`/orders/${o.id}/invoice`}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-heritage-800 hover:text-gold-dark underline pt-1"
                    >
                      <FileText className="w-3 h-3 text-gold-dark" />
                      <span>Print Tax Invoice</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
