"use client";

import React, { FC, useState, useEffect } from "react";
import Modal from "@/components/ui/modals/Modal";
import HeaderModal from "@/components/ui/modals/Header";
import Button from "@/components/ui/buttons/Button";
import { DonationType } from "@/types/donationSchema";
import { useFollowUpHalaqoh } from "@/hooks/masters/useHalaqohRegistrations";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  donation?: DonationType;
};

const DonationFollowUpModal: FC<Props> = ({ isOpen, onClose, donation }) => {
  const [message, setMessage] = useState("");
  const followUpMutation = useFollowUpHalaqoh();

  useEffect(() => {
    if (donation) {
      const amountFormatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(donation.amount);

      const template = `Assalam'alaikum warahmatullahi wabarakatuh.
Terima kasih Bapak/Ibu ${donation.name}, atas donasi Anda sebesar ${amountFormatted}.

Semoga Allah menerima infak ini, melipatgandakan pahalanya, dan menjadikannya sebab kebaikan di dunia dan akhirat.
Jazakumullah khairan wa barakallahu fiikum.`;
      setMessage(template);
    }
  }, [donation]);

  const handleSend = async () => {
    if (!donation?.phone_number) {
      toast.error("Nomor telepon tidak ditemukan");
      return;
    }

    try {
      await followUpMutation.mutateAsync({
        targets: [donation.phone_number],
        message: message,
      });
      toast.success("Pesan terima kasih telah dikirim!");
      onClose();
    } catch (error) {
      toast.error("Gagal mengirim pesan");
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <HeaderModal>Kirim Ucapan Terima Kasih (WhatsApp)</HeaderModal>
      <div className="p-4 space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
          Kirim pesan konfirmasi dan ucapan terima kasih ke{" "}
          <strong>{donation?.name}</strong> (
          {donation?.phone_number || "Nomor tidak tersedia"})
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Isi Pesan
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-48 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition text-sm"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} type="button" color="error">
            Batal
          </Button>
          <Button
            onClick={handleSend}
            disabled={followUpMutation.isPending || !donation?.phone_number}
          >
            {followUpMutation.isPending ? "Mengirim..." : "Kirim Sekarang"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DonationFollowUpModal;
