import { adminGetOrders, getProducts, getCategories } from "@/app/actions";
import OrdersClient from "./OrdersClient";

export const revalidate = 0; // Ensure admin orders load fresh metrics

export default async function AdminOrdersPage() {
  const orders = await adminGetOrders();
  const { products } = await getProducts({ limit: 100 });
  const categories = await getCategories();

  return <OrdersClient initialOrders={orders} products={products} categories={categories} />;
}
