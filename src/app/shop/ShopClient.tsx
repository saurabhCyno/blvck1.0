"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Filter, X, ChevronRight, RotateCcw } from "lucide-react";

interface ShopClientProps {
  products: any[];
  categories: any[];
  totalPages: number;
  currentPage: number;
  currentGender?: string;
  currentCategory?: string;
  currentSize?: string;
  currentSearch?: string;
}

export default function ShopClient({
  products,
  categories,
  totalPages,
  currentPage,
  currentGender = "",
  currentCategory = "",
  currentSize = "",
  currentSearch = "",
}: ShopClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Helper to update search params
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page on filter update
    params.set("page", "1");

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(currentSearch ? "/shop" : "/shop");
  };

  const sizes: ("S" | "M" | "L" | "XL" | "XXL")[] = ["S", "M", "L", "XL", "XXL"];
  const genders = ["Men", "Women", "Unisex"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="border-b border-white/10 pb-8 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-1">
          <span className="font-display text-xs text-white/45 tracking-widest">
            {currentSearch ? "SEARCH RESULTS" : "COUTURE DIVISION"}
          </span>
          <h1 className="font-display text-4xl font-black tracking-widest-luxury text-white">
            {currentSearch ? `"${currentSearch.toUpperCase()}"` : "THE CATALOG"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex md:hidden items-center space-x-2 border border-white/20 px-4 py-2 text-xs font-display tracking-widest hover:border-white transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>FILTERS</span>
          </button>

          {(currentGender || currentCategory || currentSize || currentSearch) && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 text-white/45 hover:text-white text-xs font-display tracking-widest transition-colors uppercase"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>CLEAR FILTERS</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-10">
        {/* Desktop Left Fixed Filters Panel */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-10">
          {/* Search */}
          <div className="space-y-4">
            <h3 className="font-display text-xs text-white tracking-widest font-black uppercase">
              SEARCH
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem("search") as HTMLInputElement;
                updateFilter("search", input.value.trim());
              }}
            >
              <div className="flex border border-white/10 focus-within:border-white/30 transition-colors">
                <input
                  name="search"
                  type="text"
                  defaultValue={currentSearch}
                  placeholder="TYPE HERE..."
                  className="w-full bg-transparent text-white font-display text-xs tracking-widest px-3 py-2.5 outline-none placeholder:text-white/20"
                />
                <button
                  type="submit"
                  className="px-3 text-white/30 hover:text-white transition-colors flex items-center"
                  aria-label="Search"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-display text-xs text-white tracking-widest font-black uppercase">
              CATEGORIES
            </h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => updateFilter("category", "")}
                className={`text-left text-xs font-body tracking-wider transition-colors hover:text-white uppercase ${
                  !currentCategory ? "text-white font-bold" : "text-white/40"
                }`}
              >
                ALL CATEGORIES
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter("category", cat._id)}
                  className={`text-left text-xs font-body tracking-wider transition-colors hover:text-white uppercase ${
                    currentCategory === cat._id ? "text-white font-bold" : "text-white/40"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-4">
            <h3 className="font-display text-xs text-white tracking-widest font-black uppercase">
              GENDER
            </h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => updateFilter("gender", "")}
                className={`text-left text-xs font-body tracking-wider transition-colors hover:text-white uppercase ${
                  !currentGender ? "text-white font-bold" : "text-white/40"
                }`}
              >
                ALL GENDERS
              </button>
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => updateFilter("gender", g)}
                  className={`text-left text-xs font-body tracking-wider transition-colors hover:text-white uppercase ${
                    currentGender === g ? "text-white font-bold" : "text-white/40"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <h3 className="font-display text-xs text-white tracking-widest font-black uppercase">
              SIZES
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => updateFilter("size", currentSize === size ? "" : size)}
                  className={`border text-xs font-body flex items-center justify-center h-8 transition-all ${
                    currentSize === size
                      ? "border-white bg-white text-black font-black"
                      : "border-white/10 text-white/50 hover:border-white/30"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid & Pagination */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="py-24 text-center border border-white/5 bg-card-dark flex flex-col items-center justify-center space-y-4">
              <p className="font-display text-white/40 text-sm tracking-widest uppercase">
                NO PRODUCTS MATCH THESE CRITERIA.
              </p>
              <button
                onClick={clearFilters}
                className="font-display text-xs border border-white/20 px-6 py-3 text-white hover:border-white transition-colors"
              >
                RESET CATALOG
              </button>
            </div>
          ) : (
            <>
              {/* Responsive 3x3 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Wrapper */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-16 pt-8 border-t border-white/10">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set("page", p.toString());
                        router.push(`/shop?${params.toString()}`);
                      }}
                      className={`h-10 w-10 text-xs font-display flex items-center justify-center border transition-all ${
                        currentPage === p
                          ? "border-white bg-white text-black font-bold"
                          : "border-white/10 text-white/40 hover:border-white/30"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer (Bottom Sheet Overlay) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Bottom Drawer */}
          <div className="relative bg-card-dark border-t border-white/10 w-full max-h-[80vh] overflow-y-auto z-10 p-6 flex flex-col space-y-8 rounded-t-none">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-white text-lg tracking-widest font-black">
                FILTER PRODUCTS
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search */}
            <div className="space-y-3">
              <h3 className="font-display text-xs text-white/45 tracking-widest font-black uppercase">
                SEARCH
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.elements.namedItem("search-mobile") as HTMLInputElement;
                  updateFilter("search", input.value.trim());
                  setMobileFiltersOpen(false);
                }}
              >
                <div className="flex border border-white/10 focus-within:border-white/30 transition-colors">
                  <input
                    name="search-mobile"
                    type="text"
                    defaultValue={currentSearch}
                    placeholder="TYPE HERE..."
                    className="w-full bg-transparent text-white font-display text-xs tracking-widest px-3 py-2.5 outline-none placeholder:text-white/20"
                  />
                  <button
                    type="submit"
                    className="px-3 text-white/30 hover:text-white transition-colors flex items-center"
                    aria-label="Search"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="font-display text-xs text-white/45 tracking-widest font-black uppercase">
                CATEGORIES
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter("category", "")}
                  className={`text-xs font-body px-3 py-1.5 border uppercase ${
                    !currentCategory
                      ? "border-white bg-white text-black font-black"
                      : "border-white/10 text-white/50"
                  }`}
                >
                  ALL
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateFilter("category", cat._id)}
                    className={`text-xs font-body px-3 py-1.5 border uppercase ${
                      currentCategory === cat._id
                        ? "border-white bg-white text-black font-black"
                        : "border-white/10 text-white/50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Genders */}
            <div className="space-y-3">
              <h3 className="font-display text-xs text-white/45 tracking-widest font-black uppercase">
                GENDERS
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter("gender", "")}
                  className={`text-xs font-body px-3 py-1.5 border uppercase ${
                    !currentGender
                      ? "border-white bg-white text-black font-black"
                      : "border-white/10 text-white/50"
                  }`}
                >
                  ALL
                </button>
                {genders.map((g) => (
                  <button
                    key={g}
                    onClick={() => updateFilter("gender", g)}
                    className={`text-xs font-body px-3 py-1.5 border uppercase ${
                      currentGender === g
                        ? "border-white bg-white text-black font-black"
                        : "border-white/10 text-white/50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <h3 className="font-display text-xs text-white/45 tracking-widest font-black uppercase">
                SIZES
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => updateFilter("size", currentSize === size ? "" : size)}
                    className={`border text-xs font-body flex items-center justify-center h-10 transition-all ${
                      currentSize === size
                        ? "border-white bg-white text-black font-black"
                        : "border-white/10 text-white/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full text-center bg-white text-black font-display font-black text-xs py-4 tracking-widest hover:bg-white/80 transition-colors uppercase"
            >
              APPLY FILTERS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
