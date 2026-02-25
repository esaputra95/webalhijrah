export type PageAnalyticsSummary = {
  totalViews: number;
  uniqueVisitors: number;
  uniqueIps: number;
  totalPages: number;
};

export type PageAnalyticsRow = {
  route_key: string;
  path: string;
  totalViews: number;
  uniqueVisitors: number;
  uniqueIps: number;
  latestIp: string | null;
  lastVisit: string | null;
};

export type PageAnalyticsTrend = {
  day: string | null;
  totalViews: number;
  uniqueVisitors: number;
};

export type PageAnalyticsData = {
  summary: PageAnalyticsSummary;
  rows: PageAnalyticsRow[];
  trends: PageAnalyticsTrend[];
};

export type PageAnalyticsResponse = {
  status: boolean;
  message: string;
  metaData: {
    page: number;
    limit: number;
    total: number;
    nextPage: number | null;
    totalPage: number;
    sortby: string;
    sort: "asc" | "desc";
  };
  data: PageAnalyticsData;
};
