import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | BLVCK",
  description: "BLVCK privacy policy — how we handle your data, cookies, and personal information.",
};

export default function PrivacyPage() {
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
            PRIVACY POLICY
          </h1>
          <p className="text-white/40 text-xs mt-4">Last updated: June 2026</p>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-12 text-sm text-white/70 leading-relaxed">
            {/* 1 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">1. INFORMATION WE COLLECT</h2>
              <p>
                When you browse our store, we collect personal information you provide directly — such as your name, email address,
                phone number, shipping address, and payment details. We also automatically collect certain data through cookies
                and similar technologies, including your IP address, browser type, device information, and browsing behaviour
                on our site.
              </p>
            </div>

            {/* 2 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">2. HOW WE USE YOUR INFORMATION</h2>
              <p>We use your data to:</p>
              <ul className="list-disc pl-6 space-y-1 text-white/60">
                <li>Process and fulfil your orders (including shipping confirmations and invoices)</li>
                <li>Communicate with you about your orders, account, or inquiries</li>
                <li>Improve our store, products, and customer experience</li>
                <li>Send marketing communications only if you have opted in</li>
                <li>Comply with legal obligations and prevent fraud</li>
              </ul>
            </div>

            {/* 3 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">3. DATA SHARING & THIRD PARTIES</h2>
              <p>
                We do not sell your personal information. We may share your data with trusted third-party service providers
                who assist us in operating our website, processing payments, and delivering orders (e.g., payment gateways,
                shipping carriers). These providers are contractually bound to protect your data and use it only for the
                services they perform on our behalf.
              </p>
            </div>

            {/* 4 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">4. COOKIES</h2>
              <p>
                Our site uses cookies to enhance your browsing experience, remember your preferences, and analyse site traffic.
                You can control cookie settings through your browser. Disabling certain cookies may affect the functionality
                of our store.
              </p>
            </div>

            {/* 5 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">5. DATA SECURITY</h2>
              <p>
                We implement industry-standard security measures — including SSL encryption and secure data storage — to
                protect your personal information from unauthorised access, alteration, disclosure, or destruction.
              </p>
            </div>

            {/* 6 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">6. YOUR RIGHTS</h2>
              <p>
                You have the right to access, correct, or delete your personal data at any time. You may also withdraw
                consent for marketing communications. To exercise these rights, contact us at our support email.
              </p>
            </div>

            {/* 7 */}
            <div className="space-y-3">
              <h2 className="font-display text-lg tracking-widest text-white uppercase">7. CONTACT</h2>
              <p>
                For any questions about this privacy policy or how we handle your data, please reach out through our
                contact page or email us directly.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
