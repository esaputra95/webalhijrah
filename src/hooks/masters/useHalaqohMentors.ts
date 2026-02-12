"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";
import { HalaqohMentor } from "@/types/halaqoh";

export function useHalaqohMentors() {
  const queryParams = useGetParams();

  return useQuery<BaseApiResponse<HalaqohMentor[]>>({
    queryKey: ["HalaqohMentors", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<HalaqohMentor[]>>(
        apiUrl.halaqohMentors,
        queryParams,
      ),
  });
}

export function useCreateHalaqohMentor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<HalaqohMentor>) =>
      (await api.post(apiUrl.halaqohMentors, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["HalaqohMentors"] }),
  });
}

export function useUpdateHalaqohMentor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: Partial<HalaqohMentor> & { id: number }) =>
      (await api.put(`${apiUrl.halaqohMentors}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["HalaqohMentors"] }),
  });
}

export function useDeleteHalaqohMentor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string | number }) =>
      (await api.delete(`${apiUrl.halaqohMentors}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["HalaqohMentors"] }),
  });
}
