import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getBlogs } from "../actions";
import { getTransformedImage } from "@/utils/imagekit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorials & Research | BLVCK",
  description: "Read the latest essays, physical tests, and design reflections from the BLVCK developmental labs.",
};

export const revalidate = 0; // Prevent Next.js from caching editorials updates

export default async function BlogListPage() {
  const posts = await getBlogs();

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="bg-black text-white flex-1 min-h-[70vh] font-body">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-white/10 pb-8 mb-12">
            <span className="font-display text-xs text-white/45 tracking-widest">
              LAB WRITE-UPS
            </span>
            <h1 className="font-display text-4xl font-black tracking-widest-luxury text-white mt-1">
              THE EDITORIALS
            </h1>
          </div>

          {posts.length === 0 ? (
            <div className="py-24 text-center border border-white/5 bg-card-dark">
              <p className="font-display text-white/40 text-xs tracking-widest uppercase">
                NO EDITORIALS PUBLISHED YET.
              </p>
            </div>
          ) : (
            /* 3x3 Editorial Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col w-full bg-card-dark border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/20"
                >
                  {/* Visual Cover image */}
                  <div className="relative aspect-[16/10] w-full bg-card-light overflow-hidden">
                    <Image
                      src={getTransformedImage(post.featuredImage, 600, 375)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  </div>

                  {/* Text Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-card-dark">
                    <div className="space-y-2">
                      <span className="font-display text-xs text-white/40 tracking-wider">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <h2 className="font-display text-lg tracking-widest text-white group-hover:text-white/80 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-white/50 text-xs leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <span className="font-display text-xs tracking-widest text-white border-b border-white pb-0.5 self-start group-hover:text-white/80 group-hover:border-white/80 transition-colors mt-4">
                      READ ESSAY
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
