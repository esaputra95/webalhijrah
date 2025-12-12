"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PostType } from "@/types/postSchema";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";

// ====== Fetch Posts ======
export function usePosts() {
  const queryParams = useGetParams();

  return useQuery<BaseApiResponse<PostType[]>>({
    queryKey: ["Posts", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<PostType[]>>(
        apiUrl.posts,
        queryParams
      ),
  });
}

// ====== Create Post ======
export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PostType>) =>
      (await api.post(apiUrl.posts, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Posts"] }),
  });
}

// ====== Update Post ======
export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: string } & Partial<PostType>) =>
      (await api.put(`${apiUrl.posts}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Posts"] }),
  });
}

// ====== Delete Post ======
export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      (await api.delete(`${apiUrl.posts}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Posts"] }),
  });
}
