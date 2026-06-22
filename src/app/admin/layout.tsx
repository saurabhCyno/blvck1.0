import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrator Dashboard | BLVCK CORE",
  description: "Secure administrative control ecosystem for products, orders, categories, and site CMS.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
