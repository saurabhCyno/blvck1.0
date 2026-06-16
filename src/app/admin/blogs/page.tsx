import { getBlogs } from "@/app/actions";
import BlogsClient from "./BlogsClient";

export const revalidate = 0;

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();
  return <BlogsClient initialBlogs={blogs} />;
}
