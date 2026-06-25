"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { getTransformedImage } from "@/utils/imagekit";
import { createOrder } from "../actions";
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, CheckCircle } from "lucide-react";

export default function CartClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");
  const [formError, setFormError] = useState("");
  
  // Checkout Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Handle query parameter redirection
  useEffect(() => {
    setMounted(true);
    const triggerCheckout = searchParams.get("checkout");
    if (triggerCheckout === "true" && items.length > 0) {
      setIsCheckingOut(true);
    }
  }, [searchParams, items]);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
        <div className="animate-pulse font-display text-xs text-white/50 tracking-widest uppercase">
          LOADING COUTURE BAG...
        </div>
      </div>
    );
  }

  // Handle Checkout Submit
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation checks
    if (!formData.name.trim()) return setFormError("Customer Full Name is required.");
    if (!formData.email.trim() || !formData.email.includes("@")) return setFormError("Valid Email is required.");
    if (!formData.phone.trim() || formData.phone.length < 8) return setFormError("Valid Contact Number is required.");
    if (!formData.address.trim()) return setFormError("Full Shipping Address is required.");

    setIsPlacing(true);

    try {
      const orderItems = items.map((i) => ({
        productId: i._id,
        size: i.size,
        fabric: i.fabric,
        quantity: i.quantity,
        priceAtPurchase: i.price,
      }));

      const response = await createOrder({
        customerInfo: formData.name.trim() ? formData : { ...formData }, // fallback
        items: orderItems,
        totalAmount: totalPrice,
      });

      if (response.success) {
        setCreatedOrderId(response.orderId || "");
        setOrderSuccess(true);
        clearCart();
      } else {
        setFormError(response.error || "Failed to process order. Please try again.");
        setIsPlacing(false);
      }
    } catch {
      setFormError("An unexpected error occurred. Please verify stock counts.");
      setIsPlacing(false);
    }
  };

  // Render Order Success Canvas
  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-6">
        <CheckCircle className="h-16 w-16 text-white mx-auto stroke-[1.2] animate-bounce" />
        <div className="space-y-2">
          <span className="font-display text-xs text-white/45 tracking-widest">
            FULFILLMENT SUCCESS
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-widest-luxury text-white">
            ORDER CONFIRMED
          </h1>
        </div>
        <p className="font-body text-xs text-white/70 leading-relaxed max-w-md mx-auto">
          We have generated your order record. Our dispatch lab is processing your package. Your Cash on Delivery (COD) dispatch reference ID is:
        </p>
        <div className="bg-card-light border border-white/10 p-4 font-mono text-sm tracking-wider text-white max-w-xs mx-auto uppercase">
          {createdOrderId}
        </div>
        <div className="pt-4">
          <Link
            href="/shop"
            className="font-display text-xs bg-white text-black px-8 py-4.5 tracking-widest font-black inline-block hover:bg-white/80 transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  // Render Empty State
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-6">
        <ShoppingBag className="h-16 w-16 text-white/10 stroke-[1]" />
        <div className="space-y-1">
          <span className="font-display text-xs text-white/45 tracking-widest">
            NO ITEMS DETECTED
          </span>
          <h2 className="font-display text-2xl tracking-widest-luxury text-white">
            YOUR BAG IS EMPTY
          </h2>
        </div>
        <p className="font-body text-xs text-white/40 max-w-xs leading-relaxed">
          You haven&apos;t added any avant-garde clothing drops to your bag yet.
        </p>
        <Link
          href="/shop"
          className="font-display text-xs bg-white text-black px-8 py-4 tracking-widest font-black hover:bg-white/80 transition-colors"
        >
          EXPLORE THE CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="border-b border-white/10 pb-8 mb-12">
        <span className="font-display text-xs text-white/45 tracking-widest">
          CHECKOUT GATEWAY
        </span>
        <h1 className="font-display text-4xl font-black tracking-widest-luxury text-white mt-1">
          YOUR COUTURE BAG
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Cart Inventory List / OR Summary */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display text-sm tracking-widest text-white border-b border-white/10 pb-3">
            BAG INVENTORY ({items.reduce((s, i) => s + i.quantity, 0)})
          </h2>

          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={`${item._id}-${item.size}`}
                className="flex gap-4 pb-6 border-b border-white/5 last:border-b-0"
              >
                {/* Image */}
                <div className="relative h-28 w-21 flex-shrink-0 bg-card-light overflow-hidden border border-white/5">
                  <Image
                    src={getTransformedImage(item.image, 150, 200)}
                    alt={item.title}
                    fill
                    sizes="84px"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Info & Quantity Actions */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-sm text-white tracking-widest line-clamp-1">
                        {item.title}
                      </h3>
                      <span className="font-body text-xs font-black text-white">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="font-body text-xs text-white/45 uppercase tracking-widest">
                      SIZE: {item.size}{item.fabric ? <> &bull; FABRIC: {item.fabric}GSM</> : ""}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    {/* Qty controller */}
                    <div className="flex items-center border border-white/10 bg-black">
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                        className="p-1.5 text-white/60 hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3.5 text-xs font-body text-white font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                        className="p-1.5 text-white/60 hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item._id, item.size)}
                      className="text-white/45 hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-display tracking-widest uppercase"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>REMOVE</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Link
              href="/shop"
              className="font-display text-xs text-white/50 hover:text-white transition-colors border-b border-white/20 pb-0.5"
            >
              CONTINUE ADDING APPAREL
            </Link>
          </div>
        </div>

        {/* Right Column: checkout form or totals summary */}
        <div className="lg:col-span-5 bg-card-dark border border-white/10 p-6 md:p-8 space-y-6">
          <h2 className="font-display text-sm tracking-widest text-white border-b border-white/10 pb-3">
            {isCheckingOut ? "DELIVERY & CONFIRMATION" : "ORDER SUMMARY"}
          </h2>

          {/* Pricing Summary */}
          <div className="space-y-3 font-body text-xs text-white/60 border-b border-white/5 pb-4">
            <div className="flex justify-between">
              <span>BAG SUBTOTAL</span>
              <span className="text-white">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>LOGISTICS FEE</span>
              <span className="text-green-500 font-display text-xs tracking-widest font-black border border-green-500/20 px-2 py-0.5 bg-green-500/5">
                FREE SHIPPING
              </span>
            </div>
            <div className="flex justify-between">
              <span>PAYMENT METHOD</span>
              <span className="text-white">CASH ON DELIVERY (COD)</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-white">
            <span className="font-display text-xs tracking-widest">TOTAL AMOUNT DUE</span>
            <span className="font-body text-lg font-black">₹{totalPrice.toFixed(2)}</span>
          </div>

          {/* Render Action Buttons or Checkout Form */}
          {!isCheckingOut ? (
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full bg-white text-black font-display font-black text-xs py-4.5 tracking-widest hover:bg-white/80 transition-colors uppercase"
            >
              PROCEED TO SECURE CHECKOUT
            </button>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
              {/* Form errors */}
              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-body p-3.5">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label htmlFor="checkout-name" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                  FULL NAME
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  placeholder="e.g. Alexander Noir"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-xs font-body text-white focus:outline-hidden focus:border-white transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="checkout-email" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                  EMAIL ADDRESS
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  placeholder="e.g. alexander@noir.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-xs font-body text-white focus:outline-hidden focus:border-white transition-colors"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label htmlFor="checkout-phone" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                  CONTACT NUMBER
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-xs font-body text-white focus:outline-hidden focus:border-white transition-colors"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label htmlFor="checkout-address" className="block text-xs font-display tracking-widest text-white/50 uppercase">
                  SHIPPING ADDRESS
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={3}
                  placeholder="Street, City, Zip, State, Country"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-xs font-body text-white focus:outline-hidden focus:border-white transition-colors resize-none"
                />
              </div>

              {/* Locked COD Alert */}
              <div className="bg-white/5 border border-white/10 p-3.5 flex items-start space-x-3 text-xs text-white/60 leading-relaxed font-body">
                <CreditCard className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                <span>
                  Cash on Delivery (COD) is the exclusive payment method. Pay in cash to the delivery executive upon package arrival.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  disabled={isPlacing}
                  onClick={() => setIsCheckingOut(false)}
                  className="w-full border border-white/20 text-white font-display text-xs py-4 tracking-widest hover:border-white transition-all uppercase disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  disabled={isPlacing}
                  className="w-full bg-white text-black font-display font-black text-xs py-4 tracking-widest hover:bg-white/80 transition-all uppercase disabled:bg-white/50 disabled:cursor-not-allowed"
                >
                  {isPlacing ? "PLACING..." : "PLACE ORDER"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
