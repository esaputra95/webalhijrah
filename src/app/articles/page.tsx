"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { getData } from "@/lib/fatching";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { motion } from "framer-motion";
import { Post } from "@/types/admins/articles/postType";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ArticlesPage() {
  const { data, isLoading } = useQuery<BaseApiResponse<Post[]>>({
    queryKey: ["PublicPosts"],
    queryFn: async () =>
      getData<{ _: "" }, BaseApiResponse<Post[]>>(apiUrl.posts, { _: "" }),
  });

  const posts = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <head>
        <title>Markaz Alhijrah - Artikel & Berita</title>
        <meta
          name="description"
          content="Baca artikel dan berita terkini seputar kegiatan, kajian, dan informasi dari Markaz Al-Hijrah"
        />
      </head>
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-brand-brown text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-islamic.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-brand-gold/20 border border-brand-gold/30 backdrop-blur-sm rounded-full">
              <span className="text-sm font-bold text-brand-gold tracking-wide uppercase">
                📖 Artikel & Berita
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Artikel <span className="text-brand-gold">Terbaru</span>
            </h1>
            <p className="text-lg text-gray-200">
              Baca artikel dan berita terkini seputar kegiatan, kajian, dan
              informasi dari Markaz Al-Hijrah
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Belum Ada Artikel
              </h3>
              <p className="text-gray-600">
                Artikel akan segera hadir. Nantikan update dari kami!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/articles/${post.post_name}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Article Image */}
                    <div className="relative h-60 bg-gray-200 overflow-hidden">
                      {post.post_image ? (
                        <Image
                          src={post.post_image}
                          alt={post.post_title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue to-gray-700 text-white text-4xl">
                          📄
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className="p-6 space-y-3">
                      {/* Category Badge */}
                      {post.post_categories && (
                        <div className="inline-block px-3 py-1 bg-yellow-100 text-brand-brown rounded-full text-xs font-semibold">
                          {post.post_categories.title}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-brand-gold transition-colors line-clamp-2">
                        {post.post_title}
                      </h3>

                      {/* Excerpt */}
                      {post.post_excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {post.post_excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {new Date(post.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-brand-brown font-semibold text-sm group-hover:text-brand-gold transition-colors">
                          Baca Selengkapnya →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
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
