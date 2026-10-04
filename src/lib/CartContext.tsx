'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackEvent } from './analytics';

export interface CartLineItem {
  variantId: string;
  productId: string;
  name: string;
  size: string;
  color: string;
  fabric?: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartLineItem[];
  addItem: (item: CartLineItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  couponCode: string;
  discount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('bm_tailors_cart');
      if (savedCart) setItems(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('bm_tailors_wishlist');
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCart = (newItems: CartLineItem[]) => {
    setItems(newItems);
    localStorage.setItem('bm_tailors_cart', JSON.stringify(newItems));
  };

  const addItem = (item: CartLineItem) => {
    const existingIndex = items.findIndex((i) => i.variantId === item.variantId);
    let updated: CartLineItem[];

    if (existingIndex > -1) {
      const existing = items[existingIndex];
      const newQty = Math.min(existing.quantity + item.quantity, existing.stock);
      updated = [...items];
      updated[existingIndex] = { ...existing, quantity: newQty };
    } else {
      updated = [...items, item];
    }

    saveCart(updated);
    trackEvent('add_to_cart', {
      variantId: item.variantId,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    });
  };

  const removeItem = (variantId: string) => {
    const removed = items.find((i) => i.variantId === variantId);
    const updated = items.filter((i) => i.variantId !== variantId);
    saveCart(updated);
    if (removed) {
      trackEvent('remove_from_cart', {
        variantId,
        productId: removed.productId,
      });
    }
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    const updated = items.map((i) => {
      if (i.variantId === variantId) {
        return { ...i, quantity: Math.min(quantity, i.stock) };
      }
      return i;
    });
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setCouponCode('');
    setDiscount(0);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a coupon code' };

    try {
      const res = await fetch(`/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponCode(cleanCode);
        setDiscount(data.data.discountAmount);
        return { success: true, message: `Coupon ${cleanCode} applied! Saved ₹${data.data.discountAmount}` };
      } else {
        return { success: false, message: data.error?.message || 'Invalid coupon' };
      }
    } catch {
      // Local fallback for seeded coupons
      if (cleanCode === 'ROYAL10') {
        if (subtotal >= 1999) {
          const disc = Math.min(Math.round((subtotal * 10) / 100), 1500);
          setCouponCode(cleanCode);
          setDiscount(disc);
          return { success: true, message: `Coupon ROYAL10 applied! Saved ₹${disc}` };
        }
        return { success: false, message: 'Minimum cart value ₹1999 required for ROYAL10' };
      }
      if (cleanCode === 'JAIPUR500') {
        if (subtotal >= 4999) {
          setCouponCode(cleanCode);
          setDiscount(500);
          return { success: true, message: `Coupon JAIPUR500 applied! Saved ₹500` };
        }
        return { success: false, message: 'Minimum cart value ₹4999 required for JAIPUR500' };
      }
      return { success: false, message: 'Invalid or expired coupon code' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
  };

  const toggleWishlist = (productId: string) => {
    let updated: string[];
    if (wishlistIds.includes(productId)) {
      updated = wishlistIds.filter((id) => id !== productId);
    } else {
      updated = [...wishlistIds, productId];
      trackEvent('wishlist_add', { productId });
    }
    setWishlistIds(updated);
    localStorage.setItem('bm_tailors_wishlist', JSON.stringify(updated));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        couponCode,
        discount,
        applyCoupon,
        removeCoupon,
        wishlistIds,
        toggleWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
