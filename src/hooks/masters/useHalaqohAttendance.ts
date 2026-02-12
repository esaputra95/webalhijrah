import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import apiUrl from "@/lib/apiUrl";
import { HalaqohAttendance } from "@/types/halaqoh";
import { toast } from "react-toastify";
import { getData } from "@/lib/fatching";
import { BaseApiResponse } from "@/types/apiType";

export const useHalaqohAttendance = (halaqohId?: number, date?: string) => {
  return useQuery<HalaqohAttendance[]>({
    queryKey: ["halaqoh-attendance", halaqohId, date],
    queryFn: async () => {
      const response = await getData<
        { halaqoh_id?: number | string; date?: string },
        BaseApiResponse<HalaqohAttendance[]>
      >(apiUrl.halaqohAttendance, { halaqoh_id: halaqohId, date });
      return response.data || [];
    },
    enabled: !!halaqohId && !!date,
  });
};

export const useSaveHalaqohAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<HalaqohAttendance>[]) => {
      const response = await api.post(apiUrl.halaqohAttendance, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halaqoh-attendance"] });
      toast.success("Absensi berhasil disimpan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menyimpan absensi");
    },
  });
};
