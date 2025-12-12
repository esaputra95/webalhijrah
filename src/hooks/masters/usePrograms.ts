"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ProgramType } from "@/types/programSchema";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";

// ====== Fetch Programs ======
export function usePrograms() {
  const queryParams = useGetParams();

  return useQuery<BaseApiResponse<ProgramType[]>>({
    queryKey: ["Programs", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<ProgramType[]>>(
        apiUrl.programs,
        queryParams
      ),
  });
}

// ====== Create Program ======
export function useCreateProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ProgramType>) =>
      (await api.post(apiUrl.programs, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Programs"] }),
  });
}

// ====== Update Program ======
export function useUpdateProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: number | string } & Partial<ProgramType>) =>
      (await api.put(`${apiUrl.programs}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Programs"] }),
  });
}

// ====== Delete Program ======
export function useDeleteProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) =>
      (await api.delete(`${apiUrl.programs}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Programs"] }),
  });
}

// ====== Fetch Single Program ======
export function useProgram(id: string) {
  return useQuery<BaseApiResponse<ProgramType>>({
    queryKey: ["Program", id],
    queryFn: async () => (await api.get(`${apiUrl.programs}/${id}`)).data,
    enabled: !!id,
  });
}
