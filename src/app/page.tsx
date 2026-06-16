import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import { getBestsellers, getLatestDrops, seedDatabase } from "./actions";

export const revalidate = 0; // Disable server caching to ensure database updates reflect live

export default async function Homepage() {
  // Trigger seeder if database is empty
  await seedDatabase();

  const bestsellers = await getBestsellers();
  const latestDrops = await getLatestDrops();

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="bg-black text-white flex-1">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Brand Value Propositions (USPs) Section */}
        <section className="border-b border-white/10 bg-card-dark py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              {/* USP 1 */}
              <div className="space-y-4 border-l border-white/10 pl-6 md:border-l md:border-t-0 md:pl-8 pt-4 md:pt-0">
                <span className="font-display text-xs text-white/40 tracking-widest-luxury block">
                  USP 01 / MATERIAL
                </span>
                <h3 className="font-display text-xl tracking-widest text-white">
                  100% BREATHABLE WEAVE
                </h3>
                <p className="font-body text-xs text-white/50 leading-relaxed max-w-sm">
                  Engineered with an advanced interlock micro-mesh pattern that facilitates continuous thermal airflow, eliminating moisture trapping.
                </p>
              </div>

              {/* USP 2 */}
              <div className="space-y-4 border-l border-white/10 pl-6 md:border-l md:border-t-0 md:pl-8 pt-4 md:pt-0">
                <span className="font-display text-xs text-white/40 tracking-widest-luxury block">
                  USP 02 / AESTHETICS
                </span>
                <h3 className="font-display text-xl tracking-widest text-white">
                  CARBON-DENSE MATTE FINISH
                </h3>
                <p className="font-body text-xs text-white/50 leading-relaxed max-w-sm">
                  Treated to absorb 99.2% of light reflection, creating a rich, deep absolute black shadow silhouette that resists washing color fade.
                </p>
              </div>

              {/* USP 3 */}
              <div className="space-y-4 border-l border-white/10 pl-6 md:border-l md:border-t-0 md:pl-8 pt-4 md:pt-0">
                <span className="font-display text-xs text-white/40 tracking-widest-luxury block">
                  USP 03 / SILHOUETTE
                </span>
                <h3 className="font-display text-xl tracking-widest text-white">
                  TAILORED LUXURY FIT
                </h3>
                <p className="font-body text-xs text-white/50 leading-relaxed max-w-sm">
                  Crafted using high-elasticity blends combined with architectural panel seams, maintaining structural posture lines during movement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Sellers Carousel Section */}
        <section className="py-24 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <span className="font-display text-xs text-white/40 tracking-widest">
                  CURATED DROP
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-black tracking-widest-luxury text-white">
                  BEST SELLERS
                </h2>
              </div>
              <Link
                href="/shop"
                className="font-display text-xs tracking-widest border-b border-white pb-1 hover:text-white/70 hover:border-white/70 transition-colors"
              >
                SHOP ALL APPAREL
              </Link>
            </div>

            {/* Carousel Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestsellers.slice(0, 3).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Immersive Showcase Parallax Banner */}
        <section className="relative h-[55vh] flex items-center justify-center overflow-hidden border-b border-white/10 bg-neutral-950">
          {/* Parallax Background Simulation */}
          <div
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="100%" height="100%" fill="%23040404"/><path d="M 0 50 Q 200 150 400 50 T 800 50" fill="none" stroke="%230c0c0c" stroke-width="2"/><path d="M 0 150 Q 200 250 400 150 T 800 150" fill="none" stroke="%230c0c0c" stroke-width="2"/><path d="M 0 250 Q 200 350 400 250 T 800 250" fill="none" stroke="%230c0c0c" stroke-width="2"/></svg>')`,
              backgroundAttachment: "fixed",
            }}
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-110"
          />
          <div className="absolute inset-0 bg-black/60" />

          {/* Text Content */}
          <div className="relative z-10 text-center max-w-xl px-4 space-y-4">
            <span className="font-display text-xs text-white/50 tracking-widest-luxury">
              LABORATORY EDITION
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white tracking-widest-luxury leading-tight">
              DESIGNED FOR SHADOWS
            </h2>
            <p className="font-body text-xs text-white/60 leading-relaxed">
              We focus on material density and light absorption. No logos, no tags. The silhouette speaks for itself.
            </p>
          </div>
        </section>

        {/* "The Drops" Latest Releases Grid Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-2 mb-16 text-center md:text-left">
              <span className="font-display text-xs text-white/40 tracking-widest">
                LATEST INVENTORY RELEASE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-widest-luxury text-white">
                THE LATEST DROPS
              </h2>
            </div>

            {/* 3x2 Rigid Minimalist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestDrops.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="text-center pt-16">
              <Link
                href="/shop"
                className="font-display text-xs border border-white/20 px-10 py-5 tracking-widest text-white hover:bg-white hover:text-black hover:border-white transition-all font-black"
              >
                EXPLORE ENTIRE CATALOG
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
