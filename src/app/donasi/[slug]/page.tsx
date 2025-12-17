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
      {/* <PublicNavbar /> */}

      {/* Program Content */}
      <article className="pt-16 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            {/* <div className="mb-8 animate-fade-in-up">
              <Link
                href="/donasi"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-brown font-medium transition-colors"
              >
                <FiArrowLeft /> Kembali ke Daftar Donasi
              </Link>
            </div> */}

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up delay-100">
              {/* Program Header & Body */}
              <div className="p-8 md:p-12">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                  {post.category && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-brand-brown rounded-full font-semibold">
                      <FiTag size={14} />
                      {post.category.name}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
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
                    prose-a:text-brand-brown prose-a:no-underline hover:prose-a:text-brand-gold hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-li:text-gray-900
                    prose-img:rounded-xl prose-img:shadow-lg
                    prose-blockquote:border-brand-gold prose-blockquote:text-gray-800 prose-blockquote:italic"
                  dangerouslySetInnerHTML={{ __html: post.post_content }}
                />
              </div>

              {/* Donation Form Section */}
              <div className="border-t border-gray-100 p-8 md:p-12 bg-blue-50/50">
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-brand-brown mb-2">
                    Salurkan Donasi Anda
                  </h3>
                  <p className="text-gray-600">
                    Bantu wujudkan program kebaikan ini dengan menyisihkan
                    sebagian harta Anda.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-brand-blue to-gray-800 p-4 text-white text-center">
                    <p className="font-semibold text-sm">
                      Form Donasi Online (Aman & Terpercaya)
                    </p>
                  </div>
                  <PublicDonationForm />
                </div>
              </div>
            </div>

            {/* Share & Actions */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-md animate-fade-in-up delay-200">
              <p className="text-gray-600 font-medium">Bagikan program ini:</p>
              <div className="flex gap-3">
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
