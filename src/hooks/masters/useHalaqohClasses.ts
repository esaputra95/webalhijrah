"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";
import { Halaqoh } from "@/types/halaqoh";

export function useHalaqohClasses() {
  const queryParams = useGetParams();

  return useQuery<BaseApiResponse<Halaqoh[]>>({
    queryKey: ["HalaqohClasses", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<Halaqoh[]>>(
        apiUrl.halaqohClasses,
        queryParams,
      ),
  });
}

export function useCreateHalaqohClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Halaqoh>) =>
      (await api.post(apiUrl.halaqohClasses, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["HalaqohClasses"] }),
  });
}

export function useUpdateHalaqohClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Halaqoh> & { id: number }) =>
      (await api.put(`${apiUrl.halaqohClasses}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["HalaqohClasses"] }),
  });
}

export function useDeleteHalaqohClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string | number }) =>
      (await api.delete(`${apiUrl.halaqohClasses}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["HalaqohClasses"] }),
  });
}
