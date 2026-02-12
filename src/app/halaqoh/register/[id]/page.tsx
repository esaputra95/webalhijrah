"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useHalaqohCategory } from "@/hooks/masters/useHalaqohCategories";
import HalaqohRegistrationDetailForm from "@/features/halaqoh/registration/HalaqohRegistrationDetailForm";
import Spinner from "@/components/ui/loading/Spinner";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function RegistrationPage() {
  const { id } = useParams();
  const { data: categoryData, isLoading } = useHalaqohCategory(id as string);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  const category = categoryData?.data;

  if (!category) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Program tidak ditemukan
        </h2>
        <Link
          href="/halaqoh"
          className="text-sky-600 hover:text-sky-700 font-medium"
        >
          Kembali ke daftar program
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/halaqoh"
          className="inline-flex items-center text-slate-500 hover:text-[#4A4C70] mb-8 transition-colors group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke daftar program
        </Link>

        <div className="mb-12 text-center md:text-left">
          <div className="inline-block px-4 py-2 bg-[#EFC940]/10 text-[#d4b035] rounded-full text-sm font-bold mb-4">
            Al-Hijrah Halaqoh
          </div>
          <h1 className="text-4xl font-bold text-[#4A4C70] mb-4">
            Pendaftaran {category.title}
          </h1>
          <p className="text-lg text-slate-600">
            {category.description ||
              "Satu langkah lagi untuk bergabung dalam majelis ilmu."}
          </p>
        </div>

        <HalaqohRegistrationDetailForm category={category} />
      </div>
    </div>
  );
}
