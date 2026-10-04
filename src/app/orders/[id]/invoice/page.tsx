import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Printer, ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface InvoicePageProps {
  params: {
    id: string;
  };
}

export default async function OrderInvoicePage({ params }: InvoicePageProps) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: params.id }, { orderNumber: params.id }],
    },
    include: {
      items: true,
      user: { include: { profile: true } },
    },
  });

  if (!order) {
    notFound();
  }

  // Load GST Configuration from store settings
  const gstSetting = await prisma.storeSetting.findUnique({
    where: { key: 'gst_config' },
  });
  const gstConfig = gstSetting
    ? JSON.parse(gstSetting.valueJson)
    : {
        isGstActive: false,
        gstin: '[GST NOT CONFIGURED]',
        cgstPercent: 6,
        sgstPercent: 6,
        igstPercent: 12,
        defaultHsn: '6203',
        invoicePrefix: 'BMT/2026/',
      };

  const address = JSON.parse(order.shippingAddressSnapshot || '{}');

  // Calculate taxes if activated
  const isGstActive = gstConfig.isGstActive;
  const isInterState = address.state && address.state.toLowerCase() !== 'rajasthan';

  const cgstAmount = isGstActive && !isInterState ? (order.subtotal * gstConfig.cgstPercent) / 100 : 0;
  const sgstAmount = isGstActive && !isInterState ? (order.subtotal * gstConfig.sgstPercent) / 100 : 0;
  const igstAmount = isGstActive && isInterState ? (order.subtotal * gstConfig.igstPercent) / 100 : 0;

  return (
    <div className="min-h-screen bg-heritage-50 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation & Print Action Bar (Hidden on print) */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href="/account?tab=orders"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-heritage-700 hover:text-heritage-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.print();
            }}
            className="px-4 py-2 bg-heritage-900 text-gold font-bold text-xs rounded hover:bg-heritage-800 transition flex items-center space-x-1.5 shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>
        </div>

        {/* Invoice Card */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-heritage-200 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-heritage-200 gap-4">
            <div className="flex items-start space-x-4">
              <div className="relative w-16 h-16 rounded-xl border border-heritage-200 p-1 bg-white shrink-0">
                <Image
                  src="/images/bm-tailor-logo.jpg"
                  alt="B.M. TAILOR Logo"
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-heritage-900">
                  B.M. TAILOR
                </h1>
                <p className="text-xs text-gold-dark font-bold tracking-widest uppercase mt-0.5">
                  ESTABLISHED 1990 • JAIPUR, RAJASTHAN
                </p>
                <p className="text-xs text-heritage-600 mt-1 max-w-xs">
                  Two Atelier Locations in Jaipur, Rajasthan, India<br />
                  Phone: [BUSINESS PHONE] • Email: [BUSINESS EMAIL]
                </p>
              {isGstActive ? (
                <p className="text-xs text-heritage-800 font-semibold mt-1">
                  GSTIN: {gstConfig.gstin}
                </p>
              ) : (
                <p className="text-[11px] text-heritage-400 mt-1">
                  Composition / Retail Retailer (GST Registration in Progress)
                </p>
              )}
              </div>
            </div>

            <div className="text-right sm:text-right space-y-1 text-xs">
              <span className="inline-block px-3 py-1 bg-heritage-900 text-gold font-bold rounded text-xs">
                {isGstActive ? 'TAX INVOICE' : 'RETAIL INVOICE'}
              </span>
              <p className="font-bold text-heritage-900 pt-1">
                Invoice No: {gstConfig.invoicePrefix}{order.orderNumber.replace('BMT-2026-', '')}
              </p>
              <p className="text-heritage-500">
                Order Ref: {order.orderNumber}
              </p>
              <p className="text-heritage-500">
                Date: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Billing & Shipping Snapshots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-heritage-700">
            <div className="space-y-1">
              <p className="font-bold uppercase tracking-wider text-heritage-900 text-[11px]">Billed To / Delivered To</p>
              <p className="font-bold text-heritage-900">{address.fullName || order.user.profile?.displayName}</p>
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>{address.city}, {address.state} — {address.pincode}</p>
              <p>Phone: {address.phone || order.user.phone}</p>
            </div>

            <div className="space-y-1 text-left sm:text-right">
              <p className="font-bold uppercase tracking-wider text-heritage-900 text-[11px]">Payment & Dispatch</p>
              <p>
                Payment Method: <strong>{order.isCod ? 'Cash on Delivery (COD)' : 'Prepaid Online'}</strong>
              </p>
              <p>
                Payment Status: <strong>{order.paymentStatus}</strong>
              </p>
              <p>
                Dispatch Zone: <strong>Urban Jaipur Logistics</strong>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-heritage-100 text-heritage-900 font-bold uppercase text-[10px] tracking-wider border-y border-heritage-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">HSN Code</th>
                  <th className="p-3">Size / Spec</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-100">
                {order.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-3 text-heritage-400">{idx + 1}</td>
                    <td className="p-3 font-semibold text-heritage-900">
                      {item.productNameSnapshot}
                      {item.colorSnapshot && <span className="block text-[11px] text-heritage-500 font-normal">Color: {item.colorSnapshot}</span>}
                    </td>
                    <td className="p-3 text-heritage-500 font-mono">{gstConfig.defaultHsn}</td>
                    <td className="p-3 text-heritage-700">{item.sizeSnapshot}</td>
                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                    <td className="p-3 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-bold">₹{item.totalPrice.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-heritage-200 text-xs">
            {/* Policy notice snapshot */}
            <div className="max-w-xs space-y-2">
              <div className="p-3 bg-heritage-50 rounded border border-heritage-200 text-[11px] text-heritage-600">
                <p className="font-bold text-heritage-900 mb-0.5">Store Exchange Policy:</p>
                {order.isCod ? (
                  <p className="text-rose-700 font-semibold">
                    * Cash on Delivery (COD) orders are strictly non-exchangeable.
                  </p>
                ) : (
                  <p className="text-emerald-800">
                    * Ready-made items eligible for 7-day exchange in unworn condition with tags.
                  </p>
                )}
              </div>
            </div>

            {/* Calculations */}
            <div className="w-full sm:w-64 space-y-2 text-heritage-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              {order.codFee > 0 && (
                <div className="flex justify-between">
                  <span>COD Handling Fee</span>
                  <span>₹{order.codFee}</span>
                </div>
              )}

              {/* GST Tax breakdown if active */}
              {isGstActive && (
                <>
                  {!isInterState ? (
                    <>
                      <div className="flex justify-between text-heritage-600 text-[11px]">
                        <span>CGST ({gstConfig.cgstPercent}%)</span>
                        <span>₹{cgstAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-heritage-600 text-[11px]">
                        <span>SGST ({gstConfig.sgstPercent}%)</span>
                        <span>₹{sgstAmount.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-heritage-600 text-[11px]">
                      <span>IGST ({gstConfig.igstPercent}%)</span>
                      <span>₹{igstAmount.toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between text-sm font-bold text-heritage-900 pt-2 border-t border-heritage-300">
                <span>Total Payable</span>
                <span className="font-serif text-base">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-8 border-t border-heritage-200 text-center text-[11px] text-heritage-400">
            <p>Thank you for choosing B M Tailors — Crafting Confidence Since 1990 in Jaipur, Rajasthan.</p>
            <p>Computer-generated invoice. For assistance, contact [BUSINESS EMAIL] or [BUSINESS PHONE].</p>
          </div>
        </div>
      </div>
    </div>
  );
}
