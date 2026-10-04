'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Edit2,
  Trash2,
  Eye,
  Star,
  Sparkles,
  Layers,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number | null;
  fabricDetails?: string;
  fitType?: string;
  occasion?: string;
  isActive: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  category: { id: string; name: string };
  media: { id: string; url: string; altText?: string }[];
  variants: {
    id: string;
    sku: string;
    size: string;
    color: string;
    stockQuantity: number;
    price: number;
  }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && data.data?.products) {
        setProducts(data.data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggle = async (productId: string, field: 'isActive' | 'isBestSeller' | 'isFeatured', currentVal: boolean) => {
    const newVal = !currentVal;
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, [field]: newVal } : p))
    );

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newVal }),
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification(`Updated ${field.replace('is', '')} status successfully`);
      } else {
        fetchProducts(); // rollback
      }
    } catch {
      fetchProducts(); // rollback
    }
  };

  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to archive or remove "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification(`Product "${name}" processed.`);
        fetchProducts();
      }
    } catch {
      alert('Error updating product status');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingProduct.name,
          basePrice: Number(editingProduct.basePrice),
          compareAtPrice: editingProduct.compareAtPrice ? Number(editingProduct.compareAtPrice) : null,
          fabricDetails: editingProduct.fabricDetails,
          fitType: editingProduct.fitType,
          occasion: editingProduct.occasion,
          shortDescription: editingProduct.shortDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification('Product details saved successfully');
        setEditingProduct(null);
        fetchProducts();
      }
    } catch {
      alert('Failed to save changes');
    } finally {
      setSavingEdit(false);
    }
  };

  // Derive categories
  const categories = Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean)));

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.fabricDetails && p.fabricDetails.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || p.category?.name === selectedCategory;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && p.isActive) ||
      (statusFilter === 'ARCHIVED' && !p.isActive) ||
      (statusFilter === 'BESTSELLER' && p.isBestSeller) ||
      (statusFilter === 'FEATURED' && p.isFeatured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-heritage-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminHeader />

        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-5 right-5 z-50 bg-heritage-900 text-gold px-4 py-3 rounded-xl shadow-2xl border border-gold/40 flex items-center space-x-2 animate-bounce">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">{notification}</span>
          </div>
        )}

        {/* Header Actions */}
        <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Package className="w-6 h-6 text-gold-dark" />
              <h1 className="font-serif text-2xl font-bold text-heritage-900">
                Product Catalogue Management
              </h1>
            </div>
            <p className="text-xs text-heritage-500 mt-1">
              Live catalogue of ready-made garments, fabric specifications, pricing, and variants.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchProducts}
              className="p-2 border border-heritage-200 rounded-lg hover:bg-heritage-50 text-heritage-600 transition"
              title="Refresh catalogue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/admin/products/new"
              className="px-4 py-2.5 bg-gold hover:bg-gold-light text-heritage-900 font-bold rounded-lg flex items-center space-x-2 transition shadow text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Garment</span>
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl border border-heritage-200 shadow-sm flex flex-col sm:flex-row gap-3 text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-heritage-400" />
            <input
              type="text"
              placeholder="Search by product name, slug, or fabric..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-heritage-50/70 border border-heritage-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 bg-heritage-50/70 border border-heritage-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-heritage-50/70 border border-heritage-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="ALL">All Garments</option>
              <option value="ACTIVE">Active in Store</option>
              <option value="ARCHIVED">Archived / Hidden</option>
              <option value="BESTSELLER">Best Sellers Only</option>
              <option value="FEATURED">Featured Only</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-heritage-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-heritage-700">
              <thead className="bg-heritage-100/60 text-heritage-900 uppercase font-bold tracking-wider text-[11px] border-b border-heritage-200">
                <tr>
                  <th className="p-4">Garment</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Variants & Stock</th>
                  <th className="p-4 text-center">Best Seller</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-center">Store Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-100">
                {loading && products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-heritage-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gold-dark" />
                      Loading catalogue items...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-heritage-500">
                      No garments found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const totalStock = p.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0;
                    const primaryImage = p.media?.[0]?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80';

                    return (
                      <tr key={p.id} className="hover:bg-heritage-50/60 transition group">
                        {/* Garment Details */}
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-14 relative rounded-lg overflow-hidden bg-heritage-100 border border-heritage-200 shrink-0">
                              <Image
                                src={primaryImage}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-heritage-900 group-hover:text-gold-dark transition truncate">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-heritage-500 truncate">
                                Slug: /{p.slug}
                              </p>
                              {p.fabricDetails && (
                                <p className="text-[10px] text-heritage-400 truncate">
                                  Fabric: {p.fabricDetails}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-heritage-100 text-heritage-800 rounded-full text-[11px] font-medium border border-heritage-200">
                            {p.category?.name || 'General'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-serif font-bold text-heritage-900 text-sm">
                            ₹{p.basePrice.toLocaleString('en-IN')}
                          </div>
                          {p.compareAtPrice && (
                            <div className="text-[10px] text-heritage-400 line-through">
                              ₹{p.compareAtPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        {/* Variants & Stock */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-medium text-heritage-900">
                            {p.variants?.length || 0} variant{p.variants?.length === 1 ? '' : 's'}
                          </div>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                totalStock === 0
                                  ? 'bg-rose-500'
                                  : totalStock < 5
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            <span
                              className={`text-[11px] font-semibold ${
                                totalStock === 0
                                  ? 'text-rose-600'
                                  : totalStock < 5
                                  ? 'text-amber-600'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {totalStock} in stock
                            </span>
                          </div>
                        </td>

                        {/* Best Seller Toggle */}
                        <td className="p-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggle(p.id, 'isBestSeller', p.isBestSeller)}
                            className={`p-1.5 rounded-lg border transition ${
                              p.isBestSeller
                                ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                                : 'bg-heritage-50 border-heritage-200 text-heritage-300 hover:text-heritage-500'
                            }`}
                            title="Toggle Best Seller"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </td>

                        {/* Featured Toggle */}
                        <td className="p-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggle(p.id, 'isFeatured', p.isFeatured)}
                            className={`p-1.5 rounded-lg border transition ${
                              p.isFeatured
                                ? 'bg-gold/15 border-gold text-gold-dark shadow-sm'
                                : 'bg-heritage-50 border-heritage-200 text-heritage-300 hover:text-heritage-500'
                            }`}
                            title="Toggle Featured"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </td>

                        {/* Status Toggle */}
                        <td className="p-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggle(p.id, 'isActive', p.isActive)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition ${
                              p.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {p.isActive ? 'Active' : 'Archived'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <Link
                              href={`/shop?slug=${p.slug}`}
                              target="_blank"
                              className="p-1.5 text-heritage-500 hover:text-heritage-900 hover:bg-heritage-100 rounded-lg transition"
                              title="Preview on Storefront"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 text-heritage-600 hover:text-gold-dark hover:bg-heritage-100 rounded-lg transition"
                              title="Edit Garment Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-1.5 text-heritage-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Archive Garment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-heritage-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-heritage-100">
                <h3 className="font-serif text-lg font-bold text-heritage-900">
                  Quick Edit Garment Details
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 text-heritage-400 hover:text-heritage-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-heritage-700 mb-1">
                    Garment Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-heritage-700 mb-1">
                      Base Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.basePrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          basePrice: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-heritage-700 mb-1">
                      MRP / Compare Price (₹)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.compareAtPrice || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          compareAtPrice: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-heritage-700 mb-1">
                    Fabric Details
                  </label>
                  <input
                    type="text"
                    value={editingProduct.fabricDetails || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, fabricDetails: e.target.value })
                    }
                    placeholder="e.g. 100% Super 120s Italian Merino Wool"
                    className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-heritage-700 mb-1">
                      Fit Type
                    </label>
                    <input
                      type="text"
                      value={editingProduct.fitType || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, fitType: e.target.value })
                      }
                      placeholder="e.g. Slim Fit, Royal Tailored"
                      className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-heritage-700 mb-1">
                      Occasion
                    </label>
                    <input
                      type="text"
                      value={editingProduct.occasion || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, occasion: e.target.value })
                      }
                      placeholder="e.g. Wedding, Reception, Gala"
                      className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-heritage-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.shortDescription || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        shortDescription: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-heritage-300 rounded-lg focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-heritage-100">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-heritage-300 rounded-lg hover:bg-heritage-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-4 py-2 bg-gold hover:bg-gold-light text-heritage-900 font-bold rounded-lg transition"
                  >
                    {savingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
