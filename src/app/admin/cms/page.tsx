'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Save,
  Check,
  RefreshCw,
  Building,
  Sparkles,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<'HERITAGE' | 'HOMEPAGE' | 'BRANCHES' | 'POLICIES'>('HERITAGE');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Brand Heritage State
  const [heritageData, setHeritageData] = useState({
    heading: 'Crafting Confidence Since 1990',
    subheading: 'Decades of Jaipur Tailoring Heritage & Modern Bespoke Artistry',
    introText:
      'For more than three decades, B M Tailors has stood as a hallmark of bespoke men’s tailoring and refined sartorial elegance in Jaipur, Rajasthan. What began in 1990 as a passion for personalized fitting has grown into an esteemed tailoring house trusted across generations.',
    pillars: [
      { title: 'Jaipur Heritage', desc: 'Rooted in the timeless royal sartorial culture of the Pink City.' },
      { title: 'Master Craftsmanship', desc: 'Decades of hands-on cutting, drafting, and finishing expertise.' },
      { title: 'Modern Precision', desc: 'Contemporary cuts and global styling tailored to your distinct identity.' },
    ],
    seoTitle: 'Brand Story | B M Tailors Jaipur Since 1990',
    seoDesc: 'Discover the heritage, craftsmanship, and bespoke tailoring tradition of B M Tailors in Jaipur.',
  });

  // Homepage Hero State
  const [heroData, setHeroData] = useState({
    headline: 'Tailored for Your Identity',
    subheadline: 'Since 1990 — Premium Men’s Wear & Custom Tailoring in Jaipur',
    primaryCtaText: 'Shop Collection',
    secondaryCtaText: 'Book Appointment',
    announcementText: 'Complimentary shipping across Jaipur on all bespoke & ready-made orders above ₹2,999.',
  });

  // Branches & Contact Placeholders
  const [branchesData, setBranchesData] = useState({
    businessPhone: '[BUSINESS PHONE]',
    whatsappNumber: '[WHATSAPP NUMBER]',
    businessEmail: '[BUSINESS EMAIL]',
    branch1: {
      name: 'B M Tailors Atelier (Main Branch)',
      address: '[BRANCH 1 ADDRESS, JAIPUR, RAJASTHAN]',
      timings: '10:30 AM – 8:30 PM (All 7 Days)',
    },
    branch2: {
      name: 'B M Tailors Express & Studio (Branch 2)',
      address: '[BRANCH 2 ADDRESS, JAIPUR, RAJASTHAN]',
      timings: '11:00 AM – 8:00 PM (Monday – Saturday)',
    },
  });

  // Policies State
  const [policiesData, setPoliciesData] = useState({
    exchangePolicy:
      'Ready-made purchases are eligible for exchange within 7 days in unworn condition with original tags. IMPORTANT: Cash on Delivery (COD) orders and Custom Made-to-Measure garments are strictly non-exchangeable.',
    codPolicy:
      'Cash on Delivery is available across eligible Jaipur pincodes with a nominal ₹120 convenience fee. To prevent fraudulent returns, COD orders are non-exchangeable.',
    customFittingPolicy:
      'Every bespoke custom garment includes complimentary atelier fitting trials at our Jaipur branches until the silhouette matches your exact specifications.',
    shippingTimeline:
      'Urban Jaipur orders are dispatched within 24-48 hours and delivered within 2-4 business days.',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/cms');
      const data = await res.json();
      if (data.success && data.data) {
        const { pages, settings } = data.data;

        if (pages['brand-heritage']?.content) {
          setHeritageData((prev) => ({
            ...prev,
            ...pages['brand-heritage'].content,
            seoTitle: pages['brand-heritage'].seoTitle || prev.seoTitle,
            seoDesc: pages['brand-heritage'].seoDesc || prev.seoDesc,
          }));
        }

        if (pages['homepage-hero']?.content) {
          setHeroData((prev) => ({ ...prev, ...pages['homepage-hero'].content }));
        }

        if (settings['business_info']) {
          setBranchesData((prev) => ({
            ...prev,
            businessPhone: settings['business_info'].phone || prev.businessPhone,
            whatsappNumber: settings['business_info'].whatsapp || prev.whatsappNumber,
            businessEmail: settings['business_info'].email || prev.businessEmail,
          }));
        }

        if (pages['policies']?.content) {
          setPoliciesData((prev) => ({ ...prev, ...pages['policies'].content }));
        }
      }
    } catch (err) {
      console.error('Error fetching CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveHeritage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'brand-heritage',
          title: 'Crafting Confidence Since 1990 — The B M Tailors Story',
          content: heritageData,
          seoTitle: heritageData.seoTitle,
          seoDesc: heritageData.seoDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Brand Heritage content updated successfully!');
      }
    } catch {
      alert('Error updating Brand Heritage');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'homepage-hero',
          title: 'Homepage Hero & Announcement CMS',
          content: heroData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Homepage configuration updated successfully!');
      }
    } catch {
      alert('Error updating Homepage CMS');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBranches = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save to storeSettings business_info
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'business_info',
          value: {
            brandName: 'B M Tailors',
            tagline: 'Crafting Confidence Since 1990',
            phone: branchesData.businessPhone,
            whatsapp: branchesData.whatsappNumber,
            email: branchesData.businessEmail,
            branch1: branchesData.branch1,
            branch2: branchesData.branch2,
          },
        }),
      });
      triggerToast('Branch locations & placeholders saved successfully!');
    } catch {
      alert('Error updating Branch details');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'policies',
          title: 'Policies & Customer Protection',
          content: policiesData,
          seoTitle: 'Store Policies & Exchange Terms | B M Tailors',
          seoDesc: 'Read our transparent policies on 7-day exchanges, COD restrictions, custom tailoring consultations, and shipping.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Store policies updated successfully!');
      }
    } catch {
      alert('Error updating Policies');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminHeader />

        {/* Toast */}
        {notification && (
          <div className="fixed top-5 right-5 z-50 bg-heritage-900 text-gold px-4 py-3 rounded-xl shadow-2xl border border-gold/40 flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">{notification}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-gold-dark" />
              <h1 className="font-serif text-2xl font-bold text-heritage-900">
                Content Management System (CMS) & Placeholders
              </h1>
            </div>
            <p className="text-xs text-heritage-500 mt-1">
              Configure brand heritage stories, homepage banners, branch placeholders, and customer policies without hardcoded text.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchData}
              className="p-2.5 border border-heritage-200 rounded-lg hover:bg-heritage-50 text-heritage-600 transition flex items-center space-x-1.5 text-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Reload CMS</span>
            </button>
            <Link
              href="/about"
              target="_blank"
              className="px-3 py-2 bg-heritage-100 hover:bg-heritage-200 text-heritage-800 rounded-lg text-xs font-medium flex items-center space-x-1.5"
            >
              <span>Live Brand Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('HERITAGE')}
            className={`px-4 py-2.5 rounded-xl font-medium transition ${
              activeTab === 'HERITAGE'
                ? 'bg-heritage-900 text-white shadow-sm'
                : 'bg-white border border-heritage-200 text-heritage-700 hover:bg-heritage-100'
            }`}
          >
            Brand Story & Heritage (Since 1990)
          </button>
          <button
            onClick={() => setActiveTab('HOMEPAGE')}
            className={`px-4 py-2.5 rounded-xl font-medium transition ${
              activeTab === 'HOMEPAGE'
                ? 'bg-heritage-900 text-white shadow-sm'
                : 'bg-white border border-heritage-200 text-heritage-700 hover:bg-heritage-100'
            }`}
          >
            Hero Banner & Messaging
          </button>
          <button
            onClick={() => setActiveTab('BRANCHES')}
            className={`px-4 py-2.5 rounded-xl font-medium transition ${
              activeTab === 'BRANCHES'
                ? 'bg-heritage-900 text-white shadow-sm'
                : 'bg-white border border-heritage-200 text-heritage-700 hover:bg-heritage-100'
            }`}
          >
            Jaipur Branches & Contact Placeholders
          </button>
          <button
            onClick={() => setActiveTab('POLICIES')}
            className={`px-4 py-2.5 rounded-xl font-medium transition ${
              activeTab === 'POLICIES'
                ? 'bg-heritage-900 text-white shadow-sm'
                : 'bg-white border border-heritage-200 text-heritage-700 hover:bg-heritage-100'
            }`}
          >
            7-Day Exchange & Policies
          </button>
        </div>

        {/* Tab 1: Brand Heritage & Story */}
        {activeTab === 'HERITAGE' && (
          <form
            onSubmit={handleSaveHeritage}
            className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm space-y-6 text-xs"
          >
            <div className="pb-3 border-b border-heritage-100 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-heritage-900">
                  Brand Heritage & Established Narrative
                </h2>
                <p className="text-heritage-500 text-xs">
                  Authentic B M Tailors story since 1990 — strictly avoids fake claims or artificial statistics.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-gold hover:bg-gold-light text-heritage-900 font-bold rounded-lg flex items-center space-x-1.5 transition shadow"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Heritage Story'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Heritage Headline
                </label>
                <input
                  type="text"
                  value={heritageData.heading}
                  onChange={(e) => setHeritageData({ ...heritageData, heading: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Supporting Subheadline
                </label>
                <input
                  type="text"
                  value={heritageData.subheading}
                  onChange={(e) => setHeritageData({ ...heritageData, subheading: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-heritage-800 mb-1">
                Full Brand Narrative / About Us Paragraph
              </label>
              <textarea
                rows={5}
                value={heritageData.introText}
                onChange={(e) => setHeritageData({ ...heritageData, introText: e.target.value })}
                className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold leading-relaxed"
              />
            </div>

            {/* 3 Heritage Pillars */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-heritage-900 text-sm">
                Three Core Brand Pillars (Editable)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {heritageData.pillars.map((pillar, idx) => (
                  <div key={idx} className="p-4 bg-heritage-50 rounded-xl border border-heritage-200 space-y-2">
                    <label className="block font-semibold text-heritage-800">
                      Pillar {idx + 1} Title
                    </label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const newPillars = [...heritageData.pillars];
                        newPillars[idx].title = e.target.value;
                        setHeritageData({ ...heritageData, pillars: newPillars });
                      }}
                      className="w-full px-3 py-1.5 border border-heritage-300 rounded-lg text-xs"
                    />
                    <label className="block font-semibold text-heritage-800">
                      Pillar {idx + 1} Description
                    </label>
                    <textarea
                      rows={2}
                      value={pillar.desc}
                      onChange={(e) => {
                        const newPillars = [...heritageData.pillars];
                        newPillars[idx].desc = e.target.value;
                        setHeritageData({ ...heritageData, pillars: newPillars });
                      }}
                      className="w-full px-3 py-1.5 border border-heritage-300 rounded-lg text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-heritage-100">
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Meta Title (SEO)
                </label>
                <input
                  type="text"
                  value={heritageData.seoTitle}
                  onChange={(e) => setHeritageData({ ...heritageData, seoTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Meta Description (SEO)
                </label>
                <input
                  type="text"
                  value={heritageData.seoDesc}
                  onChange={(e) => setHeritageData({ ...heritageData, seoDesc: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg"
                />
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Homepage Hero & Banner */}
        {activeTab === 'HOMEPAGE' && (
          <form
            onSubmit={handleSaveHomepage}
            className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm space-y-6 text-xs"
          >
            <div className="pb-3 border-b border-heritage-100 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-heritage-900">
                  Homepage Hero Banners & CTAs
                </h2>
                <p className="text-heritage-500 text-xs">
                  Controls the first impression on public visit.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-gold hover:bg-gold-light text-heritage-900 font-bold rounded-lg flex items-center space-x-1.5 transition shadow"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Homepage Copy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={heroData.headline}
                  onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Hero Subheadline
                </label>
                <input
                  type="text"
                  value={heroData.subheadline}
                  onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={heroData.primaryCtaText}
                  onChange={(e) => setHeroData({ ...heroData, primaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={heroData.secondaryCtaText}
                  onChange={(e) => setHeroData({ ...heroData, secondaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-heritage-800 mb-1">
                Top Announcement Banner Bar
              </label>
              <input
                type="text"
                value={heroData.announcementText}
                onChange={(e) => setHeroData({ ...heroData, announcementText: e.target.value })}
                className="w-full px-3 py-2 border border-heritage-300 rounded-lg"
              />
            </div>
          </form>
        )}

        {/* Tab 3: Jaipur Branches & Contact Placeholders */}
        {activeTab === 'BRANCHES' && (
          <form
            onSubmit={handleSaveBranches}
            className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm space-y-6 text-xs"
          >
            <div className="pb-3 border-b border-heritage-100 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-heritage-900">
                  Jaipur Branches & Official Placeholders
                </h2>
                <p className="text-heritage-500 text-xs">
                  Centralized business coordinates. When real phone/address becomes available, update them here.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-gold hover:bg-gold-light text-heritage-900 font-bold rounded-lg flex items-center space-x-1.5 transition shadow"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Contact Details'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Official Phone Placeholder
                </label>
                <input
                  type="text"
                  value={branchesData.businessPhone}
                  onChange={(e) => setBranchesData({ ...branchesData, businessPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  WhatsApp Support Number
                </label>
                <input
                  type="text"
                  value={branchesData.whatsappNumber}
                  onChange={(e) => setBranchesData({ ...branchesData, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Business Email Placeholder
                </label>
                <input
                  type="text"
                  value={branchesData.businessEmail}
                  onChange={(e) => setBranchesData({ ...branchesData, businessEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Branch 1 */}
              <div className="p-4 bg-heritage-50 rounded-xl border border-heritage-200 space-y-3">
                <div className="flex items-center space-x-2 text-heritage-900 font-bold">
                  <MapPin className="w-4 h-4 text-gold-dark" />
                  <span>Branch 1 (Flagship Atelier)</span>
                </div>
                <div>
                  <label className="block text-heritage-700 font-medium mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={branchesData.branch1.name}
                    onChange={(e) =>
                      setBranchesData({
                        ...branchesData,
                        branch1: { ...branchesData.branch1, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-heritage-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-heritage-700 font-medium mb-1">Address Placeholder</label>
                  <input
                    type="text"
                    value={branchesData.branch1.address}
                    onChange={(e) =>
                      setBranchesData({
                        ...branchesData,
                        branch1: { ...branchesData.branch1, address: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-heritage-300 rounded-lg font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-heritage-700 font-medium mb-1">Store Timings</label>
                  <input
                    type="text"
                    value={branchesData.branch1.timings}
                    onChange={(e) =>
                      setBranchesData({
                        ...branchesData,
                        branch1: { ...branchesData.branch1, timings: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-heritage-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Branch 2 */}
              <div className="p-4 bg-heritage-50 rounded-xl border border-heritage-200 space-y-3">
                <div className="flex items-center space-x-2 text-heritage-900 font-bold">
                  <MapPin className="w-4 h-4 text-gold-dark" />
                  <span>Branch 2 (Express & Studio)</span>
                </div>
                <div>
                  <label className="block text-heritage-700 font-medium mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={branchesData.branch2.name}
                    onChange={(e) =>
                      setBranchesData({
                        ...branchesData,
                        branch2: { ...branchesData.branch2, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-heritage-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-heritage-700 font-medium mb-1">Address Placeholder</label>
                  <input
                    type="text"
                    value={branchesData.branch2.address}
                    onChange={(e) =>
                      setBranchesData({
                        ...branchesData,
                        branch2: { ...branchesData.branch2, address: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-heritage-300 rounded-lg font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-heritage-700 font-medium mb-1">Store Timings</label>
                  <input
                    type="text"
                    value={branchesData.branch2.timings}
                    onChange={(e) =>
                      setBranchesData({
                        ...branchesData,
                        branch2: { ...branchesData.branch2, timings: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-heritage-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Tab 4: Policies & Protection */}
        {activeTab === 'POLICIES' && (
          <form
            onSubmit={handleSavePolicies}
            className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm space-y-6 text-xs"
          >
            <div className="pb-3 border-b border-heritage-100 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-heritage-900">
                  Customer Policies & Exchange Guidelines
                </h2>
                <p className="text-heritage-500 text-xs">
                  Defines terms displayed during checkout, on order invoices, and policy pages.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-gold hover:bg-gold-light text-heritage-900 font-bold rounded-lg flex items-center space-x-1.5 transition shadow"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Policies'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Ready-Made 7-Day Exchange Policy
                </label>
                <textarea
                  rows={3}
                  value={policiesData.exchangePolicy}
                  onChange={(e) => setPoliciesData({ ...policiesData, exchangePolicy: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-rose-800 mb-1">
                  Cash on Delivery (COD) Non-Exchangeable Clause
                </label>
                <textarea
                  rows={3}
                  value={policiesData.codPolicy}
                  onChange={(e) => setPoliciesData({ ...policiesData, codPolicy: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg bg-rose-50/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Bespoke Made-to-Measure Guarantee
                </label>
                <textarea
                  rows={3}
                  value={policiesData.customFittingPolicy}
                  onChange={(e) => setPoliciesData({ ...policiesData, customFittingPolicy: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-heritage-800 mb-1">
                  Shipping Timeline Notice
                </label>
                <input
                  type="text"
                  value={policiesData.shippingTimeline}
                  onChange={(e) => setPoliciesData({ ...policiesData, shippingTimeline: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-300 rounded-lg"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
