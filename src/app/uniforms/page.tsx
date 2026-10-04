'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import {
  Building2,
  GraduationCap,
  HeartPulse,
  Hotel,
  UtensilsCrossed,
  Shield,
  Briefcase,
  Factory,
  Landmark,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
} from 'lucide-react';

export default function UniformsPage() {
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [sector, setSector] = useState('Schools & Colleges');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [uniformType, setUniformType] = useState('Staff Shirts & Trousers');
  const [fabricPreference, setFabricPreference] = useState('');
  const [color, setColor] = useState('');
  const [designRequirements, setDesignRequirements] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectors = [
    { title: t.uniforms.schools, icon: GraduationCap, desc: 'Student blazers, shirts, skirts, trousers, and sports kits.' },
    { title: t.uniforms.hospitals, icon: HeartPulse, desc: 'Doctor coats, scrub suits, nursing uniforms, and lab wear.' },
    { title: t.uniforms.hotels, icon: Hotel, desc: 'Front desk suits, housekeeping tunics, bellhop coats, and aprons.' },
    { title: t.uniforms.restaurants, icon: UtensilsCrossed, desc: 'Executive chef coats, steward waistcoats, server aprons.' },
    { title: t.uniforms.security, icon: Shield, desc: 'Durable security guard uniforms, safari suits, epaulet shirts.' },
    { title: t.uniforms.corporate, icon: Briefcase, desc: 'Executive blazers, branded formal shirts, trousers, and ties.' },
    { title: t.uniforms.factories, icon: Factory, desc: 'Industrial boiler suits, heavy-duty coveralls, safety workwear.' },
    { title: t.uniforms.government, icon: Landmark, desc: 'Departmental uniforms, institutional ceremonial wear.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    trackEvent('uniform_enquiry', { organization, sector, quantity, uniformType });

    try {
      const res = await fetch('/api/uniform-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          organization,
          sector,
          phone,
          email,
          quantity: Number(quantity),
          uniformType,
          fabricPreference: fabricPreference || undefined,
          color: color || undefined,
          designRequirements: designRequirements || undefined,
          additionalRequirements: additionalRequirements || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error?.message || 'Failed to submit enquiry');
      }
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 py-10">
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-heritage-900 text-white rounded-2xl p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">
              Institutional Manufacturing Division
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              {t.uniforms.title}
            </h1>
            <p className="text-sm sm:text-base text-heritage-300 leading-relaxed">
              {t.uniforms.sub}. Backed by decades of industrial manufacturing capacity, premium durable fabrics, and precision pattern cutting in Jaipur.
            </p>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-gold-dark uppercase">Industries Outfitted</span>
          <h2 className="font-serif text-3xl font-bold text-heritage-900">
            {t.uniforms.sectorsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="p-6 bg-white rounded-xl border border-heritage-200 hover:border-gold transition space-y-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-heritage-100 text-heritage-900 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold-dark" />
                </div>
                <h3 className="font-serif font-bold text-base text-heritage-900">{s.title}</h3>
                <p className="text-xs text-heritage-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bulk Quotation Request Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-heritage-200 shadow-sm space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-900">
              {t.uniforms.formTitle}
            </h2>
            <p className="text-xs text-heritage-500">
              Submit your bulk requirements. Our institutional accounts officer will prepare a custom quotation.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 max-w-md mx-auto">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-heritage-900">
                Quotation Request Received!
              </h3>
              <p className="text-xs text-heritage-600 leading-relaxed">
                {t.uniforms.quoteSuccess}
              </p>
              <div className="bg-heritage-50 p-4 rounded text-xs text-heritage-700 text-left border border-heritage-200 space-y-1">
                <p><strong>Organization:</strong> {organization}</p>
                <p><strong>Estimated Quantity:</strong> {quantity} pieces</p>
                <p><strong>Uniform Type:</strong> {uniformType}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-heritage-800 mb-1">{t.uniforms.orgName} *</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. St. Xavier's Academy / Royal Orchid Hotels"
                    className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-heritage-800 mb-1">{t.uniforms.contactPerson} *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-heritage-800 mb-1">{t.uniforms.sector} *</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none bg-heritage-50"
                  >
                    {sectors.map((s) => (
                      <option key={s.title} value={s.title}>{s.title}</option>
                    ))}
                    <option value="Government / Other">Government / Other Institutional</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-heritage-800 mb-1">{t.uniforms.quantity} *</label>
                  <input
                    type="number"
                    min={5}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-heritage-800 mb-1">{t.uniforms.phone} *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-heritage-800 mb-1">{t.uniforms.email} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="corporate@organization.com"
                    className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-heritage-800 mb-1">{t.uniforms.uniformType} *</label>
                  <input
                    type="text"
                    required
                    value={uniformType}
                    onChange={(e) => setUniformType(e.target.value)}
                    placeholder="e.g. Staff Blazers, Shirts, Lab Coats"
                    className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-heritage-800 mb-1">{t.uniforms.fabricPref}</label>
                  <input
                    type="text"
                    value={fabricPreference}
                    onChange={(e) => setFabricPreference(e.target.value)}
                    placeholder="e.g. Poly-Viscose, Cotton Drill, Twill"
                    className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-heritage-800 mb-1">{t.uniforms.requirements}</label>
                <textarea
                  rows={3}
                  value={designRequirements}
                  onChange={(e) => setDesignRequirements(e.target.value)}
                  placeholder="Describe logo embroidery requirements, color codes, pattern specifications, and delivery timelines..."
                  className="w-full px-3 py-2 border border-heritage-300 rounded focus:border-gold focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-heritage-900 hover:bg-heritage-800 text-gold font-bold text-xs rounded transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4 text-gold" />
                  <span>{submitting ? 'Submitting Quotation Request...' : t.uniforms.submitQuote}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
