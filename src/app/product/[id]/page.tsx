import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductDetailClient from "./ProductDetailClient";
import { getProductById, getRelatedProducts, getSetting } from "@/app/actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 0; // Prevent Next.js from caching detail page results

// Dynamic SEO tags
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);
  if (!product) {
    return {
      title: "Product Not Found | BLVCK",
    };
  }

  return {
    title: `${product.title} | BLVCK`,
    description: product.description,
    openGraph: {
      title: `${product.title} | BLVCK`,
      description: product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  // Fetch related drops (same category)
  const relatedProducts = await getRelatedProducts(product.category._id || product.category, product._id);

  // Fetch administrator contacts for WhatsApp queries
  const contactCMS = await getSetting("contacts_cms");
  const adminPhone = contactCMS?.phone || "+919876543210";

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="bg-black text-white flex-1 min-h-[80vh]">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
          adminPhone={adminPhone}
        />
      </main>

      <Footer />
    </>
  );
}
