import { getProducts, getCategories } from "@/app/actions";
import ProductsClient from "./ProductsClient";

export const revalidate = 0; // Ensure admin inventory levels load fresh

export default async function AdminProductsPage() {
  const { products } = await getProducts({ limit: 100 });
  const categories = await getCategories();

  return <ProductsClient initialProducts={products} categories={categories} />;
}
