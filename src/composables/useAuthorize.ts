import type { LogInForm, ProfileForm, RegistrationForm } from "../types/interfaces";
import { useAxios } from "./useAxios";
import Cookies from "js-cookie";
import { useGlobalStore } from "@/stores/GlobalStore";
import { computed } from "vue";

export const useAuthorize = () => {
  const { sendRequest, data, error } = useAxios();
  const store = useGlobalStore();

  const isAuthenticated = (): boolean => {
    const token = Cookies.get("token");
    return !!token;
  };

  const isProfileComplete = computed(() => {
    return store.isProfileComplete;
  });

  const fetchUserInfo = async () => {
    try {
      await sendRequest({
        method: "GET",
        url: "/me",
        useToken: true
      });

      if (data.value?.data) {
        store.setIsProfileComplete(data.value.data.profileComplete);
        return data.value?.data;
      }
    } catch (err) {
      console.error("Login Error:", err);
      Cookies.remove("token");
      return null;
    }
  };

  const register = async (formData: RegistrationForm) => {
    try {
      const dataToSend = new FormData();
      dataToSend.append("username", formData.username);
      dataToSend.append("email", formData.email);
      dataToSend.append("password", formData.password);
      dataToSend.append("password_confirmation", formData.confirmPassword);

      if (formData.avatar) {
        dataToSend.append("avatar", formData.avatar);
      }

      await sendRequest({
        method: "POST",
        url: "/register",
        data: dataToSend,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (data.value?.data?.token) {
        Cookies.set("token", data.value.data.token, { expires: 365 });
      }

      return { success: true, user: data.value?.data?.user };
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  const logIn = async (formData: LogInForm) => {
    try {
      await sendRequest({
        method: "POST",
        url: "/login",
        data: formData
      });

      if (data.value?.data?.token) {
        Cookies.set("token", data.value.data.token, { expires: 365 });
      }

      return { success: true, user: data.value?.data?.user };
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const updateProfile = async (formData: ProfileForm) => {
    console.log(formData);
    try {
      await sendRequest({
        method: "PUT",
        url: "/profile",
        data: formData,
        useToken: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (data.value?.data) {
        return { success: true, user: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  return { isAuthenticated, isProfileComplete, fetchUserInfo, register, logIn, updateProfile };
};
