"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { TermType } from "@/types/termSchema";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";

// ====== Fetch Terms ======
export function useTerms() {
  const queryParams = useGetParams();

  return useQuery<BaseApiResponse<TermType[]>>({
    queryKey: ["Terms", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<TermType[]>>(
        apiUrl.terms,
        queryParams
      ),
  });
}

// ====== Create Term ======
export function useCreateTerm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<TermType>) =>
      (await api.post(apiUrl.terms, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Terms"] }),
  });
}

// ====== Update Term ======
export function useUpdateTerm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: string } & Partial<TermType>) =>
      (await api.put(`${apiUrl.terms}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Terms"] }),
  });
}

// ====== Delete Term ======
export function useDeleteTerm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      (await api.delete(`${apiUrl.terms}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Terms"] }),
  });
}
