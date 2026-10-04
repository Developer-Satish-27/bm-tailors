'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { AppointmentBookingModal } from '@/components/appointment/AppointmentBookingModal';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 800);
  };

  const handleWhatsApp = () => {
    trackEvent('whatsapp_click', { placement: 'contact_page' });
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
    window.open(`https://wa.me/${waNumber}?text=Namaste%20B%20M%20Tailors!%20I%20have%20an%20inquiry%20regarding%20your%20services.`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner */}
      <div className="bg-heritage-900 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Atelier Inquiries</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Contact B M Tailors</h1>
          <p className="text-xs sm:text-sm text-heritage-300 leading-relaxed">
            Operating from Jaipur, Rajasthan since 1990 with two dedicated tailoring branches. Connect with our team for orders, consultations, and quotations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Information & Branches */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-heritage-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-heritage-900 pb-2 border-b">
              Atelier Coordinates
            </h3>

            <div className="space-y-3 text-heritage-700">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-heritage-900">Flagship Atelier & Workshop</p>
                  <p className="text-heritage-500">[FLAGSHIP STORE ADDRESS, JAIPUR, RAJASTHAN]</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-heritage-900">Branch 2: Studio & Showroom</p>
                  <p className="text-heritage-500">[STUDIO WORKSHOP ADDRESS, JAIPUR, RAJASTHAN]</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2 border-t">
                <Phone className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <div>
                  <p className="font-bold text-heritage-900">Phone</p>
                  <a href="tel:[BUSINESS PHONE]" className="hover:text-gold-dark">[BUSINESS PHONE]</a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-heritage-900">WhatsApp Atelier</p>
                  <p>[WHATSAPP NUMBER]</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <div>
                  <p className="font-bold text-heritage-900">Email</p>
                  <a href="mailto:[BUSINESS EMAIL]" className="hover:text-gold-dark">[BUSINESS EMAIL]</a>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2 border-t">
                <Clock className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <div>
                  <p className="font-bold text-heritage-900">Atelier Hours</p>
                  <p>Monday - Sunday: 10:30 AM — 9:00 PM</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center space-x-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>

              <AppointmentBookingModal defaultType="STORE_VISIT" buttonLabel="Schedule Atelier Visit" />
            </div>
          </div>
        </div>

        {/* General Enquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-heritage-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-heritage-900 pb-2 border-b">
            Send an Atelier Message
          </h3>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-heritage-900">Message Received</h4>
              <p className="text-xs text-heritage-600 max-w-sm mx-auto">
                Thank you for contacting B M Tailors. Our team in Jaipur will get back to you promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditya Verma"
                    className="w-full px-3 py-2 border rounded focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full px-3 py-2 border rounded focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border rounded focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Inquiry Details *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your requirements, wedding dates, or tailoring queries..."
                  className="w-full px-3 py-2 border rounded focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-heritage-900 hover:bg-heritage-800 text-gold font-bold rounded flex items-center justify-center space-x-2 transition"
              >
                <Send className="w-4 h-4 text-gold" />
                <span>{submitting ? 'Sending Message...' : 'Send Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
