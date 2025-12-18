import apiUrl from "@/lib/apiUrl";
import { getData } from "@/lib/fatching";
import { BaseApiResponse } from "@/types/apiType";
import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/types/postSchema";
import { DonationType } from "@/types/donationSchema";

export type DashboardType = {
  stats: {
    totalArticles: number;
    totalPrograms: number;
    totalDonations: number;
    totalRevenue: number;
  };
  recentDonations: DonationType[];
  recentArticles: PostType[];
};

export function useDashboard() {
  return useQuery<BaseApiResponse<DashboardType>>({
    queryKey: ["Dashboard"],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<DashboardType>>(
        apiUrl.dashboard
      ),
  });
}
