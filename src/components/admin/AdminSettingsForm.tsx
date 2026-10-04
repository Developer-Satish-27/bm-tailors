'use client';

import React, { useState } from 'react';
import { Save, Check, FileCheck2, Building, ShieldCheck, MapPin } from 'lucide-react';

export function AdminSettingsForm({ initialSettings }: { initialSettings: any[] }) {
  const getSettingVal = (key: string, defaultVal: any) => {
    const found = initialSettings.find((s) => s.key === key);
    if (!found) return defaultVal;
    try {
      return JSON.parse(found.valueJson);
    } catch {
      return defaultVal;
    }
  };

  // GST Configuration (Future-Ready Architecture per prompt #40)
  const [gstConfig, setGstConfig] = useState(
    getSettingVal('gst_config', {
      isGstActive: false,
      gstin: '[GSTIN NOT CONFIGURED YET]',
      cgstPercent: 6,
      sgstPercent: 6,
      igstPercent: 12,
      defaultHsn: '6203',
      invoicePrefix: 'BMT/2026/',
    })
  );

  // Shipping & COD Rules (Prompt #26, #28)
  const [shippingRules, setShippingRules] = useState(
    getSettingVal('shipping_rules', {
      standardShippingFee: 99,
      freeShippingThreshold: 2999,
      codAvailable: true,
      codFee: 120,
      estimatedDeliveryDays: '2 - 4 Business Days in Jaipur',
    })
  );

  // Business Contact Placeholders (Prompt #58/59)
  const [businessInfo, setBusinessInfo] = useState(
    getSettingVal('business_info', {
      brandName: 'B M Tailors',
      tagline: 'Crafting Confidence Since 1990',
      phone: '[BUSINESS PHONE]',
      whatsapp: '[WHATSAPP NUMBER]',
      email: '[BUSINESS EMAIL]',
    })
  );

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSave = async (key: string, value: any) => {
    setSavingKey(key);
    setSaveSuccess(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(`Settings for "${key}" saved successfully!`);
        setTimeout(() => setSaveSuccess(null), 3000);
      }
    } catch {
      alert('Error updating setting');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-8 text-xs">
      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center space-x-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* 1. Future GST Invoicing Architecture */}
      <div className="p-5 bg-heritage-50 rounded-xl border border-heritage-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-heritage-900 font-bold text-sm">
            <FileCheck2 className="w-4 h-4 text-gold-dark" />
            <span>Future-Ready GST Invoicing Settings</span>
          </div>
          <label className="flex items-center space-x-2 cursor-pointer font-bold">
            <span>Activate GST Invoicing:</span>
            <input
              type="checkbox"
              checked={gstConfig.isGstActive}
              onChange={(e) => setGstConfig({ ...gstConfig, isGstActive: e.target.checked })}
              className="rounded text-heritage-900 focus:ring-gold"
            />
          </label>
        </div>

        <p className="text-[11px] text-heritage-600 leading-relaxed">
          As per requirement, there is currently NO GST number. Do not invent one. When the business owner registers their GSTIN, activate this toggle and configure tax percentages.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold mb-1">Business GSTIN</label>
            <input
              type="text"
              value={gstConfig.gstin}
              onChange={(e) => setGstConfig({ ...gstConfig, gstin: e.target.value })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Default Garment HSN Code</label>
            <input
              type="text"
              value={gstConfig.defaultHsn}
              onChange={(e) => setGstConfig({ ...gstConfig, defaultHsn: e.target.value })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Invoice Number Prefix</label>
            <input
              type="text"
              value={gstConfig.invoicePrefix}
              onChange={(e) => setGstConfig({ ...gstConfig, invoicePrefix: e.target.value })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold mb-1">CGST (%)</label>
            <input
              type="number"
              value={gstConfig.cgstPercent}
              onChange={(e) => setGstConfig({ ...gstConfig, cgstPercent: Number(e.target.value) })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">SGST (%)</label>
            <input
              type="number"
              value={gstConfig.sgstPercent}
              onChange={(e) => setGstConfig({ ...gstConfig, sgstPercent: Number(e.target.value) })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">IGST (Inter-state %)</label>
            <input
              type="number"
              value={gstConfig.igstPercent}
              onChange={(e) => setGstConfig({ ...gstConfig, igstPercent: Number(e.target.value) })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={savingKey === 'gst_config'}
          onClick={() => handleSave('gst_config', gstConfig)}
          className="px-4 py-2 bg-heritage-900 text-gold font-bold rounded hover:bg-heritage-800 transition flex items-center space-x-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save GST Tax Architecture</span>
        </button>
      </div>

      {/* 2. Jaipur Shipping & COD Rules */}
      <div className="p-5 bg-heritage-50 rounded-xl border border-heritage-200 space-y-4">
        <div className="flex items-center space-x-2 text-heritage-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-gold-dark" />
          <span>Commerce Shipping & Cash on Delivery (COD) Rules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-semibold mb-1">Urban Jaipur Delivery Fee (₹)</label>
            <input
              type="number"
              value={shippingRules.standardShippingFee}
              onChange={(e) => setShippingRules({ ...shippingRules, standardShippingFee: Number(e.target.value) })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Free Delivery Threshold (₹)</label>
            <input
              type="number"
              value={shippingRules.freeShippingThreshold}
              onChange={(e) => setShippingRules({ ...shippingRules, freeShippingThreshold: Number(e.target.value) })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">COD Handling Fee (₹)</label>
            <input
              type="number"
              value={shippingRules.codFee}
              onChange={(e) => setShippingRules({ ...shippingRules, codFee: Number(e.target.value) })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Estimated Days</label>
            <input
              type="text"
              value={shippingRules.estimatedDeliveryDays}
              onChange={(e) => setShippingRules({ ...shippingRules, estimatedDeliveryDays: e.target.value })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={savingKey === 'shipping_rules'}
          onClick={() => handleSave('shipping_rules', shippingRules)}
          className="px-4 py-2 bg-heritage-900 text-gold font-bold rounded hover:bg-heritage-800 transition flex items-center space-x-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Shipping & COD Rules</span>
        </button>
      </div>

      {/* 3. Verified Contact Placeholders */}
      <div className="p-5 bg-heritage-50 rounded-xl border border-heritage-200 space-y-4">
        <div className="flex items-center space-x-2 text-heritage-900 font-bold text-sm">
          <Building className="w-4 h-4 text-gold-dark" />
          <span>Atelier Contact Placeholders (No Fake Information)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold mb-1">Business Phone Placeholder</label>
            <input
              type="text"
              value={businessInfo.phone}
              onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">WhatsApp Number Placeholder</label>
            <input
              type="text"
              value={businessInfo.whatsapp}
              onChange={(e) => setBusinessInfo({ ...businessInfo, whatsapp: e.target.value })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Business Email Placeholder</label>
            <input
              type="text"
              value={businessInfo.email}
              onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
              className="w-full px-3 py-1.5 border rounded bg-white"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={savingKey === 'business_info'}
          onClick={() => handleSave('business_info', businessInfo)}
          className="px-4 py-2 bg-heritage-900 text-gold font-bold rounded hover:bg-heritage-800 transition flex items-center space-x-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Update Business Contact Details</span>
        </button>
      </div>

      {/* 4. Jaipur Atelier Branches (Requirement 39) */}
      <div className="p-5 bg-heritage-50 rounded-xl border border-heritage-200 space-y-3">
        <div className="flex items-center space-x-2 text-heritage-900 font-bold text-sm">
          <MapPin className="w-4 h-4 text-gold-dark" />
          <span>Jaipur Atelier Branches (Hidden by Default per Rule #39)</span>
        </div>
        <p className="text-[11px] text-heritage-600">
          The business has two Jaipur branches. Branch details remain hidden from public pages at this stage until real addresses are configured and enabled.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded border space-y-1">
            <p className="font-bold text-heritage-900">Branch 1: Flagship Atelier</p>
            <p className="text-[11px] text-heritage-600">[FLAGSHIP STORE ADDRESS, JAIPUR, RAJASTHAN]</p>
            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold inline-block">
              Status: Hidden on Public Site (Configured in Database)
            </span>
          </div>

          <div className="p-3 bg-white rounded border space-y-1">
            <p className="font-bold text-heritage-900">Branch 2: Studio & Workshop</p>
            <p className="text-[11px] text-heritage-600">[STUDIO WORKSHOP ADDRESS, JAIPUR, RAJASTHAN]</p>
            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold inline-block">
              Status: Hidden on Public Site (Configured in Database)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
