import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartClient from "./CartClient";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Your Bag & Checkout | BLVCK CORE",
  description: "Review items in your bag and proceed to cash-on-delivery checkout.",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="bg-black text-white flex-1 min-h-[70vh]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
              <div className="animate-pulse font-display text-xs text-white/50 tracking-widest uppercase">
                LOADING COUTURE CHECKOUT...
              </div>
            </div>
          }
        >
          <CartClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
