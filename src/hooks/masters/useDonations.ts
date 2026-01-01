"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { DonationType } from "@/types/donationSchema";
import apiUrl from "@/lib/apiUrl";
import { BaseApiResponse } from "@/types/apiType";
import { getData } from "@/lib/fatching";
import useGetParams from "@/lib/useGetParams";

// ====== Fetch Donations ======
export function useDonations() {
  const queryParams = useGetParams();

  return useQuery<BaseApiResponse<DonationType[]>>({
    queryKey: ["Donations", queryParams],
    queryFn: async () =>
      getData<{ page?: number }, BaseApiResponse<DonationType[]>>(
        apiUrl.donations,
        queryParams
      ),
  });
}

// ====== Create Donation with Midtrans Payment ======
interface CreateDonationPayload {
  name?: string;
  amount: number;
  phone_number?: string;
  note?: string;
  slug?: string;
  code?: string;
}

interface CreateDonationResponse {
  status: boolean;
  message: string;
  data: {
    donation: DonationType;
    redirect_url: string;
    token: string;
  };
}

export function useCreateDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateDonationPayload) => {
      const response = await api.post<CreateDonationResponse>(
        apiUrl.donations,
        { ...payload, name: payload.name ?? "Hamba Allah" }
      );
      return response.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["Donations"] });

      // Automatically redirect to payment page if URL is provided
      if (data.data?.redirect_url) {
        window.location.href = data.data.redirect_url;
      }
    },
  });
}

// ====== Create Master Donation (Admin manual entry) ======
export function useCreateDonationMaster() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateDonationPayload) => {
      const response = await api.post(apiUrl.donationMaster, payload);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["Donations"] });
    },
  });
}

// ====== Update Master Donation ======
export function useUpdateDonationMaster() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: string } & Partial<DonationType>) =>
      (await api.put(`${apiUrl.donationMaster}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Donations"] }),
  });
}

// ====== Delete Master Donation ======
export function useDeleteDonationMaster() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      (await api.delete(`${apiUrl.donationMaster}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Donations"] }),
  });
}

// ====== Update Donation ======
export function useUpdateDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: string } & Partial<DonationType>) =>
      (await api.put(`${apiUrl.donations}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Donations"] }),
  });
}

// ====== Delete Donation ======
export function useDeleteDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      (await api.delete(`${apiUrl.donations}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Donations"] }),
  });
}

// ====== Check Donation Status by Invoice Number ======
export function useCheckDonationStatus(invoiceNumber?: string) {
  return useQuery<BaseApiResponse<DonationType>>({
    queryKey: ["DonationStatus", invoiceNumber],
    queryFn: async () => {
      const response = await api.get(`${apiUrl.donations}`, {
        params: { q: invoiceNumber, limit: 1 },
      });
      const donations = response.data?.data || [];
      return {
        ...response.data,
        data: donations[0] || null,
      };
    },
    enabled: !!invoiceNumber,
  });
}
