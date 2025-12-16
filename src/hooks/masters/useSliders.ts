"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { SliderType } from "@/types/masters/silderSchema";
import apiUrl from "@/lib/apiUrl";
import useGetParams from "@/lib/useGetParams";

type SliderResponse = {
  status: boolean;
  message: string;
  data: SliderType[];
};

// Hook untuk fetch hero sliders (untuk landing page)
export function useHeroSliders(
  type: "hero-slider" | "banner" | "promo" | "donation" | "about_us"
) {
  return useQuery<SliderResponse>({
    queryKey: ["HeroSliders", type],
    queryFn: async () => {
      const response = await api.get<SliderResponse>(apiUrl.sliders, {
        params: { type: type },
      });
      return response.data;
    },
  });
}

// Hook untuk fetch all sliders (untuk admin page dengan pagination)
export function useSliders() {
  const queryParams = useGetParams();

  return useQuery<SliderResponse>({
    queryKey: ["Sliders", queryParams],
    queryFn: async () => {
      const response = await api.get<SliderResponse>(apiUrl.sliders, {
        params: queryParams,
      });
      return response.data;
    },
  });
}

// Hook untuk create slider
export function useCreateSlider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<SliderType>) =>
      (await api.post(apiUrl.sliders, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["Sliders"] });
      qc.invalidateQueries({ queryKey: ["HeroSliders"] });
    },
  });
}

// Hook untuk update slider
export function useUpdateSlider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: Partial<SliderType> & { id: number }) =>
      (await api.put(`${apiUrl.sliders}/${id}`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["Sliders"] });
      qc.invalidateQueries({ queryKey: ["HeroSliders"] });
    },
  });
}

// Hook untuk delete slider
export function useDeleteSlider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      (await api.delete(`${apiUrl.sliders}/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["Sliders"] });
      qc.invalidateQueries({ queryKey: ["HeroSliders"] });
    },
  });
}
