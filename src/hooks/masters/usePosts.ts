"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PostType } from "@/types/postSchema";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";

// ====== Fetch Posts ======
export function usePosts(params?: Record<string, string | number | boolean>) {
  const queryParams = useGetParams();

  return useQuery<BaseApiResponse<PostType[]>>({
    queryKey: ["Posts", queryParams, params],
    queryFn: async () =>
      getData<Record<string, unknown>, BaseApiResponse<PostType[]>>(
        apiUrl.posts,
        {
          ...queryParams,
          ...params,
        }
      ),
  });
}

// ====== Fetch Public Posts (Custom Params) ======
export function usePublicPosts(
  params?: Record<string, string | number | boolean>
) {
  return useQuery<BaseApiResponse<PostType[]>>({
    queryKey: ["PublicPosts", params],
    queryFn: async () =>
      getData<typeof params, BaseApiResponse<PostType[]>>(apiUrl.posts, params),
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
