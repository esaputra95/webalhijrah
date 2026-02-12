"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";
import { HalaqohCategory } from "@/types/halaqoh";

export function useHalaqohCategories() {
  const queryParams = useGetParams();

  return useQuery<BaseApiResponse<HalaqohCategory[]>>({
    queryKey: ["HalaqohCategories", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<HalaqohCategory[]>>(
        apiUrl.halaqohCategories,
        queryParams,
      ),
  });
}

export function useHalaqohCategory(id: string | number) {
  return useQuery<BaseApiResponse<HalaqohCategory>>({
    queryKey: ["HalaqohCategory", id],
    queryFn: async () =>
      (await api.get(`${apiUrl.halaqohCategories}/${id}`)).data,
    enabled: !!id,
  });
}

export function useCreateHalaqohCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<HalaqohCategory>) =>
      (await api.post(apiUrl.halaqohCategories, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["HalaqohCategories"] }),
  });
}

export function useUpdateHalaqohCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: Partial<HalaqohCategory> & { id: number }) =>
      (await api.put(`${apiUrl.halaqohCategories}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["HalaqohCategories"] }),
  });
}

export function useDeleteHalaqohCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string | number }) =>
      (await api.delete(`${apiUrl.halaqohCategories}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["HalaqohCategories"] }),
  });
}
