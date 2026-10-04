'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Check, Clock, X, User, Phone, Mail, Filter } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments');
      const data = await res.json();
      // If endpoint doesn't return list directly for admin, fetch via admin or fallback
      if (data.data?.slots) {
        // mock/seed appointments for admin view
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial sample appointments for Jaipur atelier
    setAppointments([
      {
        id: 'appt-1',
        customerName: 'Yashwardhan Rathore',
        customerPhone: '+91 98290 11223',
        customerEmail: 'yash@example.com',
        type: 'WEDDING_CONSULTATION',
        date: '2026-10-06',
        startTime: '12:00 PM',
        status: 'CONFIRMED',
        notes: 'Groom sherwani & 3-piece reception suit styling for royal wedding in Jaipur.',
      },
      {
        id: 'appt-2',
        customerName: 'Mahesh Agarwal',
        customerPhone: '+91 94140 88776',
        customerEmail: 'mahesh@example.com',
        type: 'CUSTOM_TAILORING',
        date: '2026-10-07',
        startTime: '02:30 PM',
        status: 'PENDING',
        notes: 'Trial measurement for 2 business suits and Italian wool bandhgala.',
      },
      {
        id: 'appt-3',
        customerName: 'Devendra Singh Shekhawat',
        customerPhone: '+91 98292 44332',
        customerEmail: 'devendra@example.com',
        type: 'STORE_VISIT',
        date: '2026-10-08',
        startTime: '04:30 PM',
        status: 'CONFIRMED',
        notes: 'Fabric selection for traditional Rajasthani Angrakha.',
      },
    ]);
    setLoading(false);
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const filtered =
    filterStatus === 'ALL'
      ? appointments
      : appointments.filter((a) => a.status === filterStatus);

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
                Atelier Appointments Management
              </h1>
              <p className="text-xs text-heritage-500">
                Track patron visits, custom consultations, and measurement sessions in Jaipur.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-heritage-900 text-gold rounded-full">
            {appointments.length} Total Bookings
          </span>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 text-xs">
          {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
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
              {st}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl p-5 border border-heritage-200 shadow-sm space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-heritage-900 text-sm">{a.customerName}</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    a.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : a.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-heritage-100 text-heritage-700'
                  }`}
                >
                  {a.status}
                </span>
              </div>

              <div className="space-y-1.5 text-heritage-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                  <span>
                    <strong>Date:</strong> {a.date} at {a.startTime}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-gold-dark" />
                  <span>
                    <strong>Type:</strong> {a.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-gold-dark" />
                  <span>{a.customerPhone}</span>
                </div>
                {a.customerEmail && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-gold-dark" />
                    <span>{a.customerEmail}</span>
                  </div>
                )}
              </div>

              {a.notes && (
                <div className="p-2.5 bg-heritage-50 rounded border text-[11px] text-heritage-600">
                  <p className="font-semibold text-heritage-800">Patron Notes:</p>
                  <p>{a.notes}</p>
                </div>
              )}

              {/* Status Actions */}
              <div className="pt-2 border-t flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(a.id, 'COMPLETED')}
                  className="flex-1 py-1.5 bg-heritage-900 text-gold font-bold text-[11px] rounded hover:bg-heritage-800 transition"
                >
                  Mark Completed
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(a.id, 'CANCELLED')}
                  className="px-3 py-1.5 bg-heritage-100 text-heritage-600 font-semibold text-[11px] rounded hover:bg-rose-50 hover:text-rose-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
