import { Post } from "@/types/admins/articles/postType";
import { postService } from "@/lib/postService";

// Helper helper get data from database directly (SSR)
async function getPostBySlug(slug: string): Promise<Post | null> {
  return await postService.getPostBySlug(slug);
}

import { Metadata } from "next";
import Image from "next/image";
import { FiChevronLeft, FiShare2 } from "react-icons/fi";
import { notFound } from "next/navigation";
import Link from "next/link";
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

const needAmount = 8700000000;
const currentAmount = 826101865;

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
    <div className="min-h-screen bg-white lg:bg-gray-50 pb-32 lg:pb-0">
      {/* Navbar show only on desktop */}
      <div className="hidden lg:block">
        <PublicNavbar withScrolled={false} />
      </div>

      {/* Mobile Sticky Header */}
      <header className="lg:hidden sticky top-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/donasi" className="p-2 -ml-2 text-gray-700">
          <FiChevronLeft size={24} />
        </Link>
        <span className="font-bold text-gray-900 truncate px-4 max-w-[200px]">
          Detail Program
        </span>
        <div className="flex gap-2">
          <button className="p-2 text-gray-700">
            <FiShare2 size={20} />
          </button>
        </div>
      </header>

      <main className="lg:pt-28 lg:pb-20">
        <div className="container mx-auto lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Left Column: Content */}
            <div className="lg:w-2/3">
              <article className="lg:bg-white lg:rounded-3xl lg:shadow-sm lg:border lg:border-gray-100 overflow-hidden">
                {/* Featured Image - Adjusted Aspect Ratio */}
                {post.post_image && (
                  <div className="relative w-full bg-gray-100">
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

                <div className="p-5 md:p-10">
                  {/* Title Mobile First */}
                  <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {post.post_title}
                  </h1>

                  {/* Mobile Progress Stats (Kitabisa Inspiration) */}
                  {post.post_categories?.title === "Program Pembangunan" && (
                    <div className="lg:hidden bg-gray-50 rounded-2xl py-2 px-4 mb-8">
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-xs text-gray-500 font-medium tracking-tight">
                          Terkumpul{" "}
                          <span className="text-gray-900 font-bold">
                            Rp {currentAmount.toLocaleString("id-ID")}
                          </span>{" "}
                          dari{" "}
                          <span className="text-gray-900 font-bold">
                            Rp {needAmount.toLocaleString("id-ID")}
                          </span>
                        </p>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full px-4 flex items-center justify-center bg-brand-gold rounded-full font-semibold text-sm transition-all duration-1000"
                          style={{
                            width: `${Math.min(
                              (currentAmount / needAmount) * 100,
                              100,
                            )}%`,
                          }}
                        >
                          {Math.round((currentAmount / needAmount) * 100)}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Excerpt */}
                  {post.post_excerpt && (
                    <div className="bg-brand-gold/5 rounded-2xl p-5 mb-8 border-l-4 border-brand-gold">
                      <p className="text-base md:text-lg italic leading-relaxed text-gray-700">
                        &ldquo;{post.post_excerpt}&rdquo;
                      </p>
                    </div>
                  )}
                  {/* Content */}
                  <div
                    className="prose prose-sm md:prose-lg max-w-none prose-gray
                      prose-headings:text-gray-900 prose-headings:font-extrabold
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-a:text-brand-brown prose-a:font-semibold
                      prose-strong:text-gray-900
                      prose-img:rounded-xl prose-img:shadow-md
                      prose-blockquote:border-brand-gold prose-blockquote:text-gray-800 prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:rounded-r-lg"
                    dangerouslySetInnerHTML={{ __html: post.post_content }}
                  />

                  {/* Desktop Only Share */}
                  <div className="hidden lg:block mt-12 pt-8 border-t border-gray-100">
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

            {/* Right Column: Sticky Donation Form (Desktop Only) */}
            <div className="hidden lg:block lg:w-1/3">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-brown to-gray-800 p-6 text-white text-center">
                    <h3 className="text-xl font-bold mb-1">Infaq & Sedekah</h3>
                    <p className="text-sm text-gray-300">
                      Pahala Mengalir Untuk Anda
                    </p>
                  </div>

                  {/* Desktop Progress Bar (New) */}
                  {post.post_categories?.title === "Program Pembangunan" && (
                    <div className="p-6 pb-2">
                      <div className="flex justify-between items-end mb-2 text-sm text-gray-500 font-medium">
                        <span>Terkumpul</span>
                        <span className="text-gray-900 font-bold">
                          Rp {currentAmount.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-brand-gold rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(
                              (currentAmount / needAmount) * 100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <span className="text-brand-brown text-sm">
                          {Math.round((currentAmount / needAmount) * 100)}%
                          Tercapai
                        </span>
                        <span>
                          Rp {needAmount.toLocaleString("id-ID")}{" "}
                          {post.program_categories?.title}
                        </span>
                      </div>
                    </div>
                  )}
                  <div id="donation-form-desktop" className="p-1">
                    <PublicDonationForm
                      account={post?.account}
                      slug={post.post_name}
                      code={post.code ?? undefined}
                      phone={
                        post.program_categories?.title === "Masjid Alhijrah"
                          ? "628117550202"
                          : undefined
                      }
                    />
                  </div>
                </div>

                {/* Trust Card */}
                <div className="bg-brand-brown/5 rounded-3xl p-6 border border-brand-brown/10 text-center">
                  <p className="text-xs font-bold text-brand-brown uppercase tracking-widest mb-4">
                    Jaminan Keamanan
                  </p>
                  <div className="flex justify-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-gold shadow-sm">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky CTA (Kitabisa Inspired) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 p-3 pb-safe flex gap-3 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `${post.post_title} - ${post.post_name}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-2xl border-2 border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <FiShare2 size={24} />
        </a>
        <Link
          href="#donation-form"
          className="flex-1 flex items-center justify-center bg-brand-gold text-brand-brown font-extrabold text-base rounded-2xl shadow-lg shadow-brand-gold/20 active:scale-[0.98] transition-all"
        >
          Donasi Sekarang
        </Link>
      </div>

      {/* Mobile Donation Form - Shown when clicking CTA or scroll to bottom */}
      <div
        id="donation-form"
        className="lg:hidden p-5 bg-gray-50 border-t border-gray-100"
      >
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-1">
          <div className="p-4 border-b border-gray-50 text-center">
            <h3 className="font-bold text-gray-900">Salurkan Kebaikan</h3>
            <p className="text-xs text-gray-500">
              Isi form di bawah ini untuk berdonasi{" "}
              {post.post_categories?.title} ss
            </p>
          </div>
          <PublicDonationForm
            account={post?.account}
            slug={post.post_name}
            code={post.code ?? undefined}
            phone={
              post.program_categories?.title === "Masjid Alhijrah"
                ? "628117550202"
                : undefined
            }
          />
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Markaz Al-Hijrah • Berkhidmat Untuk
            Ummat
          </p>
        </div>
      </footer>
    </div>
  );
}
