import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Ruler, Shirt, User, Dumbbell } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide | BLVCK CORE",
  description: "BLVCK CORE size guide — find your perfect fit with our detailed measurement charts for men, women, and unisex apparel.",
};

const sizeData = {
  men: {
    sizes: ["S", "M", "L", "XL", "XXL"],
    chest: [96, 102, 108, 114, 122],
    waist: [81, 87, 93, 99, 107],
    length: [70, 72, 74, 76, 78],
    shoulder: [44, 46, 48, 50, 52],
  },
  women: {
    sizes: ["S", "M", "L", "XL"],
    chest: [84, 90, 96, 102],
    waist: [66, 72, 78, 84],
    length: [62, 64, 66, 68],
    shoulder: [38, 40, 42, 44],
  },
  unisex: {
    sizes: ["S", "M", "L", "XL", "XXL"],
    chest: [98, 104, 110, 116, 124],
    waist: [84, 90, 96, 102, 110],
    length: [72, 74, 76, 78, 80],
    shoulder: [46, 48, 50, 52, 54],
  },
};

const bodyParts = [
  { key: "chest", label: "CHEST", desc: "Measure around the fullest part of your chest, keeping the tape horizontal." },
  { key: "waist", label: "WAIST", desc: "Measure around your natural waistline, just above the navel." },
  { key: "length", label: "LENGTH", desc: "Measure from the highest point of the shoulder down to the desired hem." },
  { key: "shoulder", label: "SHOULDER", desc: "Measure across the back from the edge of one shoulder to the other." },
];

function SizeChart({ title, data }: { title: string; data: typeof sizeData.men }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg tracking-widest text-white uppercase border-b border-white/10 pb-3">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-6 text-white/40 font-display tracking-widest uppercase font-normal">MEASUREMENT</th>
              {data.sizes.map((s) => (
                <th key={s} className="py-3 px-4 text-center font-display tracking-widest text-white font-black text-sm">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyParts.map((part) => (
              <tr key={part.key} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 pr-6 text-white/70 font-display tracking-widest">
                  {part.label} (cm)
                </td>
                {(data as Record<string, (string | number)[]>)[part.key].map((val, i) => (
                  <td key={i} className="py-3 px-4 text-center text-white font-mono">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SizeGuidePage() {
  return (
    <>
      <Header />
      <CartDrawer />

      <main className="bg-black text-white flex-1 font-body">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 border-b border-white/10">
          <span className="font-display text-xs text-white/45 tracking-widest uppercase">
            BLVCK CORE LABS CORP
          </span>
          <div className="flex items-center gap-4 mt-2">
            <Ruler className="h-8 w-8 text-white/30" />
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-widest-luxury text-white">
              SIZE GUIDE
            </h1>
          </div>
          <p className="text-white/50 text-sm mt-4 max-w-2xl leading-relaxed">
            Find your perfect carbon-fit. All BLVCK CORE garments are engineered with precision tailoring.
            Measure a similar garment you already own and compare with our charts below.
          </p>
        </section>

        {/* How to measure section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-10">
            <Dumbbell className="h-5 w-5 text-white/30" />
            <h2 className="font-display text-2xl font-black tracking-widest text-white uppercase">
              HOW TO MEASURE
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bodyParts.map((part) => (
              <div key={part.key} className="border border-white/10 p-6 bg-card-dark space-y-3 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm tracking-widest text-white uppercase">{part.label}</span>
                  <div className="w-8 h-8 border border-white/10 flex items-center justify-center">
                    <span className="text-white/40 text-xs font-mono">{part.key === "chest" ? "⌗" : part.key === "waist" ? "◯" : part.key === "length" ? "↕" : "↔"}</span>
                  </div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{part.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Size Charts */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-10">
            <Shirt className="h-5 w-5 text-white/30" />
            <h2 className="font-display text-2xl font-black tracking-widest text-white uppercase">
              MEASUREMENT CHARTS
            </h2>
          </div>
          <div className="space-y-16">
            <SizeChart title="MEN'S APPAREL" data={sizeData.men} />
            <SizeChart title="WOMEN'S APPAREL" data={sizeData.women} />
            <SizeChart title="UNISEX COLLECTION" data={sizeData.unisex} />
          </div>
        </section>

        {/* Fit guide */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <User className="h-5 w-5 text-white/30" />
            <h2 className="font-display text-2xl font-black tracking-widest text-white uppercase">
              FIT RECOMMENDATIONS
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/10 p-6 bg-card-dark space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm tracking-widest text-white uppercase">SLIM / TAPERED</span>
                <span className="text-[10px] font-display tracking-widest text-white/30 px-2 py-0.5 border border-white/10">S-M</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Fitted silhouette. Order your usual size for a close-to-body cut. Best for layering under jackets.
              </p>
            </div>
            <div className="border border-white/10 p-6 bg-card-dark space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm tracking-widest text-white uppercase">REGULAR</span>
                <span className="text-[10px] font-display tracking-widest text-white/30 px-2 py-0.5 border border-white/10">M-L</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Standard comfort fit. If you prefer a relaxed silhouette without being oversized, go with your regular size.
              </p>
            </div>
            <div className="border border-white/10 p-6 bg-card-dark space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm tracking-widest text-white uppercase">OVERSIZED / LOOSE</span>
                <span className="text-[10px] font-display tracking-widest text-white/30 px-2 py-0.5 border border-white/10">L-XL</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Boxier drape with extended shoulders. Size up 1-2 from your usual for that avant-garde streetwear look.
              </p>
            </div>
          </div>

          <div className="mt-10 border border-white/5 bg-card-dark p-6">
            <p className="text-xs text-white/40 leading-relaxed">
              <strong className="text-white/70">NOTE:</strong> These measurements are body measurements, not garment measurements.
              If you are between sizes, we recommend sizing up for a more comfortable fit. All measurements are in centimetres.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
