"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";
import { HalaqohPromotion } from "@/types/halaqoh";
import { HalaqohPromotionType } from "@/types/halaqohSchema";

export function useHalaqohPromotions(filters?: {
  user_id?: number | string;
  category_id?: number | string;
}) {
  const queryParams = useGetParams();
  const mergedParams = { ...queryParams, ...filters };

  return useQuery<BaseApiResponse<HalaqohPromotion[]>>({
    queryKey: ["HalaqohPromotions", mergedParams],
    queryFn: async () =>
      getData<
        { user_id?: number | string; category_id?: number | string },
        BaseApiResponse<HalaqohPromotion[]>
      >(apiUrl.halaqohPromotions, mergedParams),
  });
}

export function useCreatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: HalaqohPromotionType) =>
      (await api.post(apiUrl.halaqohPromotions, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["HalaqohPromotions"] });
      qc.invalidateQueries({ queryKey: ["HalaqohParticipants"] });
      qc.invalidateQueries({ queryKey: ["HalaqohClasses"] });
    },
  });
}
export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await api.delete(`${apiUrl.halaqohPromotions}/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["HalaqohPromotions"] });
      qc.invalidateQueries({ queryKey: ["HalaqohParticipants"] });
      qc.invalidateQueries({ queryKey: ["HalaqohClasses"] });
    },
  });
}
