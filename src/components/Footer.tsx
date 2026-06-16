import Link from "next/link";
import { getSetting } from "@/app/actions";

export default async function Footer() {
  const socials = await getSetting("socials_cms");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 text-white/50 font-body text-xs mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand Manifesto */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-display text-white text-lg tracking-widest-luxury">
              THE MANIFESTO
            </h3>
            <p className="text-white/60 leading-relaxed text-sm max-w-md">
              We engineer garments that exist outside the noise. Zero labels, zero branding, zero distraction. Only carbon-dense matte black fabrics, tailoring precision, and high-elasticity breathability designed for the avant-garde.
            </p>
            <div className="flex space-x-4 pt-2">
              {socials?.instagram && (
                <>
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    INSTAGRAM
                  </a>
                  <span className="text-white/10">/</span>
                </>
              )}
              {socials?.twitter && (
                <>
                  <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    TWITTER (X)
                  </a>
                  <span className="text-white/10">/</span>
                </>
              )}
              {socials?.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  YOUTUBE
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div className="space-y-4">
            <h3 className="font-display text-white text-base tracking-widest">
              CUSTOMER CARE
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  HELP & INQUIRIES
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  SHIPPING & RETURNS
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  SIZE GUIDE
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  FABRIC & CARE
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Shop Categories */}
          <div className="space-y-4">
            <h3 className="font-display text-white text-base tracking-widest">
              EXPLORE DROPS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  SHOP ALL
                </Link>
              </li>
              <li>
                <Link href="/shop?gender=Men" className="hover:text-white transition-colors">
                  MEN&apos;S LABELS
                </Link>
              </li>
              <li>
                <Link href="/shop?gender=Women" className="hover:text-white transition-colors">
                  WOMEN&apos;S APPAREL
                </Link>
              </li>
              <li>
                <Link href="/shop?gender=Unisex" className="hover:text-white transition-colors">
                  UNISEX COLLECTION
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-widest uppercase text-white/30">
            © {currentYear} BLVCK. COUTURE DEV. LAB. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6 text-xs tracking-widest uppercase text-white/30">
            <Link href="/about" className="hover:text-white transition-colors">
              PRIVACY POLICY
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              TERMS OF SERVICE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
