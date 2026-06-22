import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | BLVCK",
  description: "BLVCK terms of service — our policies on orders, payments, no refunds, and no returns.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <CartDrawer />

      <main className="bg-black text-white flex-1 font-body">
        <section className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 border-b border-white/10">
          <span className="font-display text-xs text-white/45 tracking-widest uppercase">
            BLVCK LABS CORP
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-widest-luxury text-white mt-2">
            TERMS OF SERVICE
          </h1>
          <p className="text-white/40 text-xs mt-4">Last updated: June 2026</p>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-12 text-sm text-white/70 leading-relaxed">
            {/* 1 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">1. ACCEPTANCE OF TERMS</h2>
              <p>
                By accessing or purchasing from BLVCK, you agree to be bound by these Terms of Service. If you do not
                agree with any part of these terms, you should not use our website or place an order.
              </p>
            </div>

            {/* 2 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">2. PRODUCT & ORDER INFORMATION</h2>
              <p>
                We strive to ensure that all product descriptions, images, pricing, and availability are accurate.
                However, we reserve the right to correct any errors and update information at any time without prior
                notice. In the event of a pricing error, we will contact you before processing the order.
              </p>
              <p>
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any
                order for any reason, including limitations on quantities or issues with payment verification.
              </p>
            </div>

            {/* 3 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">3. NO REFUNDS, NO RETURNS, NO EXCHANGES</h2>
              <div className="border border-red-500/20 bg-red-500/5 p-6 space-y-3">
                <p className="text-red-400 font-display tracking-widest text-sm uppercase font-black">
                  FINAL SALE POLICY
                </p>
                <p className="text-white/80">
                  All sales made through BLVCK are <strong>final</strong>. We operate a strict <strong>no refunds, no returns, and no exchanges</strong> policy.
                </p>
                <p className="text-white/80">
                  By placing an order, you acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-white/70">
                  <li>All items are non-refundable once purchased</li>
                  <li>We do not accept returns for any reason, including size, fit, or personal preference</li>
                  <li>No exchanges or size replacements will be processed</li>
                  <li>This policy applies to all products, sale items, and promotional orders</li>
                </ul>
                <p className="text-white/60 text-xs">
                  Exceptions may only be made in the case of a manufacturing defect or an error on our part in fulfilling
                  your order, evaluated on a case-by-case basis.
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">4. PAYMENT & PRICING</h2>
              <p>
                All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. We accept payment via
                Cash on Delivery (COD) and other methods as displayed at checkout. Payment must be received in full before
                an order is processed.
              </p>
            </div>

            {/* 5 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">5. SHIPPING & DELIVERY</h2>
              <p>
                We ship to addresses within India. Delivery times are estimates and not guaranteed. BLVCK is not
                responsible for delays caused by shipping carriers, customs, or unforeseen circumstances. Risk of loss
                and title for items purchased pass to you upon delivery.
              </p>
            </div>

            {/* 6 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">6. INTELLECTUAL PROPERTY</h2>
              <p>
                All content on this website — including text, images, logos, designs, and code — is the intellectual
                property of BLVCK. You may not reproduce, distribute, or use any content without our express written
                permission.
              </p>
            </div>

            {/* 7 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">7. LIMITATION OF LIABILITY</h2>
              <p>
                BLVCK shall not be liable for any indirect, incidental, or consequential damages arising from your use
                of this website or purchase of our products. Our total liability is limited to the amount paid for the
                product in question.
              </p>
            </div>

            {/* 8 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">8. CHANGES TO TERMS</h2>
              <p>
                We reserve the right to update or modify these Terms of Service at any time. Changes will be effective
                immediately upon posting. Your continued use of the site after changes constitutes acceptance of the
                new terms.
              </p>
            </div>

            {/* 9 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">9. CONTACT</h2>
              <p>
                For questions about these terms, please reach out through our contact page.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
