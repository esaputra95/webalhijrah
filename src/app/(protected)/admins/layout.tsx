import type { ReactNode } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markaz Alhijrah",
  description: "Sistem Informasi Panel Markaz Alhijrah",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
