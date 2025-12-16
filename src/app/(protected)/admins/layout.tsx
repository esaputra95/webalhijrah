import type { ReactNode } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markaz Alhijrah",
  description: "Sistem Informasi Panel Markaz Alhijrah",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
