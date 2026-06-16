import { checkUserSession, getUserOrders } from "@/app/actions";
import { redirect } from "next/navigation";
import AccountClient from "./AccountClient";

export const revalidate = 0;

export default async function AccountPage() {
  const user = await checkUserSession();
  if (!user) redirect("/auth/login");

  const orders = await getUserOrders();

  return <AccountClient user={user} initialOrders={orders} />;
}
