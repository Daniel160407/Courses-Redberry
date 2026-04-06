import { ref, type Ref } from "vue";
import axios, { type AxiosRequestConfig, AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/interfaces";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json"
  }
});

interface CustomAxiosConfig extends AxiosRequestConfig {
  useToken?: boolean;
}

interface UseAxiosReturn<T> {
  data: Ref<T | null>;
  error: Ref<ApiErrorResponse | string | null>;
  loading: Ref<boolean>;
  sendRequest: (config: CustomAxiosConfig) => Promise<T>;
}

export function useAxios<T = any>(): UseAxiosReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<ApiErrorResponse | string | null>(null);
  const loading = ref<boolean>(false);

  const sendRequest = async (config: CustomAxiosConfig): Promise<T> => {
    loading.value = true;
    error.value = null;

    if (config.useToken) {
      const token = Cookies.get("token");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
    }

    try {
      const response = await apiClient.request<T>(config);
      data.value = response.data;
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      error.value = axiosError.response?.data || axiosError.message || "An error occurred";
      throw axiosError;
    } finally {
      loading.value = false;
    }
  };

  return { data, error, loading, sendRequest };
}
