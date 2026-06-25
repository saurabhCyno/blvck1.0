import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ContactForm from "./ContactForm";
import { getSetting } from "../actions";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Concierge | BLVCK CORE",
  description: "Get in touch with our design studio, support desk, or media relations team.",
};

export const revalidate = 0; // Prevent Next.js from caching settings modifications

export default async function ContactPage() {
  const contactsData = await getSetting("contacts_cms");

  // Fallback defaults
  const phone = contactsData?.phone || "+917300511290";
  const email = contactsData?.email || "blvck6196@gmail.com";
  const address = contactsData?.address || "Tyagi Market, Premnagar, Dehradun, India - 248007";

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="bg-black text-white flex-1 min-h-[80vh] font-body">
        {/* Title */}
        <section className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 border-b border-white/10 text-center sm:text-left">
          <span className="font-display text-xs text-white/45 tracking-widest uppercase">
            CONCIERGE DESK
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-widest-luxury text-white mt-2">
            CONTACT US
          </h1>
        </section>

        {/* 2-Column Info & Form Grid */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Info Panel */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <h2 className="font-display text-2xl tracking-widest text-white">
                  STUDIO INFO
                </h2>
                <p className="text-white/50 text-xs leading-relaxed max-w-md">
                  Have inquiries regarding fabric density, custom stitching specifications, or shipping timelines? Our support lab is available to advise you.
                </p>
              </div>

              {/* Specific info rows */}
              <div className="space-y-6 text-xs text-white/60">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-white/40 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-display text-xs text-white tracking-widest uppercase">
                      HOTLINE PHONE
                    </h4>
                    <p className="font-body text-white/70">{phone}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-white/40 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-display text-xs text-white tracking-widest uppercase">
                      EMAIL INQUIRIES
                    </h4>
                    <a href={`mailto:${email}`} className="font-body text-white/70 hover:text-white transition-colors">
                      {email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-white/40 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-display text-xs text-white tracking-widest uppercase">
                      DESIGN LAB STUDIO
                    </h4>
                    <p className="font-body text-white/70 leading-relaxed">{address}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <Clock className="h-5 w-5 text-white/40 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-display text-xs text-white tracking-widest uppercase">
                      CONCIERGE HOURS
                    </h4>
                    <p className="font-body text-white/70">
                      Monday &ndash; Saturday, 10:00 to 19:00 IST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form Panel */}
            <div className="lg:col-span-7 bg-card-dark border border-white/5 p-6 md:p-8">
              <h2 className="font-display text-lg text-white tracking-widest font-black uppercase mb-6 border-b border-white/10 pb-3">
                DISPATCH MESSAGE
              </h2>
              <ContactForm />
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
