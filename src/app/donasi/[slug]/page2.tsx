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
import { FiCalendar, FiTag } from "react-icons/fi";
import { notFound } from "next/navigation";
import PublicDonationForm from "@/features/donations/PublicDonationForm";
import ShareButtons from "../../articles/[slug]/ShareButtons";
import PublicNavbar from "@/components/layouts/PublicNavbar";

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
      title: "Program Donasi Tidak Ditemukan",
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
    title: `${post.post_title} - Donasi Markaz Al-Hijrah`,
    description: post.post_excerpt || post.post_title,
    openGraph: {
      title: post.post_title,
      description: post.post_excerpt || post.post_title,
      url: `${baseUrl}/donasi/${slug}`,
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

export default async function DonationDetailPage({
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

      <main className="pt-8 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Column: Content */}
            <div className="lg:w-2/3">
              <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Featured Image */}
                {post.post_image && (
                  <div className="relative w-full aspect-video bg-gray-100">
                    <Image
                      src={post.post_image}
                      alt={post.post_title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="p-6 md:p-10">
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                    {post.category && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 text-brand-brown rounded-full font-bold">
                        <FiTag size={14} />
                        {post.category.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                      <FiCalendar size={14} />
                      {post.date
                        ? new Date(post.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                    {post.post_title}
                  </h1>

                  {/* Excerpt */}
                  {post.post_excerpt && (
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border-l-4 border-brand-gold">
                      <p className="text-lg text-gray-700 italic leading-relaxed">
                        &ldquo;{post.post_excerpt}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Content */}
                  <div
                    className="prose prose-lg max-w-none prose-gray
                      prose-headings:text-gray-900 prose-headings:font-bold
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-a:text-brand-brown prose-a:font-semibold prose-a:underline decoration-brand-gold/30 hover:decoration-brand-gold transition-all
                      prose-strong:text-gray-900
                      prose-img:rounded-2xl prose-img:shadow-md
                      prose-blockquote:border-brand-gold prose-blockquote:text-gray-800 prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl"
                    dangerouslySetInnerHTML={{ __html: post.post_content }}
                  />

                  {/* Share Buttons */}
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <p className="font-bold text-gray-900">
                        Bagikan Program Kebaikan Ini:
                      </p>
                      <ShareButtons title={post.post_title} />
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Right Column: Sticky Donation Form */}
            <div className="lg:w-1/3">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all hover:shadow-2xl">
                  <div className="bg-gradient-to-r from-brand-brown to-gray-800 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">Infaq & Sedekah</h3>
                    <p className="text-sm text-gray-300">
                      Salurkan bantuan Anda untuk program ini
                    </p>
                  </div>

                  <div id="donation-form" className="p-1">
                    <PublicDonationForm account={post?.account} />
                  </div>

                  <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                        >
                          <div className="w-full h-full bg-brand-gold/20 flex items-center justify-center text-[10px] font-bold text-brand-brown">
                            User
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      Bergabunglah bersama donatur lainnya
                    </p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-around gap-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      Aman
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      Transparan
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      Terpercaya
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Donate Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
        <a
          href="#donation-form"
          className="block w-full py-4 bg-brand-gold text-brand-brown text-center font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        >
          Donasi Sekarang
        </a>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Markaz Al-Hijrah. Berkhidmat Untuk
            Ummat.
          </p>
        </div>
      </footer>
    </div>
  );
}
