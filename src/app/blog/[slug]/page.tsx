import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Markdown from "@/components/Markdown";
import { getBlogBySlug } from "../../actions";
import { getTransformedImage } from "@/utils/imagekit";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0; // Prevent Next.js from caching blog readers

// Dynamic metadata
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogBySlug(resolvedParams.slug);
  if (!post) {
    return {
      title: "Essay Not Found | BLVCK CORE",
    };
  }

  return {
    title: `${post.title} | BLVCK CORE`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | BLVCK CORE`,
      description: post.excerpt,
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getBlogBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="bg-black text-white flex-1 min-h-[80vh] font-body py-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Breadcrumbs */}
          <div className="mb-8 text-xs font-display tracking-widest text-white/45">
            <Link href="/blog" className="hover:text-white transition-colors">
              EDITORIALS
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{post.title}</span>
          </div>

          {/* Heading block */}
          <div className="space-y-4 mb-10">
            <span className="font-display text-xs text-white/45 tracking-widest block">
              PUBLISHED / {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-black tracking-widest-luxury text-white leading-tight">
              {post.title}
            </h1>
            <p className="text-white/60 text-sm leading-relaxed border-l-2 border-white/20 pl-4 italic">
              {post.excerpt}
            </p>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative aspect-[16/9] w-full bg-card-light overflow-hidden border border-white/10 mb-12">
              <Image
                src={getTransformedImage(post.featuredImage, 1200, 675)}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Rich Markdown content */}
          <div className="border-t border-white/10 pt-10">
            <Markdown content={post.content} className="max-w-none text-white/70" />
          </div>

          {/* Bottom Back Button */}
          <div className="border-t border-white/10 mt-16 pt-8 text-center">
            <Link
              href="/blog"
              className="font-display text-xs border border-white/20 px-8 py-4.5 tracking-widest text-white hover:bg-white hover:text-black hover:border-white transition-all font-black inline-block"
            >
              RETURN TO ESSAYS
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
