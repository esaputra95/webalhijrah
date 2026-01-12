export interface BaseApiResponse<T = unknown> {
  data?: T;
  metaData: MetaData;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface MetaData {
  page: number;
  limit: number;
  total: number;
  nextPage: number | null;
  totalPage: number;
  total_amount?: number;
}
