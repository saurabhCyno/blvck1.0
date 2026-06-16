"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { getTransformedImage } from "@/utils/imagekit";

interface MagnifyingGlassProps {
  src: string;
  alt: string;
}

export default function MagnifyingGlass({ src, alt }: MagnifyingGlassProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setImgSize] = useState([0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setImgSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();

    // Calculate mouse position relative to the image
    const mouseX = e.pageX - left - window.scrollX;
    const mouseY = e.pageY - top - window.scrollY;

    setXY([mouseX, mouseY]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // Dimensions of the magnifier window
  const magnifierHeight = 200;
  const magnifierWidth = 200;
  const zoomLevel = 2.2;

  // Optimized high-quality image URL for zooming
  const highQualitySrc = getTransformedImage(src, 1200, 1600);
  const normalSrc = getTransformedImage(src, 600, 800);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full h-[600px] bg-card-dark cursor-zoom-in border border-white/5"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={normalSrc}
        alt={alt}
        fill
        className="object-cover transition-opacity duration-300 select-none"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />

      {/* Magnifier Window Overlay - Only visible on desktop/hover */}
      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            // Center the magnifier on the cursor position
            top: `${y - magnifierHeight / 2}px`,
            left: `${x - magnifierWidth / 2}px`,
            opacity: 1,
            border: "1.5px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
            backgroundImage: `url('${highQualitySrc}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            // Shift background position based on relative position
            backgroundPosition: `${-x * zoomLevel + magnifierWidth / 2}px ${
              -y * zoomLevel + magnifierHeight / 2
            }px`,
            backgroundColor: "#0B0B0B",
            borderRadius: "0px", // Strict Avant-Garde Minimalist straight angles
          }}
          className="hidden md:block z-10"
        />
      )}
    </div>
  );
}
