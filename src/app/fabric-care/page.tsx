import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Droplets, Sun, Thermometer, WashingMachine, Wind, ShieldCheck, AlertTriangle, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fabric & Care | BLVCK",
  description: "BLVCK fabric guide and care instructions — learn about our carbon-dense matte black materials and how to maintain them.",
};

const fabrics = [
  {
    name: "CARBON MERINO BLEND",
    tag: "SIGNATURE",
    desc: "A proprietary fusion of extra-fine merino wool and carbon-infused microfibers. This blend delivers absolute matte black colour retention, natural temperature regulation, and odour resistance — engineered for the modern minimalist.",
    properties: ["Absolute matte finish", "Temperature regulating", "Odour resistant", "4-way stretch"],
    icon: Sparkles,
  },
  {
    name: "HEAVY WEIGHT COTTON JERSEY",
    tag: "CORE",
    desc: "320 GSM ring-spun combed cotton jersey with a double-faced knit construction. Pre-shrunk and garment-dyed for a uniform deep black that lasts. The foundation of our everyday drops.",
    properties: ["320 GSM weight", "Pre-shrunk", "Double-faced knit", "Deep black dye"],
    icon: Wind,
  },
  {
    name: "TACTIL NYLON WOVEN",
    tag: "TECH",
    desc: "A lightweight, water-repellent woven nylon with a matte calendered finish. Used in our outerwear and technical pieces. Wind-resistant, quick-drying, and packable without compromising the BLVCK aesthetic.",
    properties: ["Water repellent", "Wind resistant", "Quick drying", "Ultra lightweight"],
    icon: ShieldCheck,
  },
];

const careSteps = [
  {
    icon: Droplets,
    title: "WASH",
    items: [
      "Machine wash cold (max 30°C) on a gentle cycle",
      "Turn garments inside out before washing",
      "Use mild liquid detergent — avoid bleach, softeners, and optical brighteners",
      "Wash with like colours only; never mix with whites or light shades",
    ],
  },
  {
    icon: Sun,
    title: "DRY",
    items: [
      "Do not tumble dry — heat damages the matte finish",
      "Hang dry in shade, away from direct sunlight",
      "Lay flat on a drying rack for heavy knits to preserve shape",
      "Do not wring or twist — gently press out excess water",
    ],
  },
  {
    icon: Thermometer,
    title: "IRON",
    items: [
      "Iron on low to medium heat (max 150°C)",
      "Avoid ironing directly on prints or embroidered details",
      "Steam iron is preferred to remove deep creases",
      "For absolute best results, use a garment steamer",
    ],
  },
  {
    icon: WashingMachine,
    title: "STORAGE",
    items: [
      "Store in a cool, dry place away from direct light",
      "Use padded satin hangers for structured pieces",
      "Fold heavy knits — do not hang to avoid stretching",
      "Keep away from velcro, zippers, or rough surfaces that may cause pilling",
    ],
  },
];

export default function FabricCarePage() {
  return (
    <>
      <Header />
      <CartDrawer />

      <main className="bg-black text-white flex-1 font-body">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 border-b border-white/10">
          <span className="font-display text-xs text-white/45 tracking-widest uppercase">
            BLVCK LABS CORP
          </span>
          <div className="flex items-center gap-4 mt-2">
            <Wind className="h-8 w-8 text-white/30" />
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-widest-luxury text-white">
              FABRIC & CARE
            </h1>
          </div>
          <p className="text-white/50 text-sm mt-4 max-w-2xl leading-relaxed">
            Every BLVCK textile is engineered for longevity. Follow our care protocols to preserve the
            absolute matte black finish and structural integrity of your garments.
          </p>
        </section>

        {/* Fabric Index */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-10">
            <Sparkles className="h-5 w-5 text-white/30" />
            <h2 className="font-display text-2xl font-black tracking-widest text-white uppercase">
              FABRIC INDEX
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fabrics.map((fabric) => {
              const Icon = fabric.icon;
              return (
                <div key={fabric.name} className="border border-white/10 bg-card-dark hover:border-white/20 transition-all duration-300 group">
                  {/* Top accent bar */}
                  <div className="h-1.5 bg-white/10 group-hover:bg-white/30 transition-colors" />
                  <div className="p-6 space-y-5">
                    <div className="flex items-start justify-between">
                      <Icon className="h-6 w-6 text-white/30" />
                      <span className="text-[9px] font-display tracking-widest text-white/30 border border-white/10 px-2 py-0.5">
                        {fabric.tag}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-sm tracking-widest text-white uppercase font-black">
                        {fabric.name}
                      </h3>
                      <p className="text-xs text-white/50 mt-3 leading-relaxed">
                        {fabric.desc}
                      </p>
                    </div>
                    <div className="border-t border-white/5 pt-4">
                      <span className="text-[9px] font-display tracking-widest text-white/30 uppercase block mb-2">
                        Properties
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {fabric.properties.map((prop) => (
                          <span
                            key={prop}
                            className="text-[10px] font-display tracking-widest text-white/50 border border-white/10 px-2.5 py-1 bg-black"
                          >
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Care Protocol */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-10">
            <ShieldCheck className="h-5 w-5 text-white/30" />
            <h2 className="font-display text-2xl font-black tracking-widest text-white uppercase">
              CARE PROTOCOL
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {careSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="border border-white/10 p-6 bg-card-dark flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white/40" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display text-sm tracking-widest text-white uppercase font-black">
                      {step.title}
                    </h3>
                    <ul className="space-y-1.5">
                      {step.items.map((item) => (
                        <li key={item} className="flex items-start space-x-2 text-xs text-white/50">
                          <span className="text-white/20 mt-0.5">—</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Warning box */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-5 w-5 text-amber-400/60" />
            <h2 className="font-display text-2xl font-black tracking-widest text-white uppercase">
              WHAT TO AVOID
            </h2>
          </div>
          <div className="border border-amber-500/20 bg-amber-500/5 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "BLEACH & CHLORINE", desc: "Destroys the carbon pigment and causes irreversible colour fade." },
                { label: "FABRIC SOFTENERS", desc: "Coats fibres and reduces breathability and moisture wicking." },
                { label: "HIGH HEAT DRYING", desc: "Shrinks fibres and degrades the matte surface texture." },
                { label: "DRY CLEANING", desc: "Harsh chemicals strip the garment-dyed finish and elasticity." },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <span className="font-display text-xs tracking-widest text-amber-400/80 uppercase block">
                    {item.label}
                  </span>
                  <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border border-white/5 bg-card-dark p-6">
            <p className="text-xs text-white/40 leading-relaxed">
              <strong className="text-white/70">GUARANTEE:</strong> When cared for according to these guidelines,
              your BLVCK garment will retain its absolute matte black finish and structural integrity for over
              100 wash cycles. Each piece is tested in our lab before release.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
