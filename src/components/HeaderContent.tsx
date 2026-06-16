"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Menu, X, User } from "lucide-react";

interface Socials {
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

export default function HeaderContent({ socials = {} }: { socials?: Socials }) {
  const pathname = usePathname();
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const navLinks = [
    { name: "SHOP ALL", href: "/shop" },
    { name: "MEN", href: "/shop?gender=Men" },
    { name: "WOMEN", href: "/shop?gender=Women" },
    { name: "UNISEX", href: "/shop?gender=Unisex" },
    { name: "EDITORIALS", href: "/blog" },
    { name: "OUR MANIFESTO", href: "/about" },
    { name: "CONTACT US", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/75 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="text-white hover:text-white/70 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link
              href="/"
              className="font-display text-3xl font-black tracking-widest-luxury text-white hover:opacity-85 transition-opacity inline-block"
            >
              BLVCK
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-display text-sm tracking-widest transition-all duration-300 hover:text-white ${
                    isActive ? "text-white border-b border-white pb-1" : "text-white/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-6">
            <Link
              href="/account"
              className="text-white/45 hover:text-white transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Social Anchors (Desktop only) */}
            <div className="hidden sm:flex items-center space-x-4">
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/45 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/45 hover:text-white transition-colors"
                  aria-label="Twitter X"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Cart Button Toggle */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-white hover:text-white/70 transition-all duration-300 group"
              aria-label="Cart page"
            >
              <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-black font-body animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 py-4 px-6 animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-display text-lg tracking-widest text-white/80 hover:text-white py-1 block"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
