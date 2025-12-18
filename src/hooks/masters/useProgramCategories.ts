import {
  ProgramCategoryCreateType,
  ProgramCategoryType,
} from "@/types/programCategorySchema";
import { BaseApiResponse } from "@/types/apiType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";

// --- Keys ---
export const programCategoriesKeys = {
  all: ["program-categories"] as const,
  list: (params: Record<string, string>) =>
    [...programCategoriesKeys.all, "list", params] as const,
  detail: (id: number) => [...programCategoriesKeys.all, "detail", id] as const,
};

// --- API Functions ---
const getProgramCategories = async (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  // Using BaseApiResponse<T> which seems to have data: T inside it according to usage
  const response = await api.get<BaseApiResponse<ProgramCategoryType[]>>(
    `/api/program-categories?${searchParams.toString()}`
  );
  return response.data;
};

const getProgramCategory = async (id: number) => {
  const response = await api.get<BaseApiResponse<ProgramCategoryType>>(
    `/api/program-categories/${id}`
  );
  return response.data;
};

const createProgramCategory = async (data: ProgramCategoryCreateType) => {
  const response = await api.post<BaseApiResponse<ProgramCategoryType>>(
    "/api/program-categories",
    data
  );
  return response.data;
};

const updateProgramCategory = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<ProgramCategoryCreateType>;
}) => {
  const response = await api.put<BaseApiResponse<ProgramCategoryType>>(
    `/api/program-categories/${id}`,
    data
  );
  return response.data;
};

const deleteProgramCategory = async ({ id }: { id: string | number }) => {
  const response = await api.delete<BaseApiResponse<null>>(
    `/api/program-categories/${id}`
  );
  return response.data;
};

// --- Hooks ---
export function useProgramCategories() {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  return useQuery({
    queryKey: programCategoriesKeys.list(params),
    queryFn: () => getProgramCategories(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useProgramCategory(id: number) {
  return useQuery({
    queryKey: programCategoriesKeys.detail(id),
    queryFn: () => getProgramCategory(id),
    enabled: !!id,
  });
}

export function useCreateProgramCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProgramCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programCategoriesKeys.all });
    },
  });
}

export function useUpdateProgramCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProgramCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programCategoriesKeys.all });
    },
  });
}

export function useDeleteProgramCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProgramCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programCategoriesKeys.all });
    },
  });
}
