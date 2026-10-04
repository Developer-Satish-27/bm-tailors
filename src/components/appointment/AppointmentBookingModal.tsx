'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { Calendar, Clock, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface ModalProps {
  defaultType?: 'CUSTOM_TAILORING' | 'WEDDING_CONSULTATION' | 'MEASUREMENT' | 'STORE_VISIT';
  buttonLabel?: string;
  className?: string;
}

export function AppointmentBookingModal({
  defaultType = 'STORE_VISIT',
  buttonLabel,
  className,
}: ModalProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [type, setType] = useState(defaultType);
  const [date, setDate] = useState(() => {
    // Tomorrow as initial default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; isAvailable: boolean }>>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch slots whenever date changes
  useEffect(() => {
    if (!isOpen || !date) return;
    const fetchSlots = async () => {
      try {
        const res = await fetch(`/api/appointments?date=${date}`);
        const data = await res.json();
        if (data.success && data.data.slots) {
          setAvailableSlots(data.data.slots);
          const firstAvail = data.data.slots.find((s: any) => s.isAvailable);
          if (firstAvail) setSelectedSlot(firstAvail.time);
        }
      } catch {
        // Fallback default slots
        setAvailableSlots([
          { time: '10:30 AM', isAvailable: true },
          { time: '12:00 PM', isAvailable: true },
          { time: '02:30 PM', isAvailable: true },
          { time: '04:30 PM', isAvailable: true },
          { time: '06:30 PM', isAvailable: true },
        ]);
        setSelectedSlot('12:00 PM');
      }
    };
    fetchSlots();
  }, [date, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    trackEvent('appointment_started', { type, date, selectedSlot });

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          date,
          startTime: selectedSlot,
          customerName: name,
          customerPhone: phone,
          customerEmail: email || undefined,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        trackEvent('appointment_completed', {
          appointmentId: data.data.appointment.id,
          type,
          date,
        });
      } else {
        setError(data.error?.message || 'Failed to book appointment');
      }
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSuccess(false);
    setError(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={
          className ||
          'px-6 py-3 bg-heritage-800 hover:bg-heritage-700 text-white font-semibold rounded text-sm transition border border-heritage-700 flex items-center space-x-2'
        }
      >
        <Calendar className="w-4 h-4 text-gold" />
        <span>{buttonLabel || t.hero.bookCTA}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-heritage-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-heritage-100 bg-heritage-900 text-white rounded-t-xl">
              <div>
                <h3 className="font-serif text-lg font-bold">{t.appointment.title}</h3>
                <p className="text-xs text-gold mt-0.5">Jaipur Atelier • Since 1990</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-heritage-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {success ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-heritage-900">
                    Appointment Confirmed!
                  </h4>
                  <p className="text-xs text-heritage-600 max-w-sm mx-auto leading-relaxed">
                    {t.appointment.successMessage}
                  </p>
                  <div className="bg-heritage-50 p-4 rounded-lg text-xs text-heritage-700 space-y-1 text-left max-w-sm mx-auto border border-heritage-200">
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Time Slot:</strong> {selectedSlot}</p>
                    <p><strong>Consultation:</strong> {type.replace('_', ' ')}</p>
                    <p><strong>Location:</strong> B M Tailors Atelier, Jaipur, Rajasthan</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full mt-4 py-2.5 bg-heritage-900 text-white text-xs font-semibold rounded hover:bg-heritage-800 transition"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Consultation Type */}
                  <div>
                    <label className="block text-xs font-semibold text-heritage-800 mb-1">
                      {t.appointment.type}
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none bg-heritage-50"
                    >
                      <option value="CUSTOM_TAILORING">{t.appointment.typeCustom}</option>
                      <option value="WEDDING_CONSULTATION">{t.appointment.typeWedding}</option>
                      <option value="MEASUREMENT">{t.appointment.typeMeasurement}</option>
                      <option value="STORE_VISIT">{t.appointment.typeStoreVisit}</option>
                    </select>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-heritage-800 mb-1">
                        {t.appointment.selectDate}
                      </label>
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none bg-heritage-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-heritage-800 mb-1">
                        {t.appointment.selectTime}
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none bg-heritage-50"
                      >
                        {availableSlots.map((slot) => (
                          <option
                            key={slot.time}
                            value={slot.time}
                            disabled={!slot.isAvailable}
                          >
                            {slot.time} {slot.isAvailable ? '' : '(Fully Booked)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-heritage-800 mb-1">
                        {t.appointment.yourName} *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. Vikramaditya Singh"
                        className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-heritage-800 mb-1">
                        {t.appointment.yourPhone} *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="10-digit mobile number"
                        className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-heritage-800 mb-1">
                      {t.appointment.yourEmail}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Optional for digital calendar invite"
                      className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-heritage-800 mb-1">
                      {t.appointment.notes}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Looking for a 3-piece wedding suit and Jodhpuri Bandhgala"
                      className="w-full px-3 py-2 text-xs border border-heritage-300 rounded focus:border-gold focus:outline-none"
                    />
                  </div>

                  <p className="text-[11px] text-heritage-500">
                    Appointments take place at our Jaipur atelier with master cutting staff. No consultation fees are required.
                  </p>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || !selectedSlot}
                      className="w-full py-3 bg-heritage-900 hover:bg-heritage-800 text-gold font-bold text-xs rounded transition flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Reserving Atelier Slot...</span>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-gold" />
                          <span>{t.appointment.confirmBooking}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
