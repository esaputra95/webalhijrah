"use client";
import React, { FC, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { FiUsers, FiArrowRight, FiInfo } from "react-icons/fi";

type FormValues = {
  category_id: string;
  from_halaqoh_id: string;
  to_level_id: string;
  to_halaqoh_id: string;
  students: {
    user_id: number;
    name: string;
    selected: boolean;
    test_score: string;
    notes: string;
    from_level_id: number | null;
  }[];
};

type Props = {
  onCancel?: () => void;
};

const BulkPromotionForm: FC<Props> = ({ onCancel }) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    resetField,
  } = useForm<FormValues>({
    defaultValues: {
      students: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "students",
  });

  const selectedCategoryId = watch("category_id");
  const selectedFromHalaqohId = watch("from_halaqoh_id");
  const selectedToLevelId = watch("to_level_id");
  const students = watch("students") || [];

  // Data sources
  const { data: categoryData } = useHalaqohCategories();
  const { data: levelsData } = useHalaqohMaterialLevels(
    selectedCategoryId ? Number(selectedCategoryId) : undefined,
  );
  const { data: classesData } = useHalaqohClasses();
  const {
    data: participantsData,
    isLoading: isLoadingParticipants,
    isFetching: isFetchingParticipants,
  } = useHalaqohParticipants({
    halaqoh_id: selectedFromHalaqohId,
  });

  const promote = useCreatePromotion();

  // Reset target fields and student list when category changes
  useEffect(() => {
    resetField("from_halaqoh_id");
    replace([]);
    resetField("to_level_id");
    resetField("to_halaqoh_id");
  }, [selectedCategoryId, replace, resetField]);

  // Reset target fields and student list when FROM class origin changes
  useEffect(() => {
    replace([]);
    resetField("to_level_id");
    resetField("to_halaqoh_id");
  }, [selectedFromHalaqohId, replace, resetField]);

  // Auto-populate students when participantsData is loaded
  useEffect(() => {
    if (selectedFromHalaqohId && participantsData?.data) {
      const currentHalaqoh = (classesData?.data || []).find(
        (c) => c.id === Number(selectedFromHalaqohId),
      );

      const initialStudents = participantsData.data.map((p) => ({
        user_id: p.user_id,
        name: p.user?.name || "Unknown",
        selected: true,
        test_score: "",
        notes: "Memenuhi syarat",
        from_level_id: currentHalaqoh?.material_level_id || null,
      }));

      replace(initialStudents);
    } else if (!selectedFromHalaqohId) {
      replace([]);
    }
  }, [participantsData, selectedFromHalaqohId, classesData, replace]);

  // Category options
  const categoryOptions = useMemo(
    () =>
      (categoryData?.data || []).map((c) => ({
        label: c.title,
        value: String(c.id),
      })),
    [categoryData],
  );

  // Active classes for source selection
  const sourceClassOptions = useMemo(() => {
    if (!selectedCategoryId) return [];
    return (classesData?.data || [])
      .filter((c) => c.category_id === Number(selectedCategoryId))
      .map((c) => ({
        label: c.title,
        value: String(c.id),
      }));
  }, [classesData, selectedCategoryId]);

  // Level options based on current class level
  const targetLevelOptions = useMemo(() => {
    if (!selectedFromHalaqohId || !levelsData?.data) return [];

    const currentHalaqoh = (classesData?.data || []).find(
      (c) => c.id === Number(selectedFromHalaqohId),
    );
    const levels = [...levelsData.data].sort(
      (a, b) => a.level_order - b.level_order,
    );

    if (!currentHalaqoh?.material_level_id) {
      return levels.map((l) => ({
        label: `${l.title} (Level ${l.level_order})`,
        value: String(l.id),
      }));
    }

    const currentLevel = levels.find(
      (l) => l.id === currentHalaqoh.material_level_id,
    );
    if (!currentLevel) return [];

    return levels
      .filter((l) => Math.abs(l.level_order - currentLevel.level_order) <= 1)
      .map((l) => ({
        label: `${l.title} (Level ${l.level_order}) ${
          l.level_order > currentLevel.level_order
            ? "⬆ Naik"
            : l.level_order < currentLevel.level_order
              ? "⬇ Turun"
              : "↔ Tetap"
        }`,
        value: String(l.id),
      }));
  }, [selectedFromHalaqohId, levelsData, classesData]);

  // Target classes based on selected level
  const targetClassOptions = useMemo(() => {
    if (!selectedToLevelId) return [];
    return (classesData?.data || [])
      .filter(
        (c) =>
          c.material_level_id === Number(selectedToLevelId) &&
          c.status === "OPEN",
      )
      .map((c) => ({
        label: `${c.title} (${c.mentor?.user?.name || "No Mentor"})`,
        value: String(c.id),
      }));
  }, [classesData, selectedToLevelId]);

  const selectedCount = students.filter((s) => s.selected).length;

  const onSubmit = (values: FormValues) => {
    const selectedStudents = values.students.filter((s) => s.selected);
    if (selectedStudents.length === 0) {
      toast.error("Pilih minimal satu siswa untuk dipindahkan");
      return;
    }

    if (!values.to_halaqoh_id) {
      toast.error("Pilih kelas tujuan");
      return;
    }

    const payload = selectedStudents.map((s) => ({
      user_id: s.user_id,
      category_id: Number(values.category_id),
      from_halaqoh_id: Number(values.from_halaqoh_id),
      to_halaqoh_id: Number(values.to_halaqoh_id),
      from_level_id: s.from_level_id,
      to_level_id: Number(values.to_level_id),
      test_score: s.test_score ? Number(s.test_score) : undefined,
      notes: s.notes || undefined,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    promote.mutate(payload as any, {
      onSuccess: () => {
        toast.success(`${selectedStudents.length} siswa berhasil dipindahkan`);
        onCancel?.();
        reset();
      },
      onError: (err) => toast.error(handleErrorResponse(err)),
    });
  };

  const isDataLoading = isLoadingParticipants || isFetchingParticipants;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <SelectInput
            label="Kategori"
            {...register("category_id", { required: true })}
            option={[
              { label: "-- Pilih Kategori --", value: "" },
              ...categoryOptions,
            ]}
          />
          <SelectInput
            label="Asal Kelas"
            {...register("from_halaqoh_id", { required: true })}
            option={[
              { label: "-- Pilih Asal Kelas --", value: "" },
              ...sourceClassOptions,
            ]}
            disabled={!selectedCategoryId}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <FiUsers className="text-blue-500" />
              Daftar Siswa{" "}
              {selectedFromHalaqohId
                ? `Kelas ${sourceClassOptions.find((o) => o.value === selectedFromHalaqohId)?.label}`
                : ""}
            </h3>
            <span className="text-xs text-slate-500 font-medium tracking-tight">
              Total: {fields.length} Siswa
            </span>
          </div>

          <div className="overflow-x-auto relative flex-1">
            {isDataLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-bold text-slate-600 italic">
                    Memuat data siswa...
                  </span>
                </div>
              </div>
            )}

            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 sticky top-0 z-0">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={
                        students.length > 0 && selectedCount === students.length
                      }
                      onChange={(e) => {
                        const val = e.target.checked;
                        students.forEach((_, i) =>
                          setValue(`students.${i}.selected`, val),
                        );
                      }}
                    />
                  </th>
                  <th className="px-4 py-3">Nama Siswa</th>
                  <th className="px-4 py-3 w-28">Nilai Akhir</th>
                  <th className="px-4 py-3">Keterangan / Alasan</th>
                  {/* <th className="px-4 py-3 w-32 text-center">Status</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {fields.map((field, index) => (
                  <tr
                    key={field.id}
                    className={`hover:bg-slate-50/50 transition-colors ${!students[index]?.selected ? "opacity-50" : ""}`}
                  >
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        {...register(`students.${index}.selected`)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {students[index]?.name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-700">
                            {students[index]?.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            ID: {students[index]?.user_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <TextInput
                        placeholder="88"
                        {...register(`students.${index}.test_score`)}
                        disabled={!students[index]?.selected}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <TextInput
                        placeholder="Memenuhi syarat..."
                        {...register(`students.${index}.notes`)}
                        disabled={!students[index]?.selected}
                      />
                    </td>
                    {/* <td className="px-4 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          students[index]?.selected
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {students[index]?.selected
                          ? "Naik Kelas"
                          : "Ditangguhkan"}
                      </span>
                    </td> */}
                  </tr>
                ))}
                {fields.length === 0 && !isDataLoading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-32 text-center text-slate-400 italic"
                    >
                      {selectedFromHalaqohId
                        ? "Tidak ada siswa aktif di kelas ini"
                        : "Silakan pilih asal kelas untuk menampilkan daftar siswa"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
              <FiArrowRight className="text-blue-500" />
              Tujuan Perpindahan
            </h3>

            <div className="space-y-4">
              <SelectInput
                label="Level Tujuan"
                {...register("to_level_id", { required: true })}
                option={[
                  { label: "-- Pilih Level Tujuan --", value: "" },
                  ...targetLevelOptions,
                ]}
                disabled={fields.length === 0 || isDataLoading}
              />
              <SelectInput
                label="Kelas Tujuan"
                {...register("to_halaqoh_id", { required: true })}
                option={[
                  { label: "-- Pilih Kelas Tujuan --", value: "" },
                  ...targetClassOptions,
                ]}
                disabled={!selectedToLevelId || isDataLoading}
              />

              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-sm py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 italic">Siswa Terpilih</span>
                  <span className="font-bold text-blue-600 italic">
                    {selectedCount} Siswa
                  </span>
                </div>
                <div className="flex justify-between text-sm py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 italic">
                    Sisa di Kelas Asal
                  </span>
                  <span className="font-bold text-slate-600 italic">
                    {fields.length - selectedCount} Siswa
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                color="primary"
                className="mt-4 py-4 rounded-xl shadow-lg shadow-blue-200 w-full"
                disabled={
                  promote.isPending ||
                  !selectedToLevelId ||
                  selectedCount === 0 ||
                  isDataLoading
                }
              >
                {promote.isPending ? "Memproses..." : "Konfirmasi Perpindahan"}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex gap-3">
            <FiInfo className="text-blue-500 mt-1 shrink-0" />
            <div className="text-[11px] text-blue-700 leading-relaxed italic">
              <strong>TIPS KEAMANAN:</strong>
              <p className="mt-1">
                Gunakan fitur ini untuk kenaikan kelas massal atau
                restrukturisasi kelas antar semester. Pastikan &quot;Nilai
                Akhir&quot; sudah divalidasi oleh pembimbing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BulkPromotionForm;
