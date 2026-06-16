import { getCategories } from "@/app/actions";
import CategoryClient from "./CategoryClient";

export const revalidate = 0; // Ensure admin categories load fresh metrics

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <CategoryClient initialCategories={categories} />;
}
