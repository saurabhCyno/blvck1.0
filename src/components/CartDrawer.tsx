"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { getTransformedImage } from "@/utils/imagekit";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function CartDrawer() {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const [mounted, setMounted] = useState(false);

  // Sync hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black backdrop-blur-xs"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card-dark border-l border-white/10 shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-5 w-5 text-white" />
                <h2 className="font-display text-white text-xl tracking-widest">
                  YOUR BAG ({items.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="h-12 w-12 text-white/20 stroke-[1]" />
                  <p className="font-display text-white/50 text-sm tracking-widest">
                    YOUR BAG IS EMPTY
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="font-display text-xs bg-white text-black px-6 py-3 tracking-widest hover:bg-white/80 transition-colors"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item._id}-${item.size}`}
                    className="flex space-x-4 pb-6 border-b border-white/5 last:border-b-0"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative h-24 w-18 flex-shrink-0 bg-card-light overflow-hidden border border-white/5">
                      <Image
                        src={getTransformedImage(item.image, 150, 200)}
                        alt={item.title}
                        fill
                        sizes="72px"
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* Item Metadata & Actions */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-sm text-white tracking-widest line-clamp-1">
                            {item.title}
                          </h3>
                          <span className="font-body font-bold text-xs text-white">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="font-body text-xs text-white/40 tracking-widest uppercase">
                          SIZE: {item.size}{item.fabric ? <> &bull; FABRIC: {item.fabric}GSM</> : ""}
                        </p>
                      </div>

                      {/* Quantity & Delete Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-white/10 bg-black">
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                            className="p-1.5 text-white/60 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-xs font-body text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                            className="p-1.5 text-white/60 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item._id, item.size)}
                          className="font-display text-xs tracking-widest text-white/45 hover:text-white transition-colors"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-display text-white/50 tracking-widest">SUBTOTAL</span>
                  <span className="font-body font-black text-white text-base">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs font-body text-white/40 uppercase tracking-widest">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Link
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="w-full block text-center font-display text-xs border border-white/20 text-white py-4 tracking-widest hover:border-white hover:bg-white/5 transition-all"
                  >
                    VIEW BAG & DETAILS
                  </Link>
                  <Link
                    href="/cart?checkout=true"
                    onClick={() => setCartOpen(false)}
                    className="w-full block text-center font-display text-xs bg-white text-black py-4 tracking-widest font-black hover:bg-white/80 transition-all"
                  >
                    PROCEED TO CHECKOUT
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
