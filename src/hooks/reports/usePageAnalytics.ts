import apiUrl from "@/lib/apiUrl";
import { getData } from "@/lib/fatching";
import { useQuery } from "@tanstack/react-query";
import { PageAnalyticsResponse } from "@/types/pageAnalytics";

export function usePageAnalytics(params?: Record<string, string | number>) {
  return useQuery<PageAnalyticsResponse>({
    queryKey: ["PageAnalytics", params],
    queryFn: async () =>
      getData<typeof params, PageAnalyticsResponse>(apiUrl.pageAnalytics, params),
  });
}
