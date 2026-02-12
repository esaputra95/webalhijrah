"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";
import { HalaqohParticipant } from "@/types/halaqoh";

export function useHalaqohParticipants(params?: {
  halaqoh_id?: number | string;
  user_id?: number | string;
}) {
  const queryParams = useGetParams();
  const mergedParams = { ...queryParams, ...params };

  return useQuery<BaseApiResponse<HalaqohParticipant[]>>({
    queryKey: ["HalaqohParticipants", mergedParams],
    queryFn: async () =>
      getData<
        { halaqoh_id?: number | string; user_id?: number | string },
        BaseApiResponse<HalaqohParticipant[]>
      >(apiUrl.halaqohParticipants, mergedParams),
  });
}

export function useAssignHalaqohClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { user_id: number; halaqoh_id: number }) =>
      (await api.post(apiUrl.halaqohParticipants, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["HalaqohParticipants"] });
      qc.invalidateQueries({ queryKey: ["HalaqohRegistrations"] });
      qc.invalidateQueries({ queryKey: ["MyPrograms"] });
    },
  });
}
