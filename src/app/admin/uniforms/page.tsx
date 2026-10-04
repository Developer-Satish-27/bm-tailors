'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Phone, Mail, FileText, Check, Clock, Layers } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminUniformsPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    // Sample initial institutional inquiries
    setEnquiries([
      {
        id: 'uni-1',
        organization: 'Maharaja Sawai Man Singh Vidyalaya',
        name: 'Arvind Sharma',
        sector: 'Schools & Colleges',
        phone: '+91 94140 12345',
        email: 'admin@msmsv.edu.in',
        quantity: 450,
        uniformType: 'Winter School Blazers & Wool Trousers',
        fabricPreference: 'Poly-Viscose Wool Blend (Navy Blue)',
        designRequirements: 'Embroidered school crest on chest pocket with gold thread.',
        status: 'NEW',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'uni-2',
        organization: 'The Grand Palace Heritage Resort',
        name: 'Vikram Joshi (GM)',
        sector: 'Hotels & Hospitality',
        phone: '+91 98290 98765',
        email: 'gm@grandpalacejaipur.com',
        quantity: 120,
        uniformType: 'Front Desk Bandhgalas & Concierge Safari Suits',
        fabricPreference: 'Raw Silk & Fine Suiting',
        designRequirements: 'Imperial royal collar styling with antique brass buttons.',
        status: 'CONTACTED',
        createdAt: new Date().toISOString(),
      },
    ]);
    setLoading(false);
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    setEnquiries(
      enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  const statuses = [
    'NEW',
    'CONTACTED',
    'QUOTATION_SENT',
    'NEGOTIATION',
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED',
  ];

  const filtered =
    filterStatus === 'ALL'
      ? enquiries
      : enquiries.filter((e) => e.status === filterStatus);

  return (
    <div className="min-h-screen bg-heritage-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
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
                Bulk Uniform Quotations Management
              </h1>
              <p className="text-xs text-heritage-500">
                Institutional & corporate uniform enquiries from schools, hotels, hospitals, and factories.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-heritage-900 text-gold rounded-full">
            {enquiries.length} Active Quotes
          </span>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 text-xs">
          {['ALL', ...statuses].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded font-bold transition ${
                filterStatus === st
                  ? 'bg-heritage-900 text-gold shadow'
                  : 'bg-white text-heritage-700 hover:bg-heritage-100 border border-heritage-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Inquiries Table / Cards */}
        <div className="space-y-4">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="bg-white p-6 rounded-xl border border-heritage-200 shadow-sm space-y-4 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-heritage-900">{u.organization}</h3>
                  <span className="text-[11px] text-gold-dark font-semibold uppercase">{u.sector}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-xs text-heritage-900">
                    Est. {u.quantity} Pieces
                  </span>
                  <select
                    value={u.status}
                    onChange={(e) => handleStatusChange(u.id, e.target.value)}
                    className="px-2.5 py-1 border border-heritage-300 rounded font-bold bg-heritage-50 text-heritage-900"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-heritage-700">
                <div className="space-y-1">
                  <p className="font-semibold text-heritage-900">Contact Details</p>
                  <p>Officer: <strong>{u.name}</strong></p>
                  <p>Phone: <a href={`tel:${u.phone}`} className="text-gold-dark underline">{u.phone}</a></p>
                  <p>Email: <a href={`mailto:${u.email}`} className="text-gold-dark underline">{u.email}</a></p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-heritage-900">Garment Requirements</p>
                  <p>Type: <strong>{u.uniformType}</strong></p>
                  {u.fabricPreference && <p>Fabric: <strong>{u.fabricPreference}</strong></p>}
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-heritage-900">Design Specifications</p>
                  <p className="text-[11px] text-heritage-600 bg-heritage-50 p-2.5 rounded border border-heritage-200">
                    {u.designRequirements || 'Standard sector specifications requested.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
