import apiUrl from "@/lib/apiUrl";
import { deleteData, getData, postData } from "@/lib/fatching";
import { BaseApiResponse } from "@/types/apiType";
import { SettingType } from "@/types/settingSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { groupSettings } from "@/lib/utils";
import useGetParams from "@/lib/useGetParams";

export const useSettings = () => {
  const params = useGetParams();
  return useQuery<BaseApiResponse<SettingType[]>>({
    queryKey: ["settings", params],
    queryFn: () => getData(apiUrl.settings, params),
  });
};

export const useGroupedSettings = () => {
  const { data, ...rest } = useSettings();

  const groupedSettings = useMemo(() => {
    return groupSettings(data?.data);
  }, [data?.data]);

  return { ...rest, data: groupedSettings };
};

export const useSetting = (id?: number) => {
  return useQuery<BaseApiResponse<SettingType>>({
    queryKey: ["setting", id],
    queryFn: () => getData(`${apiUrl.settings}/${id}`),
    enabled: !!id,
  });
};

export const useSaveSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SettingType>) =>
      postData(apiUrl.settings, data, { id: data.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

export const useDeleteSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteData(apiUrl.settings, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};
