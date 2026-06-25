import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ShopClient from "./ShopClient";
import { getProducts, getCategories } from "../actions";
import { Suspense } from "react";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    gender?: string;
    size?: string;
    page?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export const revalidate = 0; // Prevent Next.js from caching catalog results

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const currentCategory = params.category || "";
  const currentGender = params.gender || "";
  const currentSize = params.size || "";
  const currentSearch = params.search || "";
  const currentMinPrice = params.minPrice || "499";
  const currentMaxPrice = params.maxPrice || "4999";
  const currentSort = params.sort || "newest";

  // Query database with filters
  const { products, totalPages } = await getProducts({
    category: currentCategory,
    gender: currentGender,
    size: currentSize,
    search: currentSearch,
    minPrice: currentMinPrice !== "499" ? currentMinPrice : undefined,
    maxPrice: currentMaxPrice !== "4999" ? currentMaxPrice : undefined,
    sort: currentSort,
    page: currentPage,
    limit: 12,
  });

  const categories = await getCategories();

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="bg-black text-white flex-1 min-h-[60vh]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
              <div className="animate-pulse font-display text-xs text-white/50 tracking-widest uppercase">
                LOADING APPAREL CATALOG...
              </div>
            </div>
          }
        >
          <ShopClient
            products={products}
            categories={categories}
            totalPages={totalPages}
            currentPage={currentPage}
            currentGender={currentGender}
            currentCategory={currentCategory}
            currentSize={currentSize}
            currentSearch={currentSearch}
            currentMinPrice={currentMinPrice}
            currentMaxPrice={currentMaxPrice}
            currentSort={currentSort}
          />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
