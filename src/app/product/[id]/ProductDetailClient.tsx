"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/models/Product";
import MagnifyingGlass from "@/components/MagnifyingGlass";
import { getTransformedImage } from "@/utils/imagekit";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Minus, ShieldCheck, RefreshCw, Truck, ChevronDown, ChevronUp } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { checkUserSession, postReview } from "@/app/actions";

interface ProductDetailClientProps {
  product: IProduct;
  relatedProducts: IProduct[];
  adminPhone: string;
  initialReviews: any[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  adminPhone,
  initialReviews,
}: ProductDetailClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL" | "XXL" | "">("");
  const [quantity, setQuantity] = useState(1);
  
  // Accordion toggle states
  const [specsOpen, setSpecsOpen] = useState(true);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const [reviews, setReviews] = useState(initialReviews);
  const [user, setUser] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const u = await checkUserSession();
      setUser(u);
    };
    fetchUser();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    setSubmittingReview(true);
    try {
      const res = await postReview(product._id, rating, comment);
      if (res.success) {
        setReviewSuccess(true);
        setComment("");
        setRating(5);
      } else {
        setReviewError(res.error || "Failed to submit review.");
      }
    } catch {
      setReviewError("Server error.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const images = product.images?.length > 0 ? product.images : [""];
  const activeImage = images[activeImageIdx];

  // Find stock for selected size
  const selectedSizeInfo = product.sizes.find((s) => s.size === selectedSize);
  const maxStock = selectedSizeInfo ? selectedSizeInfo.stock : 0;

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addItem(
      {
        _id: product._id,
        title: product.title,
        price: product.sellingPrice,
        size: selectedSize,
        image: images[0] || "",
        maxStock: maxStock,
      },
      quantity
    );

    // Open side drawer
    setCartOpen(true);
  };

  const handleWhatsAppOrder = () => {
    if (!selectedSize) return;
    const phone = adminPhone.replace(/[^0-9+]/g, ""); // clean non-digit chars
    const text = encodeURIComponent(
      `I wish to purchase ${product.title} - Size: ${selectedSize} - Qty: ${quantity}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Back to catalog path */}
      <div className="mb-8 text-xs font-display tracking-widest text-white/45">
        <Link href="/shop" className="hover:text-white transition-colors">
          SHOP
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white/80">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Visual Board */}
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
          {/* Active Viewport with Magnifier */}
          <div className="flex-1">
            <MagnifyingGlass src={activeImage} alt={product.title} />
          </div>

          {/* Asset Step Nodes (Carousel list) */}
          {images.length > 1 && (
            <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-3 flex-shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative h-20 w-16 bg-card-dark border overflow-hidden flex-shrink-0 transition-all ${
                    activeImageIdx === idx ? "border-white" : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={getTransformedImage(img, 100, 133)}
                    alt={`${product.title} Thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Data Desk */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          {/* Title & Price */}
          <div className="space-y-4">
            <span className="font-display text-xs text-white/45 tracking-widest uppercase">
              {product.specs?.brand || "PREMIUM BLVCK LABELS"}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-widest-luxury text-white">
              {product.title}
            </h1>
            <div className="flex items-center space-x-4 pt-1">
              <span className="font-body text-base text-white/40 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
              <span className="font-body text-xl font-black text-white">
                ₹{product.sellingPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="font-body text-xs text-white/70 leading-relaxed">
            {product.description}
          </p>

          {/* Size Matrix Nodes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-display tracking-widest">
              <span className="text-white">SELECT SIZE</span>
              <span className="text-white/45">
                {selectedSize
                  ? maxStock > 0
                    ? `IN STOCK: ${maxStock}`
                    : "OUT OF STOCK"
                  : "SELECT SIZE IN MATRIX"}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {product.sizes.map((s) => {
                const isOutOfStock = s.stock === 0;
                const isSelected = selectedSize === s.size;
                return (
                  <button
                    key={s.size}
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSelectedSize(s.size);
                      setQuantity(1); // Reset qty when size changes
                    }}
                    className={`h-12 w-16 text-xs font-display flex items-center justify-center border transition-all ${
                      isOutOfStock
                        ? "border-white/5 text-white/20 cursor-not-allowed line-through bg-neutral-900/50"
                        : isSelected
                        ? "border-white bg-white text-black font-black"
                        : "border-white/10 text-white hover:border-white/30"
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <h4 className="font-display text-xs text-white tracking-widest">
              QUANTITY
            </h4>
            <div className="flex items-center border border-white/10 bg-black w-32 justify-between">
              <button
                disabled={!selectedSize || quantity <= 1}
                onClick={() => setQuantity((q) => q - 1)}
                className="p-3 text-white/60 hover:text-white transition-colors disabled:opacity-30"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4.5 w-4.5" />
              </button>
              <span className="text-sm font-body text-white font-bold">{quantity}</span>
              <button
                disabled={!selectedSize || quantity >= maxStock}
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-white/60 hover:text-white transition-colors disabled:opacity-30"
                aria-label="Increase quantity"
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {/* Add to Cart */}
            <button
              disabled={!selectedSize}
              onClick={handleAddToCart}
              className={`w-full font-display text-xs py-4.5 tracking-widest font-black transition-all rounded-none uppercase ${
                selectedSize
                  ? "bg-white text-black hover:bg-white/80 cursor-pointer"
                  : "bg-neutral-800 text-neutral-500 border border-neutral-700/10 cursor-not-allowed"
              }`}
            >
              {!selectedSize ? "CHOOSE A SIZE" : "ADD TO BAG"}
            </button>

            {/* Order via WhatsApp */}
            <button
              disabled={!selectedSize}
              onClick={handleWhatsAppOrder}
              className={`w-full font-display text-xs py-4.5 tracking-widest font-black transition-all border rounded-none uppercase flex items-center justify-center space-x-2 ${
                selectedSize
                  ? "border-green-600/40 text-green-500 hover:bg-green-500/5 hover:border-green-500 cursor-pointer"
                  : "border-neutral-800/10 text-neutral-600 cursor-not-allowed"
              }`}
            >
              <span>ORDER VIA WHATSAPP</span>
            </button>
          </div>

          {/* Specifications Accordion Array */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            {/* Specifications Tab */}
            <div className="border-b border-white/5 pb-4">
              <button
                onClick={() => setSpecsOpen(!specsOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-display text-xs tracking-widest text-white">
                  PRODUCT SPECIFICATIONS
                </span>
                {specsOpen ? (
                  <ChevronUp className="h-4 w-4 text-white/40" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-white/40" />
                )}
              </button>

              {specsOpen && (
                <div className="pt-4 text-xs font-body text-white/60 space-y-2.5 animate-fadeIn">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="uppercase text-white/40">BRAND</span>
                    <span className="text-white">{product.specs?.brand}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="uppercase text-white/40">TYPE</span>
                    <span className="text-white">{product.specs?.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="uppercase text-white/40">SLEEVE</span>
                    <span className="text-white">{product.specs?.sleeve}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="uppercase text-white/40">FIT</span>
                    <span className="text-white">{product.specs?.fit}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="uppercase text-white/40">FABRIC</span>
                    <span className="text-white">{product.specs?.fabric}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="uppercase text-white/40">PATTERN</span>
                    <span className="text-white">{product.specs?.pattern}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Logistics & Delivery Tab */}
            <div className="border-b border-white/5 pb-4">
              <button
                onClick={() => setDeliveryOpen(!deliveryOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-display text-xs tracking-widest text-white">
                  LOGISTICS & DELIVERY
                </span>
                {deliveryOpen ? (
                  <ChevronUp className="h-4 w-4 text-white/40" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-white/40" />
                )}
              </button>

              {deliveryOpen && (
                <div className="pt-4 text-xs font-body text-white/60 space-y-3.5 animate-fadeIn">
                  <div className="flex items-start space-x-3">
                    <Truck className="h-4 w-4 text-white flex-shrink-0" />
                    <div>
                      <h5 className="font-display text-xs text-white tracking-widest">
                        FREE SHIPPING COD
                      </h5>
                      <p className="text-xs text-white/40 mt-0.5">
                        Free delivery on Cash on Delivery orders. Dispatched in 24 hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RefreshCw className="h-4 w-4 text-white flex-shrink-0" />
                    <div>
                      <h5 className="font-display text-xs text-white tracking-widest">
                        RETURNS POLICY
                      </h5>
                      <p className="text-xs text-white/40 mt-0.5">
                        7-day hassle-free size replacements and carbon shadow exchanges.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ShieldCheck className="h-4 w-4 text-white flex-shrink-0" />
                    <div>
                      <h5 className="font-display text-xs text-white tracking-widest">
                        PREMIUM QUALITY ASSURED
                      </h5>
                      <p className="text-xs text-white/40 mt-0.5">
                        Double checked seams and matte preservation coatings tested for 100+ wash cycles.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-24 border-t border-white/10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Reviews List */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-1 mb-8">
              <span className="font-display text-[10px] text-white/40 tracking-widest uppercase">
                CUSTOMER FEEDBACK
              </span>
              <h3 className="font-display text-xl font-black tracking-widest-luxury text-white">
                REVIEWS ({reviews.length})
              </h3>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-white/45 font-body">
                No reviews yet for this product. Be the first to share your thoughts.
              </p>
            ) : (
              <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin">
                {reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-white/5 pb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-display tracking-widest text-white uppercase font-black">
                        {rev.userName}
                      </span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < rev.rating ? "text-white" : "text-white/20"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-white/60 font-body leading-relaxed">
                      {rev.comment}
                    </p>
                    <div className="text-[10px] text-white/30 font-body">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Write Review Form */}
          <div className="lg:col-span-5 border border-white/10 p-8 bg-neutral-950/40">
            <div className="space-y-1 mb-6">
              <span className="font-display text-[10px] text-white/40 tracking-widest uppercase">
                SHARE YOUR EXPERIENCE
              </span>
              <h3 className="font-display text-sm font-black tracking-widest text-white uppercase">
                WRITE A REVIEW
              </h3>
            </div>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                {reviewError && (
                  <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2">
                    {reviewError}
                  </p>
                )}

                {/* Rating stars selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-display tracking-widest text-white/50 uppercase block">
                    Rating
                  </label>
                  <div className="flex space-x-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-xl focus:outline-hidden transition-transform active:scale-95 hover:scale-110"
                      >
                        <span className={star <= rating ? "text-white" : "text-white/20"}>★</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">
                    Review Description
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30 resize-none font-body"
                    placeholder="Describe your experience with this matte drop..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full border border-white/20 bg-white/5 py-3 text-[10px] text-white hover:bg-white/10 transition-colors uppercase tracking-widest font-display font-black disabled:opacity-30 cursor-pointer"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <p className="text-xs text-white/40 font-body">
                  Please sign in to provide a review for this product.
                </p>
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent(`/product/${product._id}`)}`}
                  className="inline-block border border-white/20 bg-white/5 px-6 py-3 text-[10px] text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest font-display font-black rounded-none cursor-pointer"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Review Success Popup Modal */}
      {reviewSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs px-4">
          <div className="bg-neutral-950 border border-white/10 p-8 max-w-sm w-full text-center space-y-6 animate-fadeIn">
            <div className="mx-auto w-12 h-12 border border-white/20 flex items-center justify-center text-white text-lg font-bold">
              ✓
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-sm tracking-widest text-white uppercase font-black">
                REVIEW SUBMITTED
              </h3>
              <p className="text-xs text-white/50 leading-relaxed font-body">
                Thankyou for providing your valuable review.
              </p>
            </div>
            <button
              onClick={() => setReviewSuccess(false)}
              className="w-full bg-white text-black font-display font-black text-[10px] tracking-widest py-3 uppercase hover:bg-white/80 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Recommendation Row */}
      {relatedProducts.length > 0 && (
        <section className="mt-28 border-t border-white/10 pt-20">
          <div className="space-y-2 mb-12">
            <span className="font-display text-xs text-white/40 tracking-widest">
              MATCHING SILHOUETTES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-widest-luxury text-white">
              RELATED MATTE DROPS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
