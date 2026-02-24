import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserType } from "@/types/userSchema";
import { getData, postData, deleteData } from "@/lib/fatching";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import useGetParams from "@/lib/useGetParams";

export function useUsers() {
  const params = useGetParams();
  return useQuery<BaseApiResponse<UserType[]>>({
    queryKey: ["users", params],
    queryFn: () => getData(apiUrl.users, params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UserType) => postData(apiUrl.users, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserType> }) =>
      postData(apiUrl.users, data, { id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteData(apiUrl.users, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
