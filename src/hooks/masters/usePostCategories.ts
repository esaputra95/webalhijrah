"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PostCategoryType } from "@/types/postCategorySchema";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";

export function usePostCategories() {
  const queryParams = useGetParams();

  return useQuery<BaseApiResponse<PostCategoryType[]>>({
    queryKey: ["PostCategories", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<PostCategoryType[]>>(
        apiUrl.postCategories,
        queryParams
      ),
  });
}

export function useCreatePostCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PostCategoryType>) =>
      (await api.post(apiUrl.postCategories, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["PostCategories"] }),
  });
}

export function useUpdatePostCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: Partial<PostCategoryType> & { id: number }) =>
      (await api.put(`${apiUrl.postCategories}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["PostCategories"] }),
  });
}

export function useDeletePostCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      (await api.delete(`${apiUrl.postCategories}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["PostCategories"] }),
  });
}

export function usePostCategroyType(type: "article" | "program") {
  return useQuery<BaseApiResponse<PostCategoryType[]>>({
    queryKey: ["PostCategroyType", type],
    queryFn: async () => {
      const response = await api.get<BaseApiResponse<PostCategoryType[]>>(
        apiUrl.postCategories,
        {
          params: { q: type },
        }
      );
      return response.data;
    },
  });
}
