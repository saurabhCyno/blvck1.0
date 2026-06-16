"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "DROP 01: MATTE COUTURE",
    subtitle: "CARBON-DENSE APPAREL ENGINEERED FOR THE AVANT-GARDE",
    description: "Zero branding. Pure light absorption. Tailored shapes that redefine visual presence.",
    buttonText: "SHOP DEEP BLACKS",
    href: "/shop",
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><rect width="100%" height="100%" fill="%23050505"/><line x1="100" y1="450" x2="1500" y2="450" stroke="%231a1a1a" stroke-width="2"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="100" font-weight="900" fill="%230c0c0c">DROP 01</text></svg>`,
  },
  {
    id: 2,
    title: "DROP 02: THE BREATHABLE MATTE",
    subtitle: "100% BREATHABLE COMPACT COTTON & ELASTHAN",
    description: "High-elasticity weave engineered with advanced thermal regulation and zero weight.",
    buttonText: "EXPLORE ESSENTIALS",
    href: "/shop?gender=Unisex",
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><rect width="100%" height="100%" fill="%23080808"/><circle cx="800" cy="450" r="300" fill="none" stroke="%23111111" stroke-width="10"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="100" font-weight="900" fill="%230e0e0e">THERMAL WEAVE</text></svg>`,
  },
  {
    id: 3,
    title: "DROP 03: ARCHITECTURAL POSTURE",
    subtitle: "HEAVYWEIGHT SEAMS & STRUCTURAL POSTURES",
    description: "Tough cotton blends with tailored silhouettes that mold clean posture lines.",
    buttonText: "VIEW NEW DROPS",
    href: "/shop?gender=Men",
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><rect width="100%" height="100%" fill="%23020202"/><path d="M 0 0 L 1600 900 M 1600 0 L 0 900" stroke="%230f0f0f" stroke-width="4"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="100" font-weight="900" fill="%23070707">STRUCTURE</text></svg>`,
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-black border-b border-white/10 flex items-center justify-center">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ backgroundImage: `url('${slides[currentSlide].image}')` }}
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity"
        />
      </AnimatePresence>

      {/* Atmospheric dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/80" />

      {/* Foreground Interactive Content Grid */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col justify-center h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-display text-white/50 text-xs sm:text-sm tracking-widest-luxury uppercase"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-widest-luxury leading-tight"
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-body text-xs sm:text-sm text-white/80 max-w-md leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>

            {/* Action Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-4"
            >
              <Link
                href={slides[currentSlide].href}
                className="font-display text-xs bg-white text-black px-8 py-4 tracking-widest hover:bg-white/80 transition-all font-black inline-block rounded-none shadow-lg"
              >
                {slides[currentSlide].buttonText}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Index Steps Indicator */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center space-x-3">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(idx)}
            className={`h-[2px] transition-all duration-300 ${
              currentSlide === idx ? "w-10 bg-white" : "w-4 bg-white/20"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
