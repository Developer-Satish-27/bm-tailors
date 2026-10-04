'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface ReviewItem {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  customerDisplayName: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    media: { url: string }[];
  };
  user?: {
    id: string;
    email: string;
  } | null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/reviews${activeTab !== 'ALL' ? `?status=${activeTab}` : ''}`);
      const data = await res.json();
      if (data.success && data.data) {
        setReviews(data.data.reviews || []);
        if (data.data.counts) {
          setCounts(data.data.counts);
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateStatus = async (reviewId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, status }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Review ${status.toLowerCase()} successfully`);
        fetchReviews();
      }
    } catch {
      alert('Error updating review status');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;

    try {
      const res = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Review permanently deleted');
        fetchReviews();
      }
    } catch {
      alert('Error deleting review');
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

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-gold-dark fill-gold" />
              <h1 className="font-serif text-2xl font-bold text-heritage-900">
                Customer Reviews Moderation Queue
              </h1>
            </div>
            <p className="text-xs text-heritage-500 mt-1">
              Verify customer reviews before publishing on storefront product pages.
            </p>
          </div>

          <button
            onClick={fetchReviews}
            className="p-2.5 border border-heritage-200 rounded-lg hover:bg-heritage-50 text-heritage-600 transition flex items-center space-x-1.5 text-xs self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Zero Fake Reviews Brand Policy Notice */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start space-x-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Zero Fake Reviews Policy (Since 1990 Heritage)</p>
            <p className="text-emerald-800">
              Per strict brand guidelines, B M Tailors presents only genuine verified feedback. No fake customer accounts, bot ratings, or artificial praise are tolerated.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              activeTab === 'ALL'
                ? 'bg-heritage-900 text-white shadow-sm'
                : 'bg-white border border-heritage-200 text-heritage-700 hover:bg-heritage-100'
            }`}
          >
            All Reviews ({counts.total})
          </button>
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              activeTab === 'PENDING'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Pending Moderation ({counts.pending})
          </button>
          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Approved & Live ({counts.approved})
          </button>
          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              activeTab === 'REJECTED'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            Rejected ({counts.rejected})
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading && reviews.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-heritage-200 text-center text-heritage-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gold-dark" />
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-heritage-200 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-heritage-300 mx-auto" />
              <p className="font-serif font-bold text-base text-heritage-800">
                No reviews in this queue
              </p>
              <p className="text-xs text-heritage-500 max-w-md mx-auto">
                Customer reviews submitted on product pages will appear here for atelier verification.
              </p>
            </div>
          ) : (
            reviews.map((r) => {
              const prodImg =
                r.product?.media?.[0]?.url ||
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=200&q=80';

              return (
                <div
                  key={r.id}
                  className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-heritage-100">
                    {/* Product & Customer Info */}
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-14 relative rounded-lg overflow-hidden bg-heritage-100 border border-heritage-200 shrink-0">
                        <Image
                          src={prodImg}
                          alt={r.product?.name || 'Garment'}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-xs text-heritage-900">
                            {r.customerDisplayName}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-heritage-500 mt-0.5">
                          On:{' '}
                          <Link
                            href={`/shop?slug=${r.product?.slug}`}
                            target="_blank"
                            className="font-semibold text-heritage-800 hover:text-gold-dark inline-flex items-center space-x-1"
                          >
                            <span>{r.product?.name}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>{' '}
                          • {new Date(r.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= r.rating
                              ? 'text-gold fill-gold'
                              : 'text-heritage-200'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-heritage-700 ml-1.5">
                        {r.rating}.0 / 5
                      </span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-1 text-xs">
                    {r.title && (
                      <h4 className="font-serif font-bold text-heritage-900 text-sm">
                        "{r.title}"
                      </h4>
                    )}
                    <p className="text-heritage-700 leading-relaxed italic">
                      "{r.body}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-heritage-100 text-xs">
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="text-heritage-400 hover:text-rose-600 transition flex items-center space-x-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete permanently</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      {r.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'REJECTED')}
                          className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold flex items-center space-x-1.5 transition text-[11px]"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}

                      {r.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'APPROVED')}
                          className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center space-x-1.5 transition text-[11px] shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
