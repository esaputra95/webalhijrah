import { ProgramType } from "@/types/programSchema";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";

// Helper get data from API (SSR)
async function getProgramBySlug(slug: string): Promise<ProgramType | null> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}${apiUrl.programs}/slug/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const json = (await res.json()) as BaseApiResponse<ProgramType>;
    return json.data || null;
  } catch (error) {
    console.error("Error fetching program:", error);
    return null;
  }
}

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";
import { notFound } from "next/navigation";
import ShareButtons from "./ShareButtons";

// Generate Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return {
      title: "Program Tidak Ditemukan",
    };
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: `${program.title} - Markaz Al-Hijrah`,
    description: program.description || program.title,
    openGraph: {
      title: program.title || "",
      description: program.description || program.title || "",
      url: `/programs/${slug}`,
      siteName: "Markaz Al-Hijrah",
      locale: "id_ID",
      images: program.image ? [program.image] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: program.title || "",
      description: program.description || program.title || "",
      images: program.image ? [program.image] : [],
    },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Program Content */}
      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8 animate-fade-in-up">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-blue font-medium transition-colors"
              >
                <FiArrowLeft /> Kembali ke Program
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up delay-100">
              {/* Header & Body */}
              <div className="p-8 md:p-12">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiCalendar size={14} />
                    {program.date
                      ? new Date(program.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {program.title}
                </h1>

                {/* Featured Image */}
                {program.image && (
                  <div className="relative w-full h-[500px] mb-8 bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.title || "Program Image"}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                )}

                {/* Description */}
                {program.description && (
                  <p className="text-xl text-gray-900 mb-8 leading-relaxed border-l-4 border-brand-gold pl-6 italic font-semibold">
                    {program.description}
                  </p>
                )}

                {/* Content */}
                {program.content && (
                  <div
                    className="prose prose-lg max-w-none prose-gray
                        prose-headings:text-gray-900 prose-headings:font-bold
                        prose-p:text-gray-900 prose-p:leading-relaxed
                        prose-a:text-brand-blue prose-a:no-underline hover:prose-a:text-brand-gold hover:prose-a:underline
                        prose-strong:text-gray-900 prose-strong:font-bold
                        prose-li:text-gray-900
                        prose-img:rounded-xl prose-img:shadow-lg
                        prose-blockquote:border-brand-gold prose-blockquote:text-gray-800 prose-blockquote:italic"
                    dangerouslySetInnerHTML={{ __html: program.content }}
                  />
                )}
              </div>
            </div>

            {/* Share & Actions */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-md animate-fade-in-up delay-200">
              <p className="text-gray-600 font-medium">Bagikan program ini:</p>
              <div className="flex gap-3">
                <ShareButtons title={program.title || ""} />
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/donasi"
                className="inline-block px-10 py-4 bg-brand-gold text-brand-blue font-bold text-lg rounded-full hover:bg-[#d4b035] transition-all shadow-xl"
              >
                Dukung Program Ini
              </Link>
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
