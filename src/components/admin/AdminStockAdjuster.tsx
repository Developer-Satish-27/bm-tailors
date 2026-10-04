'use client';

import React, { useState } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';

export function AdminStockAdjuster({
  variantId,
  currentStock: initialStock,
}: {
  variantId: string;
  currentStock: number;
}) {
  const [stock, setStock] = useState(initialStock);
  const [loading, setLoading] = useState(false);

  const handleRestock = async (qty: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          adjustmentQuantity: qty,
          reason: `Admin quick restock (+${qty} units)`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStock(stock + qty);
      }
    } catch {
      alert('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        type="button"
        disabled={loading}
        onClick={() => handleRestock(5)}
        className="px-2 py-0.5 bg-heritage-900 text-gold text-[10px] font-bold rounded hover:bg-heritage-800 transition flex items-center space-x-0.5 disabled:opacity-50"
        title="Add 5 units to stock"
      >
        {loading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Plus className="w-2.5 h-2.5" />}
        <span>+5 Units</span>
      </button>
    </div>
  );
}
