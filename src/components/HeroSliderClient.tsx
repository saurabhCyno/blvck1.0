"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface Slide {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  href: string;
  image: string;
}

export default function HeroSliderClient({ slides }: { slides: Slide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[85vh] overflow-hidden bg-black border-b border-white/10 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/80" />
        <div className="relative z-10 text-center max-w-xl px-4">
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-widest-luxury">
            BLVCK
          </h1>
          <p className="font-body text-xs text-white/50 mt-4">
            No slides configured. Add them in the admin panel.
          </p>
        </div>
      </div>
    );
  }

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
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-display text-white/50 text-xs sm:text-sm tracking-widest-luxury uppercase"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-widest-luxury leading-tight"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-body text-xs sm:text-sm text-white/80 max-w-md leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>

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
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center space-x-3">
          {slides.map((slide: Slide, idx: number) => (
            <button
              key={slide._id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-[2px] transition-all duration-300 ${
                currentSlide === idx ? "w-10 bg-white" : "w-4 bg-white/20"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
