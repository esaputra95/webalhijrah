"use client";
import React, { FC, useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import SelectInput from "@/components/ui/inputs/SelectInput";
import TextInput from "@/components/ui/inputs/TextInput";
import Button from "@/components/ui/buttons/Button";
import { toast } from "react-toastify";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { useHalaqohCategories } from "@/hooks/masters/useHalaqohCategories";
import { useHalaqohMaterialLevels } from "@/hooks/masters/useHalaqohMaterialLevels";
import { useHalaqohClasses } from "@/hooks/masters/useHalaqohClasses";
import { useHalaqohParticipants } from "@/hooks/masters/useHalaqohParticipants";
import { useCreatePromotion } from "@/hooks/masters/useHalaqohPromotions";

type FormValues = {
  category_id: string;
  user_id: string;
  from_halaqoh_id: string;
  from_level_id: string;
  to_level_id: string;
  to_halaqoh_id: string;
  test_score: string;
  notes: string;
  is_acceleration: boolean;
};

type Props = {
  onCancel?: () => void;
};

const PromotionForm: FC<Props> = ({ onCancel }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      is_acceleration: false,
    },
  });

  const selectedCategoryId = watch("category_id");
  const selectedUserId = watch("user_id");
  const selectedToLevelId = watch("to_level_id");
  const selectedFromLevelId = watch("from_level_id");
  const isAcceleration = watch("is_acceleration");

  // Data sources
  const { data: categoryData } = useHalaqohCategories();
  const { data: levelsData } = useHalaqohMaterialLevels(
    selectedCategoryId ? Number(selectedCategoryId) : undefined,
  );
  const { data: classesData } = useHalaqohClasses();
  const { data: participantsData } = useHalaqohParticipants();

  const promote = useCreatePromotion();

  // Category options
  const categoryOptions = useMemo(
    () =>
      (categoryData?.data || []).map((c) => ({
        label: c.title,
        value: String(c.id),
      })),
    [categoryData],
  );

  // Active participants filtered by selected category
  const activeParticipants = useMemo(() => {
    if (!selectedCategoryId) return [];
    return (participantsData?.data || []).filter(
      (p) =>
        p.status === "ACTIVE" &&
        p.halaqoh?.category_id === Number(selectedCategoryId),
    );
  }, [participantsData, selectedCategoryId]);

  const participantOptions = useMemo(
    () =>
      activeParticipants.map((p) => ({
        label: `${p.user?.name || "?"} — ${p.halaqoh?.title || "?"}`,
        value: String(p.user_id),
      })),
    [activeParticipants],
  );

  // When user selected, auto-fill from_halaqoh and from_level
  useEffect(() => {
    if (selectedUserId && activeParticipants.length > 0) {
      const participant = activeParticipants.find(
        (p) => p.user_id === Number(selectedUserId),
      );
      if (participant) {
        setValue("from_halaqoh_id", String(participant.halaqoh_id));
        const halaqoh = (classesData?.data || []).find(
          (c) => c.id === participant.halaqoh_id,
        );
        if (halaqoh?.material_level_id) {
          setValue("from_level_id", String(halaqoh.material_level_id));
        }
      }
    }
  }, [selectedUserId, activeParticipants, classesData, setValue]);

  // Level options
  const levels = useMemo(
    () =>
      (levelsData?.data || []).sort((a, b) => a.level_order - b.level_order),
    [levelsData],
  );

  // Determine next/prev level for target
  const targetLevelOptions = useMemo(() => {
    if (isAcceleration || !selectedFromLevelId) {
      // Show all levels if acceleration OR no from_level
      return levels.map((l) => ({
        label: `${l.title} (Level ${l.level_order})`,
        value: String(l.id),
      }));
    }

    const fromLevel = levels.find((l) => l.id === Number(selectedFromLevelId));
    if (!fromLevel) return [];

    // Only show ±1 levels
    return levels
      .filter((l) => Math.abs(l.level_order - fromLevel.level_order) === 1)
      .map((l) => ({
        label: `${l.title} (Level ${l.level_order}) — ${l.level_order > fromLevel.level_order ? "⬆ Naik" : "⬇ Turun"}`,
        value: String(l.id),
      }));
  }, [levels, selectedFromLevelId, isAcceleration]);

  // Classes filtered by target level
  const targetClassOptions = useMemo(() => {
    if (!selectedToLevelId) return [];
    return (classesData?.data || [])
      .filter(
        (c) =>
          c.material_level_id === Number(selectedToLevelId) &&
          c.status === "OPEN",
      )
      .map((c) => ({
        label: `${c.title} (${c.mentor?.user?.name || "Belum ada mentor"})`,
        value: String(c.id),
      }));
  }, [classesData, selectedToLevelId]);

  // Current info display
  const currentInfo = useMemo(() => {
    if (!selectedUserId) return null;
    const participant = activeParticipants.find(
      (p) => p.user_id === Number(selectedUserId),
    );
    if (!participant) return null;

    const halaqoh = (classesData?.data || []).find(
      (c) => c.id === participant.halaqoh_id,
    );

    return {
      className: halaqoh?.title || "-",
      levelName: halaqoh?.material_level?.title || "-",
      levelOrder: halaqoh?.material_level?.level_order || "-",
    };
  }, [selectedUserId, activeParticipants, classesData]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    promote.mutate(
      {
        user_id: Number(values.user_id),
        category_id: Number(values.category_id),
        from_halaqoh_id: values.from_halaqoh_id
          ? Number(values.from_halaqoh_id)
          : undefined,
        to_halaqoh_id: Number(values.to_halaqoh_id),
        from_level_id: values.from_level_id
          ? Number(values.from_level_id)
          : undefined,
        to_level_id: Number(values.to_level_id),
        type: "PROMOTION",
        test_score: values.test_score ? Number(values.test_score) : undefined,
        notes: values.notes || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Perpindahan kelas berhasil diproses");
          onCancel?.();
          reset();
        },
        onError: (error) => toast.error(handleErrorResponse(error)),
      },
    );
  };

  // Reset dependent fields when category/acceleration changes
  useEffect(() => {
    setValue("to_level_id", "");
    setValue("to_halaqoh_id", "");
  }, [isAcceleration, setValue]);

  useEffect(() => {
    setValue("user_id", "");
    setValue("from_halaqoh_id", "");
    setValue("from_level_id", "");
    setValue("to_level_id", "");
    setValue("to_halaqoh_id", "");
    setValue("is_acceleration", false);
  }, [selectedCategoryId, setValue]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Step 1: Pilih kategori dan peserta */}
      <SelectInput
        label="Kategori"
        {...register("category_id", { required: "Pilih kategori" })}
        errors={errors.category_id?.message}
        option={[
          { label: "-- Pilih Kategori --", value: "" },
          ...categoryOptions,
        ]}
        required
      />

      {selectedCategoryId && (
        <>
          <SelectInput
            label="Peserta"
            {...register("user_id", { required: "Pilih peserta" })}
            errors={errors.user_id?.message}
            option={[
              { label: "-- Pilih Peserta --", value: "" },
              ...participantOptions,
            ]}
            required
          />

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="is_acceleration"
              {...register("is_acceleration")}
              className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500 cursor-pointer"
            />
            <label
              htmlFor="is_acceleration"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Naik Kelas Akselerasi (Bisa lompat level)
            </label>
          </div>
        </>
      )}

      {/* Info kelas saat ini */}
      {currentInfo && (
        <div className="bg-blue-50 p-4 rounded-xl">
          <h4 className="font-bold text-blue-800 text-sm mb-1">
            Kelas Saat Ini
          </h4>
          <p className="text-xs text-blue-600">
            Kelas: {currentInfo.className}
          </p>
          <p className="text-xs text-blue-600">
            Level: {currentInfo.levelName} (Urutan: {currentInfo.levelOrder})
          </p>
        </div>
      )}

      {/* Step 2: Pilih level dan kelas tujuan */}
      {selectedUserId && (
        <>
          <SelectInput
            label="Level Tujuan"
            {...register("to_level_id", {
              required: "Pilih level tujuan",
            })}
            errors={errors.to_level_id?.message}
            option={[
              { label: "-- Pilih Level Tujuan --", value: "" },
              ...targetLevelOptions,
            ]}
            required
          />

          {selectedToLevelId && (
            <SelectInput
              label="Kelas Tujuan"
              {...register("to_halaqoh_id", {
                required: "Pilih kelas tujuan",
              })}
              errors={errors.to_halaqoh_id?.message}
              option={[
                { label: "-- Pilih Kelas Tujuan --", value: "" },
                ...targetClassOptions,
              ]}
              required
            />
          )}

          {targetClassOptions.length === 0 && selectedToLevelId && (
            <p className="text-xs text-red-500 italic">
              * Belum ada kelas OPEN di level ini. Buat kelas baru terlebih
              dahulu.
            </p>
          )}
        </>
      )}

      {/* Step 3: Opsional (test score, notes) */}
      {selectedUserId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput
            label="Nilai Tes (Opsional)"
            type="number"
            placeholder="0 - 100"
            {...register("test_score")}
          />
          <TextInput
            label="Catatan (Opsional)"
            placeholder="Catatan perpindahan..."
            {...register("notes")}
          />
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2 text-sm">
        <Button
          onClick={onCancel}
          type="button"
          color="error"
          variant="outlined"
        >
          Batal
        </Button>
        <Button type="submit" disabled={promote.isPending}>
          {promote.isPending ? "Memproses..." : "Proses Perpindahan"}
        </Button>
      </div>
    </form>
  );
};

export default PromotionForm;
