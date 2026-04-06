import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { User } from "../types/interfaces";

export const useGlobalStore = defineStore("globalStore", () => {
  const loadingCount = ref<number>(0);
  const user = ref<User | null>(null);

  const fetching = computed(() => loadingCount.value > 0);

  const setUser = (userData: User | null) => {
    user.value = userData;
  };

  const withLoading = async <T>(fn: () => Promise<T>) => {
    loadingCount.value++;
    try {
      return await fn();
    } finally {
      loadingCount.value--;
    }
  };

  const setData = async () => {
    await Promise.allSettled([]);
  };

  return {
    fetching,

    user,

    setData,
    setUser
  };
});
