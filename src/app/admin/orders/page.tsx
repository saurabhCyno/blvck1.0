import { adminGetOrders } from "@/app/actions";
import OrdersClient from "./OrdersClient";

export const revalidate = 0; // Ensure admin orders load fresh metrics

export default async function AdminOrdersPage() {
  const orders = await adminGetOrders();

  return <OrdersClient initialOrders={orders} />;
}
