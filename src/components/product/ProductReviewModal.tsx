'use client';

import React, { useState } from 'react';
import { Star, X, CheckCircle2, AlertCircle } from 'lucide-react';

export function ProductReviewModal({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(5);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          title: title || undefined,
          body,
          customerDisplayName: name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error?.message || 'Failed to submit review');
      }
    } catch {
      setError('Connection error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setSubmitted(false);
          setError(null);
        }}
        className="px-4 py-2 border border-heritage-300 rounded text-xs font-semibold text-heritage-800 hover:border-gold hover:text-gold-dark transition"
      >
        Write an Atelier Review
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-heritage-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="font-serif text-lg font-bold text-heritage-900">Patron Review</h3>
                <p className="text-[11px] text-heritage-500">{productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-heritage-400 hover:text-heritage-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-base text-heritage-900">Review Submitted!</h4>
                <p className="text-xs text-heritage-600">
                  Thank you for your feedback. In line with our genuine reviews policy, all client reviews are verified before appearing on the atelier page.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full mt-2 py-2 bg-heritage-900 text-gold font-bold text-xs rounded"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {error && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Rating Stars */}
                <div>
                  <label className="block font-semibold mb-1">Your Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(rating)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (hoverRating || rating)
                              ? 'text-gold fill-current'
                              : 'text-heritage-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Your Display Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gaurav S."
                    className="w-full px-3 py-1.5 border rounded focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Headline (Optional)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Masterful fit and royal finish"
                    className="w-full px-3 py-1.5 border rounded focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Your Feedback & Experience *</label>
                  <textarea
                    rows={3}
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Share your thoughts on the cut, fabric, and tailoring quality..."
                    className="w-full px-3 py-1.5 border rounded focus:border-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-heritage-900 hover:bg-heritage-800 text-gold font-bold rounded transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Verified Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
