"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  errors?: string;
  required?: boolean;
}

export default function ImageUpload({
  label = "Upload Gambar",
  value,
  onChange,
  disabled = false,
  errors,
  required = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB!");
      return;
    }

    setUploading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Upload to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload gagal");
      }

      const data = await response.json();

      if (!data.ok || !data.files || data.files.length === 0) {
        throw new Error("Upload gagal");
      }

      const uploadedUrl = data.files[0].url;

      // Set preview and notify parent
      setPreview(uploadedUrl);
      onChange(uploadedUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload gambar gagal. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-start gap-4">
        {/* Upload Button / Preview */}
        <div className="flex-1">
          {preview ? (
            <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden group">
              <Image
                src={preview}
                alt="Preview"
                width={800}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={disabled || uploading}
                  className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <FiUpload className="inline mr-2" />
                  Ganti
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={disabled || uploading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  <FiX className="inline mr-2" />
                  Hapus
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleClick}
              disabled={disabled || uploading}
              className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 transition-all ${
                uploading
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              } ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">Mengupload...</p>
                </>
              ) : (
                <>
                  <FiImage className="text-4xl text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Klik untuk upload gambar
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WEBP (Max. 5MB)
                    </p>
                  </div>
                </>
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
          />
        </div>
      </div>

      {errors && <p className="text-sm text-red-500 mt-1">{errors}</p>}
    </div>
  );
}
