import { postService } from "@/lib/postService";
export const dynamic = "force-dynamic";

import Image from "next/image";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { FiCalendar, FiTag, FiEye } from "react-icons/fi";
import { Metadata } from "next";
import ShareButtons from "./ShareButtons";

// Generate Metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const post = await postService.getLatestPostByType("about");

  if (!post) {
    return {
      title: "Tentang Kami - Markaz Al-Hijrah",
    };
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: `Tentang Kami - Markaz Al-Hijrah`,
    description: post.post_excerpt || post.post_title,
    openGraph: {
      title: post.post_title,
      description: post.post_excerpt || post.post_title,
      url: `${baseUrl}/about`,
      siteName: "Markaz Al-Hijrah",
      locale: "id_ID",
      images: post.post_image
        ? [
            {
              url: post.post_image,
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
      images: post.post_image ? [post.post_image] : [],
    },
  };
}

export default async function AboutPage() {
  const post = await postService.getLatestPostByType("about");

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold">Halaman Tentang belum tersedia</h1>
          <p className="text-gray-600">Terima kasih telah berkunjung.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar withScrolled={false} />

      {/* Article Content */}
      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up delay-100">
              {/* Article Header & Body */}
              <div className="p-8 md:p-12">
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
                  dangerouslySetInnerHTML={{ __html: post.post_content || "" }}
                />
              </div>
            </div>

            {/* Share & Actions */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-md animate-fade-in-up delay-200">
              <p className="text-gray-600 font-medium">Bagikan halaman ini:</p>
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
