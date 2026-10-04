import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import {
  Package,
  Calendar,
  AlertTriangle,
  Scissors,
  Building2,
  TrendingUp,
  CreditCard,
  Truck,
  Settings,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { AdminOrdersTable } from '@/components/admin/AdminOrdersTable';
import { AdminStockAdjuster } from '@/components/admin/AdminStockAdjuster';
import { AdminSettingsForm } from '@/components/admin/AdminSettingsForm';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    orders,
    lowStockVariants,
    appointments,
    uniformEnquiries,
    customOrders,
    productsCount,
    settings,
  ] = await Promise.all([
    prisma.order.findMany({
      include: {
        items: true,
        user: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.productVariant.findMany({
      where: { stockQuantity: { lt: 5 } },
      include: { product: true },
      take: 8,
    }),
    prisma.appointment.findMany({
      where: { status: { in: ['PENDING', 'CONFIRMED'] } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.uniformEnquiry.findMany({
      where: { status: 'NEW' },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.customOrder.findMany({
      where: { status: 'ENQUIRY' },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.storeSetting.findMany(),
  ]);

  // Aggregate metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'PAID' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'ORDER_PLACED' || o.status === 'PROCESSING').length;

  return (
    <div className="min-h-screen bg-heritage-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Navigation Bar */}
        <AdminHeader />

        {/* 7 Key Dashboard Metrics (Prompt #51: What sold? What is pending? What needs attention?) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white p-4 rounded-xl border border-heritage-200 space-y-1">
            <p className="text-[11px] font-semibold text-heritage-500 uppercase">Paid Revenue</p>
            <p className="font-serif text-xl font-bold text-heritage-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-emerald-600 font-medium">Orders Processed</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-heritage-200 space-y-1">
            <p className="text-[11px] font-semibold text-heritage-500 uppercase">Pending Orders</p>
            <p className="font-serif text-xl font-bold text-amber-700">{pendingOrdersCount}</p>
            <p className="text-[10px] text-amber-600">Requires Dispatch</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-heritage-200 space-y-1">
            <p className="text-[11px] font-semibold text-heritage-500 uppercase">Low Stock</p>
            <p className="font-serif text-xl font-bold text-rose-600">{lowStockVariants.length}</p>
            <p className="text-[10px] text-rose-500">Variants &lt; 5 Units</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-heritage-200 space-y-1">
            <p className="text-[11px] font-semibold text-heritage-500 uppercase">Appointments</p>
            <p className="font-serif text-xl font-bold text-heritage-900">{appointments.length}</p>
            <p className="text-[10px] text-heritage-500">Upcoming Visits</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-heritage-200 space-y-1">
            <p className="text-[11px] font-semibold text-heritage-500 uppercase">Custom Enquiries</p>
            <p className="font-serif text-xl font-bold text-heritage-900">{customOrders.length}</p>
            <p className="text-[10px] text-heritage-500">Bespoke Requests</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-heritage-200 space-y-1">
            <p className="text-[11px] font-semibold text-heritage-500 uppercase">Uniform Quotes</p>
            <p className="font-serif text-xl font-bold text-heritage-900">{uniformEnquiries.length}</p>
            <p className="text-[10px] text-heritage-500">Bulk Inquiries</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-heritage-200 space-y-1">
            <p className="text-[11px] font-semibold text-heritage-500 uppercase">Active Products</p>
            <p className="font-serif text-xl font-bold text-heritage-900">{productsCount}</p>
            <p className="text-[10px] text-heritage-500">Published Online</p>
          </div>
        </div>

        {/* Section 1: Low-Stock Alerts & Quick Adjustments */}
        {lowStockVariants.length > 0 && (
          <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Low-Stock Inventory Alerts (Action Required)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {lowStockVariants.map((v) => (
                <div key={v.id} className="bg-white p-3 rounded border border-amber-200 space-y-1.5 shadow-sm">
                  <p className="font-bold text-heritage-900 truncate">{v.product.name}</p>
                  <p className="text-[11px] text-heritage-600">
                    SKU: {v.sku} • Size: {v.size}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-rose-600 font-bold text-xs">Only {v.stockQuantity} left</span>
                    <AdminStockAdjuster variantId={v.id} currentStock={v.stockQuantity} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Order Management & Status Updates */}
        <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-heritage-100">
            <div>
              <h2 className="font-serif text-lg font-bold text-heritage-900">Recent Customer Orders</h2>
              <p className="text-xs text-heritage-500">Manage fulfillment, update workflow, and review COD orders.</p>
            </div>
            <span className="text-xs text-heritage-500">{orders.length} total orders</span>
          </div>

          <AdminOrdersTable initialOrders={orders} />
        </div>

        {/* Section 3: Upcoming Appointments & Uniform Enquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Atelier Appointments */}
          <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-heritage-100">
              <h3 className="font-serif font-bold text-base text-heritage-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gold-dark" />
                <span>Upcoming Atelier Appointments</span>
              </h3>
              <span className="text-xs text-heritage-500">{appointments.length} active</span>
            </div>

            {appointments.length === 0 ? (
              <p className="text-xs text-heritage-500 py-6 text-center">No upcoming appointments scheduled.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div key={a.id} className="p-3 bg-heritage-50 rounded-lg border border-heritage-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-heritage-900">{a.customerName}</span>
                      <span className="text-[10px] bg-heritage-900 text-gold px-2 py-0.5 rounded font-bold">
                        {a.status}
                      </span>
                    </div>
                    <p className="text-heritage-600">
                      Phone: {a.customerPhone} • Type: {a.type.replace('_', ' ')}
                    </p>
                    <p className="text-[11px] text-heritage-500">
                      Date: {a.date} at {a.startTime}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bulk Uniform Enquiries */}
          <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-heritage-100">
              <h3 className="font-serif font-bold text-base text-heritage-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gold-dark" />
                <span>Bulk Uniform Quotations (Pending)</span>
              </h3>
              <span className="text-xs text-heritage-500">{uniformEnquiries.length} pending</span>
            </div>

            {uniformEnquiries.length === 0 ? (
              <p className="text-xs text-heritage-500 py-6 text-center">No pending uniform quotation requests.</p>
            ) : (
              <div className="space-y-3">
                {uniformEnquiries.map((u) => (
                  <div key={u.id} className="p-3 bg-heritage-50 rounded-lg border border-heritage-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-heritage-900">{u.organization}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                        {u.sector}
                      </span>
                    </div>
                    <p className="text-heritage-600">
                      Contact: {u.name} ({u.phone}) • Quantity: {u.quantity} pcs
                    </p>
                    <p className="text-[11px] text-heritage-500">
                      Type: {u.uniformType}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Store Settings, Future GST Invoicing & Branch Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-heritage-100">
            <h2 className="font-serif text-lg font-bold text-heritage-900 flex items-center space-x-2">
              <Settings className="w-4 h-4 text-gold-dark" />
              <span>Store Settings, Future GST Invoicing Architecture & Branches</span>
            </h2>
            <p className="text-xs text-heritage-500">
              Manage future GST compliance, Jaipur shipping fees, COD handling fees, and 2 Jaipur atelier branch placeholders.
            </p>
          </div>

          <AdminSettingsForm initialSettings={settings} />
        </div>
      </div>
    </div>
  );
}
