import { Post } from "@/types/admins/articles/postType";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";

// Helper helper get data from API (SSR)
async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}${apiUrl.posts}/slug/${slug}`,
      {
        cache: "no-store", // SSR: always fetch fresh data
      }
    );

    if (!res.ok) return null;

    const json = (await res.json()) as BaseApiResponse<Post>;
    return json.data || null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { FiArrowLeft, FiCalendar, FiTag } from "react-icons/fi";
import { notFound } from "next/navigation";

// Generate Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: `${post.post_title} - Markaz Al-Hijrah`,
    description: post.post_excerpt || post.post_title,
    openGraph: {
      title: post.post_title,
      description: post.post_excerpt || post.post_title,
      url: `/articles/${slug}`,
      siteName: "Markaz Al-Hijrah",
      locale: "id_ID",
      images: post.post_image ? [post.post_image] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.post_title,
      description: post.post_excerpt || post.post_title,
      images: post.post_image ? [post.post_image] : [],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Article Content */}
      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8 animate-fade-in-up">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-blue font-medium transition-colors"
              >
                <FiArrowLeft /> Kembali ke Artikel
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up delay-100">
              {/* Article Header & Body */}
              <div className="p-8 md:p-12">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                  {post.category && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-brand-blue rounded-full font-semibold">
                      <FiTag size={14} />
                      {post.category.name}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FiCalendar size={14} />
                    {new Date(post.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.post_title}
                </h1>

                {/* Featured Image */}
                {post.post_image && (
                  <div className="relative w-full h-[500px] mb-8 bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={post.post_image}
                      alt={post.post_title}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                )}

                {/* Excerpt */}
                {post.post_excerpt && (
                  <p className="text-xl text-gray-900 mb-8 leading-relaxed border-l-4 border-brand-gold pl-6 italic font-semibold">
                    {post.post_excerpt}
                  </p>
                )}

                {/* Content */}
                <div
                  className="prose prose-lg max-w-none prose-gray
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-p:text-gray-900 prose-p:leading-relaxed
                    prose-a:text-brand-blue prose-a:no-underline hover:prose-a:text-brand-gold hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-li:text-gray-900
                    prose-img:rounded-xl prose-img:shadow-lg
                    prose-blockquote:border-brand-gold prose-blockquote:text-gray-800 prose-blockquote:italic"
                  dangerouslySetInnerHTML={{ __html: post.post_content }}
                />
              </div>
            </div>

            {/* Share & Actions - Static Version to remove framer-motion client dependency */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-md animate-fade-in-up delay-200">
              <p className="text-gray-600 font-medium">Bagikan artikel ini:</p>
              <div className="flex gap-3">
                {/* Share buttons will need to be client components if they use window.location,
                    but simple links work for SSR if we construct URL server side or use a client wrapper.
                    For now keeping simple links but note window is not available in SSR.
                    We'll use a client component wrapper for sharing if needed, or simple links.
                 */}
                {/* Note: window.location is not available in SSR. We should use a Client Component for Share Buttons. */}
                {/* For simplicity in this step, I'll remove the share buttons logic that depends on window and add it back via a Client Component later if requested,
                     or just use '#' for now to prevent build errors. OR better, create a client component for ShareButtons.
                 */}
                <ShareButtons title={post.post_title} />
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Markaz Al-Hijrah. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Client Component for Share Buttons
import ShareButtons from "./ShareButtons";
