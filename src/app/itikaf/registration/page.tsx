"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiInfo,
  FiAlertCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import TextInput from "@/components/ui/inputs/TextInput";
import TextareaInput from "@/components/ui/inputs/TextareaInput";
import ImageUpload from "@/components/ui/inputs/ImageUpload";

interface Participant {
  name: string;
  phone: string;
  address: string;
  identitas: string;
  umur: string;
  gender: string; // Added gender field
  surat_izin: string;
}

export default function ItikafRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      name: "",
      phone: "",
      address: "",
      identitas: "",
      umur: "",
      gender: "", // Initial state for gender
      surat_izin: "",
    },
  ]);

  const addParticipant = () => {
    const firstAddress = participants[0].address;
    const firstPhone = participants[0].phone;
    setParticipants([
      ...participants,
      {
        name: "",
        phone: firstPhone,
        address: firstAddress,
        identitas: "",
        umur: "",
        gender: "", // Initial state for gender when adding new participant
        surat_izin: "",
      },
    ]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length === 1) return;
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const updateParticipant = (
    index: number,
    field: keyof Participant,
    value: string,
  ) => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };

    // If updating the first participant's address, and it's their first time, maybe auto-fill others?
    // But the requirement says "ketika mau menambah peserta lain, alamat auto terisi sesuai dengan data user pertama"
    // So my addParticipant logic already covers that.

    setParticipants(newParticipants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/itikaf/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants }),
      });

      const result = await res.json();

      if (result.ok) {
        toast.success("Pendaftaran berhasil!");
        router.push("/itikaf/registration/success");
      } else {
        toast.error(result.error || "Pendaftaran gagal");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar withScrolled={false} />

      <div className="pt-24 pb-12 px-4 container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-brand-brown p-8 text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FiCheckCircle size={120} />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Pendaftaran I&apos;tikaf
            </h1>
            <p className="text-slate-200 max-w-2xl">
              Silakan isi formulir di bawah ini untuk mendaftarkan diri atau
              kelompok Anda dalam kegiatan I&apos;tikaf Ramadhan di Masjid
              Markaz Al Hijrah Nusantara.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {/* Rules Section */}
            <div className="bg-amber-50 rounded-lg p-5 border border-amber-200 shadow-sm transition-all hover:bg-amber-100/50">
              <div className="flex items-center gap-2 mb-3 text-amber-900">
                <FiAlertCircle className="shrink-0" size={20} />
                <h3 className="font-bold uppercase tracking-tight">
                  Persyaratan Peserta
                </h3>
              </div>
              <ul className="text-sm text-amber-900 space-y-2 list-disc pl-5 leading-relaxed">
                <li>
                  Bersedia mengikuti seluruh rangkaian program I&apos;tikaf
                  hingga akhir.
                </li>
                <li>Sehat secara fisik dan tidak memiliki penyakit menular.</li>
                <li>
                  Melampirkan surat izin (Wali/Suami/Atasan) dan Identitas Diri.
                </li>
                <li>
                  Usia minimal 12 tahun (dibawah itu harus pengawasan orang
                  tua).
                </li>
                <li>Peserta luar kota wajib bersama mahram.</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 shadow-sm transition-all hover:bg-blue-100/50">
              <div className="flex items-center gap-2 mb-3 text-blue-900">
                <FiInfo className="shrink-0" size={20} />
                <h3 className="font-bold uppercase tracking-tight">
                  Fasilitas & Perlengkapan
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900">
                <ul className="space-y-1 list-disc pl-5">
                  <li className="font-semibold text-xs opacity-70 list-none -ml-5 mb-1">
                    FASILITAS:
                  </li>
                  <li>Makan Sahur, Berbuka & Snack</li>
                  <li>Pelayanan Kesehatan Ringan</li>
                  <li>ID Card & Safety Box</li>
                </ul>
                <ul className="space-y-1 list-disc pl-5">
                  <li className="font-semibold text-xs opacity-70 list-none -ml-5 mb-1">
                    BOLEH DIBAWA:
                  </li>
                  <li>Al Qur&apos;an & Buku Doa</li>
                  <li>Bantal, Selimut & Kasur Lipat</li>
                  <li>Peralatan Pribadi</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 shadow-sm transition-all hover:bg-slate-100/50">
              <div className="flex items-center gap-2 mb-3 text-slate-900">
                <FiAlertTriangle className="shrink-0" size={20} />
                <h3 className="font-bold uppercase tracking-tight">
                  Larangan & Tata Tertib
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-900">
                <ul className="space-y-1 list-disc pl-5">
                  <li className="font-semibold text-xs opacity-70 list-none -ml-5 mb-1 text-red-700">
                    LARANGAN:
                  </li>
                  <li>Dilarang bawa LAPTOP/Barang Berharga</li>
                  <li>Membawa tas lebih dari 1 (satu)</li>
                </ul>
                <ul className="space-y-1 list-disc pl-5">
                  <li className="font-semibold text-xs opacity-70 list-none -ml-5 mb-1">
                    TATA TERTIB:
                  </li>
                  <li>Berpakaian Muslimah & Rapi</li>
                  <li>Selalu pakai ID Card</li>
                  <li>Fokus Ibadah (Bukan Main HP/Game)</li>
                </ul>
              </div>
            </div>
            {/* Participants Section */}
            <div className="space-y-8">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="relative p-6 border border-slate-200 rounded-xl bg-slate-50/50"
                >
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Hapus Peserta"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}

                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 bg-brand-gold text-brand-brown rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                    Informasi Peserta {index === 0 ? "(Utama)" : ""}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                      label="Nama Lengkap"
                      placeholder="Masukkan nama lengkap"
                      value={participant.name}
                      onChange={(e) =>
                        updateParticipant(index, "name", e.target.value)
                      }
                      required
                    />
                    <TextInput
                      label="Usia"
                      type="number"
                      placeholder="Masukkan usia"
                      value={participant.umur}
                      onChange={(e) =>
                        updateParticipant(index, "umur", e.target.value)
                      }
                      required
                    />
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700">
                        Jenis Kelamin
                      </label>
                      <select
                        className="w-full px-4 py-2 border text-gray-700 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all bg-white"
                        value={participant.gender}
                        onChange={(e) =>
                          updateParticipant(index, "gender", e.target.value)
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
                      placeholder="Contoh: 08123456789"
                      value={participant.phone}
                      onChange={(e) =>
                        updateParticipant(index, "phone", e.target.value)
                      }
                      required
                    />
                    <TextareaInput
                      label="Alamat Lengkap"
                      placeholder="Masukkan alamat lengkap"
                      value={participant.address}
                      onChange={(e) =>
                        updateParticipant(index, "address", e.target.value)
                      }
                      required
                      className="text-gray-700"
                      classNameParent="md:col-span-2"
                    />

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                      <ImageUpload
                        label="Foto Kartu Identitas (KTP/Kartu Pelajar)"
                        value={participant.identitas}
                        onChange={(url) =>
                          updateParticipant(index, "identitas", url)
                        }
                        required
                      />
                      <ImageUpload
                        label="Surat Izin (Opsional)"
                        value={participant.surat_izin}
                        onChange={(url) =>
                          updateParticipant(index, "surat_izin", url)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={addParticipant}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-brand-gold text-brand-brown font-bold hover:bg-brand-gold/5 transition-colors w-full md:w-auto"
              >
                <FiPlus />
                Tambah Peserta Lain
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3 rounded-lg bg-brand-brown text-white font-bold shadow-lg shadow-brand-brown/20 hover:bg-brand-brown/90 disabled:opacity-50 transition-all w-full md:w-auto"
              >
                {loading ? "Memproses..." : "Kirim Pendaftaran"}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          &copy; {new Date().getFullYear()} Masjid Markaz Al Hijrah Nusantara.
          Seluruh hak cipta dilindungi undang-undang.
        </p>
      </div>
    </div>
  );
}
