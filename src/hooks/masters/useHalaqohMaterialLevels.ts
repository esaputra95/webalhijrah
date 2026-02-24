"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";
import { HalaqohMaterialLevel } from "@/types/halaqoh";

export function useHalaqohMaterialLevels(categoryId?: number | string) {
  const queryParams = useGetParams();
  const mergedParams = {
    ...queryParams,
    ...(categoryId ? { category_id: categoryId } : {}),
  };

  return useQuery<BaseApiResponse<HalaqohMaterialLevel[]>>({
    queryKey: ["HalaqohMaterialLevels", mergedParams],
    queryFn: async () =>
      getData<
        { category_id?: number | string },
        BaseApiResponse<HalaqohMaterialLevel[]>
      >(apiUrl.halaqohMaterialLevels, mergedParams),
  });
}

export function useHalaqohMaterialLevel(id: string | number) {
  return useQuery<BaseApiResponse<HalaqohMaterialLevel>>({
    queryKey: ["HalaqohMaterialLevel", id],
    queryFn: async () =>
      (await api.get(`${apiUrl.halaqohMaterialLevels}/${id}`)).data,
    enabled: !!id,
  });
}

export function useCreateHalaqohMaterialLevel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<HalaqohMaterialLevel>) =>
      (await api.post(apiUrl.halaqohMaterialLevels, payload)).data,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["HalaqohMaterialLevels"] }),
  });
}

export function useUpdateHalaqohMaterialLevel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: Partial<HalaqohMaterialLevel> & { id: number }) =>
      (await api.put(`${apiUrl.halaqohMaterialLevels}/${id}`, payload)).data,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["HalaqohMaterialLevels"] }),
  });
}

export function useDeleteHalaqohMaterialLevel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string | number }) =>
      (await api.delete(`${apiUrl.halaqohMaterialLevels}/${id}`)).data,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["HalaqohMaterialLevels"] }),
  });
}
