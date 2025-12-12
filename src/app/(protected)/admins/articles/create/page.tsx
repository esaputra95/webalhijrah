"use client";
import { PostForm } from "@/features/posts";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function CreatePostPage() {
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
          Buat Artikel Baru
        </h1>
        <PostForm mode="create" />
      </div>
    </div>
  );
}
