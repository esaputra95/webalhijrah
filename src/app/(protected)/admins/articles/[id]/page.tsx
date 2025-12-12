"use client";
import { PostForm } from "@/features/posts";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { PostType } from "@/types/postSchema";

export default function EditPostPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const modeParam = searchParams.get("mode");
  const mode = (modeParam === "view" ? "view" : "update") as "view" | "update";

  const { data, isLoading, isError } = useQuery<{ data: PostType }>({
    queryKey: ["Post", id],
    queryFn: async () => (await api.get(`${apiUrl.posts}/${id}`)).data,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Gagal memuat data post
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft size={18} />
          <span>Kembali ke Daftar Artikel</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {mode === "view" ? "Detail Artikel" : "Edit Artikel"}
        </h1>
        <PostForm mode={mode} initialValues={data?.data} />
      </div>
    </div>
  );
}
