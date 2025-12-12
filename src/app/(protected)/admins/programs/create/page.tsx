"use client";
import TitleContent from "@/components/layouts/TitleContent";
import { ProgramForm } from "@/features/programs";
import React from "react";

const CreateProgram = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <TitleContent title="Tambah Program Baru" />
      <div className="bg-white p-4 rounded-lg shadow-md">
        <ProgramForm mode="create" />
      </div>
    </div>
  );
};

export default CreateProgram;
