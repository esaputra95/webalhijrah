"use client";
import React, { FC } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { HalaqohCategory } from "@/types/halaqoh";
import Button from "@/components/ui/buttons/Button";

type Props = {
  category: HalaqohCategory;
};

const RegistrationButton: FC<Props> = ({ category }) => {
  const { status } = useSession();
  const router = useRouter();

  const handleRegister = async () => {
    if (status !== "authenticated") {
      toast.info("Silakan login terlebih dahulu untuk mendaftar");
      router.push(`/login?callbackUrl=/halaqoh`);
      return;
    }

    router.push(`/halaqoh/register/${category.id}`);
  };

  return (
    <Button
      onClick={handleRegister}
      className="w-full font-bold h-12 rounded-xl"
    >
      Daftar Program
    </Button>
  );
};

export default RegistrationButton;
