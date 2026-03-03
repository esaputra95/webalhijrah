"use client";

import { useEffect, useState } from "react";
import { Table, Column } from "@/components/ui/tables/Table";
import { toast } from "react-toastify";
import {
  FiTrash2,
  FiDownload,
  FiInfo,
  FiPlus,
  FiCopy,
  FiEdit2,
  FiX,
} from "react-icons/fi";
import Image from "next/image";
import Modal from "@/components/ui/modals/Modal";
import TextInput from "@/components/ui/inputs/TextInput";
import TextareaInput from "@/components/ui/inputs/TextareaInput";
import ImageUpload from "@/components/ui/inputs/ImageUpload";

interface Itikaf {
  id: number;
  name: string;
  phone: string;
  address: string;
  identitas: string;
  umur: number;
  gender: string;
  surat_izin: string;
}

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export default function AdminItikafPage() {
  const [data, setData] = useState<Itikaf[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Partial<Itikaf> | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/itikaf");
      const json: ApiResponse<Itikaf[]> = await res.json();
      if (json.ok) {
        setData(json.data);
      } else {
        toast.error(json.message || "Gagal mengambil data");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    const url = window.location.origin + "/itikaf/registration";
    navigator.clipboard.writeText(url);
    toast.success("URL berhasil disalin");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(`/api/itikaf?id=${id}`, {
        method: "DELETE",
      });
      const json: ApiResponse<null> = await res.json();
      if (json.ok) {
        toast.success("Data berhasil dihapus");
        fetchData();
      } else {
        toast.error(json.message || "Gagal menghapus data");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const handleOpenAdd = () => {
    setEditingData({
      name: "",
      phone: "",
      address: "",
      identitas: "",
      umur: 0,
      gender: "",
      surat_izin: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (it: Itikaf) => {
    setEditingData(it);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const isEdit = !!editingData?.id;
      const url = isEdit ? "/api/itikaf" : "/api/itikaf/public"; // Use public for create (accepts array? Oh, public expects {participants: []})

      let body;
      if (isEdit) {
        body = JSON.stringify(editingData);
      } else {
        // Create expects array of participants
        body = JSON.stringify({ participants: [editingData] });
      }

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const json: ApiResponse<Itikaf> = await res.json();
      if (json.ok) {
        toast.success(isEdit ? "Data diperbarui" : "Data ditambahkan");
        setIsModalOpen(false);
        fetchData();
      } else {
        toast.error(json.message || "Gagal memproses data");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns: Column<Itikaf>[] = [
    {
      header: "NAMA",
      accessor: "name",
      sortable: true,
      filterable: true,
    },
    {
      header: "JK",
      accessor: "gender" as keyof Itikaf,
      sortable: true,
      filterable: true,
      render: (row) =>
        row.gender === "Laki-laki"
          ? "Ikhwan"
          : row.gender === "Perempuan"
            ? "Akhwat"
            : "-",
    },
    {
      header: "USIA",
      accessor: "umur",
      sortable: true,
      render: (row) => `${row.umur} Thn`,
    },
    {
      header: "WHATSAPP",
      accessor: "phone",
      filterable: true,
      render: (row) => (
        <a
          href={`https://wa.me/${row.phone.replace(/[^0-9]/g, "")}`}
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          {row.phone}
        </a>
      ),
    },
    {
      header: "ALAMAT",
      accessor: "address",
      filterable: true,
      className: "max-w-[200px] truncate",
    },
    {
      header: "AKSI",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  const renderDetail = (row: Itikaf) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="space-y-4">
        <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
          <FiInfo className="text-brand-gold" />
          Detail Peserta
        </h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <span className="text-slate-500">Nama:</span>
          <span className="col-span-2 font-medium">{row.name}</span>

          <span className="text-slate-500">Usia:</span>
          <span className="col-span-2 font-medium">{row.umur} Tahun</span>

          <span className="text-slate-500">Gender:</span>
          <span className="col-span-2 font-medium">{row.gender}</span>

          <span className="text-slate-500">WhatsApp:</span>
          <span className="col-span-2 font-medium">{row.phone}</span>

          <span className="text-slate-500">Alamat:</span>
          <span className="col-span-2 font-medium">{row.address}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-700 flex justify-between items-center">
            Kartu Identitas
            {row.identitas && (
              <a
                href={row.identitas}
                target="_blank"
                className="text-brand-gold hover:text-brand-brown"
              >
                <FiDownload size={14} />
              </a>
            )}
          </h4>
          {row.identitas ? (
            <div className="relative h-40 w-full rounded-lg border overflow-hidden bg-slate-100 group">
              <Image
                src={row.identitas}
                alt="Identitas"
                fill
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          ) : (
            <div className="h-40 w-full flex items-center justify-center bg-slate-50 rounded-lg border border-dashed text-slate-400 text-xs">
              Tidak ada lampiran
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-700 flex justify-between items-center">
            Surat Izin
            {row.surat_izin && (
              <a
                href={row.surat_izin}
                target="_blank"
                className="text-brand-gold hover:text-brand-brown"
              >
                <FiDownload size={14} />
              </a>
            )}
          </h4>
          {row.surat_izin ? (
            <div className="relative h-40 w-full rounded-lg border overflow-hidden bg-slate-100 group">
              <Image
                src={row.surat_izin}
                alt="Surat Izin"
                fill
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          ) : (
            <div className="h-40 w-full flex items-center justify-center bg-slate-50 rounded-lg border border-dashed text-slate-400 text-xs">
              Tidak ada lampiran
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Manajemen I&apos;tikaf
          </h1>
          <p className="text-slate-500">
            Kelola data pendaftaran peserta i&apos;tikaf ramadhan
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-500/90 transition-colors"
          >
            <FiCopy />
            Salin Url Pendaftaran
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-brand-brown text-white rounded-lg text-sm font-bold hover:bg-brand-brown/90 transition-colors"
          >
            <FiPlus />
            Tambah Data
          </button>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          data={data}
          columns={columns}
          totalPages={1}
          isLoading={loading}
          renderDetail={renderDetail}
        />
      </div>

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-slate-800">
              {editingData?.id ? "Edit Data Peserta" : "Tambah Data Peserta"}
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Nama Lengkap"
                value={editingData?.name || ""}
                onChange={(e) =>
                  setEditingData({ ...editingData, name: e.target.value })
                }
                required
              />
              <TextInput
                label="Usia"
                type="number"
                value={editingData?.umur || ""}
                onChange={(e) =>
                  setEditingData({
                    ...editingData,
                    umur: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Jenis Kelamin
                </label>
                <select
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all bg-white text-sm"
                  value={editingData?.gender || ""}
                  onChange={(e) =>
                    setEditingData({ ...editingData, gender: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Ikhwan</option>
                  <option value="Perempuan">Akhwat</option>
                </select>
              </div>
              <TextInput
                label="Nomor WhatsApp"
                value={editingData?.phone || ""}
                onChange={(e) =>
                  setEditingData({ ...editingData, phone: e.target.value })
                }
                required
              />
              <TextareaInput
                label="Alamat Lengkap"
                value={editingData?.address || ""}
                onChange={(e) =>
                  setEditingData({ ...editingData, address: e.target.value })
                }
                required
                classNameParent="md:col-span-2"
              />

              <ImageUpload
                label="Kartu Identitas"
                value={editingData?.identitas || ""}
                onChange={(url) =>
                  setEditingData({ ...editingData, identitas: url })
                }
                required
              />
              <ImageUpload
                label="Surat Izin"
                value={editingData?.surat_izin || ""}
                onChange={(url) =>
                  setEditingData({ ...editingData, surat_izin: url })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border rounded-lg hover:bg-slate-50 transition-colors"
                disabled={submitLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-brand-brown text-white rounded-lg font-bold hover:bg-brand-brown/90 transition-colors disabled:opacity-50"
                disabled={submitLoading}
              >
                {submitLoading ? "Memproses..." : "Simpan Data"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
