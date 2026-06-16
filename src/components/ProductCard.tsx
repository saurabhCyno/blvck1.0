"use client";

import Link from "next/link";
import Image from "next/image";
import { IProduct } from "@/models/Product";
import { getTransformedImage } from "@/utils/imagekit";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0] || "";
  const secondaryImage = product.images?.[1] || primaryImage;

  return (
    <Link
      href={`/product/${product._id}`}
      className="group flex flex-col w-full bg-card border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/20"
    >
      {/* Visual Canvas Viewport */}
      <div className="relative aspect-[3/4] w-full bg-card-light overflow-hidden">
        {/* Primary Product Photo */}
        <Image
          src={getTransformedImage(primaryImage, 400, 533)}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
        />

        {/* Alternate Product Photo on Hover */}
        {secondaryImage && (
          <Image
            src={getTransformedImage(secondaryImage, 400, 533)}
            alt={`${product.title} Alternate`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover absolute inset-0 scale-105 transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-100"
          />
        )}

        {/* Gender Badge Tag */}
        <div className="absolute top-3 left-3 bg-black/85 border border-white/10 px-2.5 py-0.5">
          <span className="font-display text-xs tracking-widest text-white/70">
            {product.gender.toUpperCase()}
          </span>
        </div>

        {/* Bestseller Badge */}
        {product.isBestseller && (
          <div className="absolute top-3 right-3 bg-white text-black px-2 py-0.5">
            <span className="font-display text-xs font-black tracking-widest">
              BESTSELLER
            </span>
          </div>
        )}
      </div>

      {/* Info Desk */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-card-dark">
        <div className="space-y-1">
          <h3 className="font-display text-sm tracking-widest text-white group-hover:text-white/80 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="font-body text-xs text-white/40 uppercase tracking-widest">
            {product.specs?.type || "APPAREL LABEL"}
          </p>
        </div>

        {/* Pricing Row */}
        <div className="flex items-center space-x-3 pt-1">
          <span className="font-body text-xs text-white/40 line-through">
            ₹{product.originalPrice.toFixed(2)}
          </span>
          <span className="font-body text-xs font-black text-white">
            ₹{product.sellingPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
