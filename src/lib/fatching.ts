import type { AxiosResponse } from "axios";
import api from "./api";
import { handleErrorResponse } from "@/utils/handleErrorResponse";

type WithOptionalId = {
  id?: number;
};

const getData = async <Params = unknown, Response = unknown>(
  url: string,
  params?: Params
): Promise<Response> => {
  try {
    const response = await api.get<Response>(url, { params });
    return response.data;
  } catch (error) {
    throw handleErrorResponse(error);
  }
};

const postData = async <
  Body = unknown,
  Response = unknown,
  Params extends WithOptionalId = WithOptionalId
>(
  url: string,
  body: Body,
  params?: Params
): Promise<Response> => {
  try {
    if (!params?.id) {
      const response = await api.post<Response>(url, body, { params });
      return response.data;
    } else {
      const response = await api.put<Response>(`${url}/${params?.id}`, body, {
        params,
      });
      return response.data;
    }
  } catch (error) {
    throw handleErrorResponse(error);
  }
};

const deleteData = async <Response = unknown>(
  url: string,
  id: number
): Promise<Response> => {
  try {
    const response = await api.delete<Response>(`${url}/${id}`);
    return response.data;
  } catch (error) {
    throw handleErrorResponse(error);
  }
};

const getDataById = async <Response = unknown>(
  url: string,
  id: number | string
): Promise<Response> => {
  try {
    const response = await api.get<Response>(`${url}/${id}`);
    return response.data;
  } catch (error) {
    throw handleErrorResponse(error);
  }
};

const handleUpload = async (url: string, file: Blob) => {
  const formData = new FormData();
  formData.append("images", file);

  try {
    const response: AxiosResponse<{ data: string }> = await api.post(
      `${url}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { status: true, data: response.data.data };
  } catch (err) {
    return { status: false, data: JSON.stringify(err) };
  }
};

export { getData, postData, deleteData, getDataById, handleUpload };
