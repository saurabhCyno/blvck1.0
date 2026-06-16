import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getSetting } from "../actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Manifesto & Lab | BLVCK",
  description: "Learn about our carbon-dense matte black material engineering and the design philosophy driving the silent revolution.",
};

export const revalidate = 0; // Prevent Next.js from caching settings modifications

export default async function AboutPage() {
  const cmsData = await getSetting("about_cms");

  // Fallback structures if setting is empty or pending administrator configuration
  const manifestoText = cmsData?.manifesto || "WE CRAFT THE VANGUARD. WE ARE THE DARKNESS. NO BRANDS. JUST APPAREL.";
  const historyText = cmsData?.history || "BLVCK was established in 2026 as an architectural reaction to traditional visual weight. We focus exclusively on carbon-dense premium breathable apparel that conforms to the human shape. Engineered for comfort, finished in deep absolute matte black.";
  const teamList = cmsData?.team || [
    { name: "K. VAN DER WEYDEN", role: "CHIEF TEXTILE ARCHITECT" },
    { name: "M. NOIR", role: "CREATIVE & BRAND DIRECTOR" },
    { name: "S. THAKUR", role: "PRINCIPAL DEVELOPER" }
  ];

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="bg-black text-white flex-1 font-body">
        {/* Hero Title */}
        <section className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 border-b border-white/10 text-center sm:text-left">
          <span className="font-display text-xs text-white/45 tracking-widest uppercase">
            BLVCK LABS CORP
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-widest-luxury text-white mt-2">
            THE MANIFESTO
          </h1>
        </section>

        {/* Narrative Block 1: The Core Philosophy */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 items-center">
          <div className="md:col-span-4">
            <h2 className="font-display text-2xl tracking-widest text-white">
              01 / ABSOLUTE ABSENCE
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6">
            <p className="font-display text-lg sm:text-xl md:text-2xl text-white leading-relaxed tracking-wider font-semibold uppercase">
              &ldquo;{manifestoText}&rdquo;
            </p>
          </div>
        </section>

        {/* Narrative Block 2: Technical highlights */}
        <section className="bg-card-dark border-b border-white/10 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-4">
                <span className="font-display text-xs text-white/45 tracking-widest uppercase block">
                  CRAFTSMANSHIP
                </span>
                <h2 className="font-display text-3xl font-black tracking-widest-luxury text-white">
                  MATERIAL ENGINEERING
                </h2>
                <p className="text-white/50 text-xs leading-relaxed max-w-sm">
                  We develop and test our fabrics in high-performance labs, ensuring color preservation and breathability metrics.
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Highlight 1 */}
                <div className="border border-white/10 p-6 space-y-3 bg-black">
                  <h3 className="font-display text-sm text-white tracking-widest">
                    CARBON SHADOW DENSITY
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed">
                    By infusing matte black particles deeply into each thread matrix, we achieve an absolute light-absorbing dark tone that remains rich over 100+ wash-and-wear cycles.
                  </p>
                </div>

                {/* Highlight 2 */}
                <div className="border border-white/10 p-6 space-y-3 bg-black">
                  <h3 className="font-display text-sm text-white tracking-widest">
                    INTERLOCK COMPACT KNIT
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed">
                    A dual-sided weave pattern crafted with long-staple organic cotton. This creates an extremely smooth, premium structure that prevents heat retention.
                  </p>
                </div>

                {/* Highlight 3 */}
                <div className="border border-white/10 p-6 space-y-3 bg-black">
                  <h3 className="font-display text-sm text-white tracking-widest">
                    ASYMMETRICAL ERGONOMICS
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed">
                    Every garment is panels-mapped relative to joint rotation fields, ensuring maximum flexibility, drape flow, and high-elasticity comfort.
                  </p>
                </div>

                {/* Highlight 4 */}
                <div className="border border-white/10 p-6 space-y-3 bg-black">
                  <h3 className="font-display text-sm text-white tracking-widest font-black text-stroke-white">
                    ZERO LABEL POLICY
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed">
                    To maintain pure visual clarity and eliminate friction irritation, all product specifications are printed using eco-friendly thermal dye inside the collar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Block 3: History & Core Team Grid */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-2xl tracking-widest text-white">
                02 / COUTURE HERITAGE
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-white/70 text-sm leading-relaxed max-w-2xl font-light">
                {historyText}
              </p>
            </div>
          </div>

          {/* Team Grid */}
          <div className="space-y-12">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-display text-lg tracking-widest text-white uppercase">
                COUTURE LAB FOUNDERS
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamList.map((member: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-card-dark border border-white/5 p-8 space-y-4 hover:border-white/20 transition-all duration-300"
                >
                  <span className="font-display text-xs text-white/30 block tracking-wider">
                    MEMBER 0{idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-display text-base text-white tracking-widest">
                      {member.name}
                    </h4>
                    <p className="font-body text-xs text-white/50 tracking-widest uppercase">
                      {member.role}
                    </p>
                  </div>
                  <div className="h-[1px] bg-white/5 w-12" />
                  <p className="text-xs text-white/40 leading-relaxed font-body">
                    Architecting the future of avant-garde visual weight and light-absorbing garment designs.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
