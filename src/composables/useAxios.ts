import { ref, type Ref } from "vue";
import axios, { type AxiosRequestConfig, AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

interface UseAxiosReturn {
  data: Ref<any>;
  error: Ref<string | null>;
  loading: Ref<boolean>;
  sendRequest: (config: AxiosRequestConfig) => Promise<void>;
}

export function useAxios(): UseAxiosReturn {
  const data = ref(null);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const sendRequest = async (config: AxiosRequestConfig) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient(config);
      data.value = response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      error.value =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "An error occurred";
      throw axiosError;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    error,
    loading,
    sendRequest,
  };
}
