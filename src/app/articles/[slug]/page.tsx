import { Post } from "@/types/admins/articles/postType";
import { postService } from "@/lib/postService";
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { cache } from "react";

// Helper helper get data from database directly (SSR)
// Wrapped in cache to prevent double increment (Metadata + Page Component)
const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  return await postService.getPostBySlug(slug);
});

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { FiArrowLeft, FiCalendar, FiTag, FiEye } from "react-icons/fi";

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

  // Convert relative image path to absolute URL for Open Graph
  const getAbsoluteImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return undefined;

    // If already absolute URL, return as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Convert relative path to absolute URL
    return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  const absoluteImageUrl = getAbsoluteImageUrl(post.post_image);

  return {
    metadataBase: new URL(baseUrl),
    title: `${post.post_title} - Markaz Al-Hijrah`,
    description: post.post_excerpt || post.post_title,
    openGraph: {
      title: post.post_title,
      description: post.post_excerpt || post.post_title,
      url: `${baseUrl}/articles/${slug}`,
      siteName: "Markaz Al-Hijrah",
      locale: "id_ID",
      images: absoluteImageUrl
        ? [
            {
              url: absoluteImageUrl,
              width: 1200,
              height: 630,
              alt: post.post_title,
            },
          ]
        : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.post_title,
      description: post.post_excerpt || post.post_title,
      images: absoluteImageUrl ? [absoluteImageUrl] : [],
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
                className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-brown font-medium transition-colors"
              >
                <FiArrowLeft /> Kembali ke Artikel
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up delay-100">
              {/* Article Header & Body */}
              <div className="p-8 md:p-12">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                  {post.post_categories && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-brand-brown rounded-full font-semibold">
                      <FiTag size={14} />
                      {post.post_categories.title}
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
                  <div className="flex items-center gap-2">
                    <FiEye size={14} />
                    {post.count_view || 0} views
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.post_title}
                </h1>

                {/* Featured Image */}
                {post.post_image && (
                  <div className="mb-8 bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={post.post_image}
                      alt={post.post_title}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-auto"
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
                    prose-a:text-brand-brown prose-a:no-underline hover:prose-a:text-brand-gold hover:prose-a:underline
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

      {/* Suggested Articles */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-gray-900">
                Artikel <span className="text-brand-gold">Terkait</span>
              </h2>
              <Link
                href="/articles"
                className="text-brand-brown hover:text-brand-gold font-bold transition-colors"
              >
                Lihat Semua Artikel →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(await postService.getSuggestions(6, post.id)).map((p) => (
                <Link
                  key={p.id}
                  href={`/articles/${p.post_name}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative bg-gray-100 overflow-hidden">
                    {p.post_image ? (
                      <Image
                        src={p.post_image}
                        alt={p.post_title}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-brand-brown text-white text-3xl">
                        📄
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-gold transition-colors line-clamp-2 mb-3">
                      {p.post_title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {p.post_excerpt || "Baca artikel selengkapnya..."}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {new Date(p.created_at || "").toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <span className="text-brand-brown font-bold text-sm">
                        Baca →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

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
