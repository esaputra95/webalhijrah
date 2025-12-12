"use client";
import TitleContent from "@/components/layouts/TitleContent";
import { ProgramForm } from "@/features/programs";
import { useProgram } from "@/hooks/masters/usePrograms";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const DetailProgram = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const mode = (searchParams.get("mode") as "update" | "view") || "view";

  const { data, isLoading } = useProgram(id);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <TitleContent
        title={mode === "update" ? "Edit Program" : "Detail Program"}
      />
      <div className="bg-white p-4 rounded-lg shadow-md">
        <ProgramForm initialValues={data?.data} mode={mode} />
      </div>
    </div>
  );
};

export default DetailProgram;
