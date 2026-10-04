'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function NewProductAdminPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [fabricDetails, setFabricDetails] = useState('');
  const [fitType, setFitType] = useState('Tailored Slim Fit');
  const [occasion, setOccasion] = useState('Festive & Formal');
  const [basePrice, setBasePrice] = useState('7999');
  const [compareAtPrice, setCompareAtPrice] = useState('9999');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
  );
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Variants state
  const [variants, setVariants] = useState([
    { sku: 'BMT-NEW-38', size: '38 (S)', color: 'Navy Blue', price: 7999, stockQuantity: 10 },
    { sku: 'BMT-NEW-40', size: '40 (M)', color: 'Navy Blue', price: 7999, stockQuantity: 15 },
    { sku: 'BMT-NEW-42', size: '42 (L)', color: 'Navy Blue', price: 7999, stockQuantity: 12 },
  ]);

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && data.data.categories) {
          setCategories(data.data.categories);
          if (data.data.categories.length > 0) {
            setCategoryId(data.data.categories[0].id);
          }
        }
      } catch {
        // Fallback
      }
    };
    fetchCats();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        sku: `BMT-NEW-${Date.now().toString().slice(-4)}`,
        size: '44 (XL)',
        color: 'Navy Blue',
        price: Number(basePrice) || 7999,
        stockQuantity: 10,
      },
    ]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        slug,
        categoryId,
        description,
        fabricDetails,
        fitType,
        occasion,
        basePrice: Number(basePrice),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        isBestSeller,
        isNewArrival,
        isActive: true,
        images: [{ url: imageUrl, altText: name }],
        variants,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/admin/dashboard'), 2000);
      } else {
        setError(data.error?.message || 'Failed to create product');
      }
    } catch {
      setError('Network error while saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <AdminHeader />

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/dashboard"
            className="p-2 bg-white rounded border border-heritage-200 text-heritage-700 hover:text-heritage-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-heritage-900">Add New Ready-made Garment</h1>
            <p className="text-xs text-heritage-500">Step-by-step product creation with variants and inventory.</p>
          </div>
        </div>

        {success ? (
          <div className="p-8 bg-white rounded-2xl border border-heritage-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="font-serif text-xl font-bold text-heritage-900">Garment Published Successfully!</h2>
            <p className="text-xs text-heritage-600">Redirecting to master admin dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Basic Product Info */}
            <div className="bg-white p-6 rounded-xl border border-heritage-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif font-bold text-sm text-heritage-900 pb-2 border-b">1. Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Royal Jodhpur Bandhgala Suit"
                    className="w-full px-3 py-2 border rounded focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 border rounded bg-heritage-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe master tailoring cuts, fabric composition, lining details, and styling advice..."
                  className="w-full px-3 py-2 border rounded focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Fabric Composition</label>
                  <input
                    type="text"
                    value={fabricDetails}
                    onChange={(e) => setFabricDetails(e.target.value)}
                    placeholder="e.g. Italian Wool (320 GSM)"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Fit Type</label>
                  <input
                    type="text"
                    value={fitType}
                    onChange={(e) => setFitType(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Occasion</label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* 2. Image URL */}
            <div className="bg-white p-6 rounded-xl border border-heritage-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif font-bold text-sm text-heritage-900 pb-2 border-b">2. Image URL</h3>
              <div>
                <label className="block font-semibold mb-1">Primary Product Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Pricing */}
            <div className="bg-white p-6 rounded-xl border border-heritage-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif font-bold text-sm text-heritage-900 pb-2 border-b">3. Base Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">MRP / Compare At Price (₹)</label>
                  <input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* 4. Variants & Stock */}
            <div className="bg-white p-6 rounded-xl border border-heritage-200 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-serif font-bold text-sm text-heritage-900">4. Variants & Initial Stock</h3>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-3 py-1 bg-heritage-900 text-gold font-bold rounded flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variant</span>
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-3 p-3 bg-heritage-50 rounded border">
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[10px] text-heritage-500 mb-0.5">SKU</label>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].sku = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-[10px] text-heritage-500 mb-0.5">Size</label>
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].size = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div className="w-28">
                      <label className="block text-[10px] text-heritage-500 mb-0.5">Color</label>
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].color = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-[10px] text-heritage-500 mb-0.5">Stock Qty</label>
                      <input
                        type="number"
                        value={v.stockQuantity}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].stockQuantity = Number(e.target.value);
                          setVariants(updated);
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="p-1.5 text-heritage-400 hover:text-rose-600 self-end mb-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !slug || !description}
              className="w-full py-3.5 bg-heritage-900 hover:bg-heritage-800 text-gold font-bold text-xs rounded transition flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Publishing Garment...' : 'Publish New Garment'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
