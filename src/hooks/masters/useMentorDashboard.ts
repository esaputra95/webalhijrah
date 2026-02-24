"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import { Halaqoh, HalaqohParticipant } from "@/types/halaqoh";

export function useMentorClasses() {
  return useQuery<BaseApiResponse<Halaqoh[]>>({
    queryKey: ["MentorClasses"],
    queryFn: async () =>
      getData<{ _: "" }, BaseApiResponse<Halaqoh[]>>(
        apiUrl.halaqohMentorClasses,
        { _: "" },
      ),
  });
}

export function useMentorStudents(halaqohId: number | null) {
  return useQuery<BaseApiResponse<HalaqohParticipant[]>>({
    queryKey: ["MentorStudents", halaqohId],
    queryFn: async () =>
      getData<{ halaqoh_id: number }, BaseApiResponse<HalaqohParticipant[]>>(
        apiUrl.halaqohMentorStudents,
        { halaqoh_id: halaqohId! },
      ),
    enabled: !!halaqohId,
  });
}

export function useUpdateStudentNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { participant_id: number; notes: string }) =>
      (await api.put(apiUrl.halaqohMentorStudentNotes, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["MentorStudents"] });
    },
  });
}
