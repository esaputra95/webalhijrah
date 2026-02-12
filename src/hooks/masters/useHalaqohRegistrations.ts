"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";
import {
  HalaqohParticipant,
  HalaqohRegistration,
  HalaqohAttendance,
} from "@/types/halaqoh";

export function useHalaqohRegistrations() {
  const queryParams = useGetParams();

  return useQuery<BaseApiResponse<HalaqohRegistration[]>>({
    queryKey: ["HalaqohRegistrations", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<HalaqohRegistration[]>>(
        apiUrl.halaqohRegistrations,
        queryParams,
      ),
  });
}

export function useCreateHalaqohRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<HalaqohRegistration>) =>
      (await api.post(apiUrl.halaqohRegistrations, payload)).data,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["HalaqohRegistrations"] }),
  });
}

export function useUpdateHalaqohRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: Partial<HalaqohRegistration> & { id: number }) =>
      (await api.put(`${apiUrl.halaqohRegistrations}/${id}`, payload)).data,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["HalaqohRegistrations"] }),
  });
}

export function useDeleteHalaqohRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string | number }) =>
      (await api.delete(`${apiUrl.halaqohRegistrations}/${id}`)).data,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["HalaqohRegistrations"] }),
  });
}

export function useMyPrograms() {
  return useQuery({
    queryKey: ["MyPrograms"],
    queryFn: async () =>
      getData<
        { _: "" },
        BaseApiResponse<{
          participations: HalaqohParticipant[];
          registrations: HalaqohRegistration[];
        }>
      >(apiUrl.halaqohMyPrograms, { _: "" }),
  });
}

export function useMyParticipation(id: string | number) {
  return useQuery({
    queryKey: ["MyParticipation", id],
    queryFn: async () =>
      getData<
        { _: "" },
        BaseApiResponse<
          HalaqohParticipant & { attendance: HalaqohAttendance[] }
        >
      >(`${apiUrl.halaqohMyPrograms}/${id}`, { _: "" }),
    enabled: !!id,
  });
}

export function useFollowUpHalaqoh() {
  return useMutation({
    mutationFn: async (payload: { targets: string[]; message: string }) =>
      (await api.post(apiUrl.halaqohFollowUp, payload)).data,
  });
}
