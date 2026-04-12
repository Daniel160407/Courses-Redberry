import type { LogInForm, ProfileForm, RegistrationForm } from "../types/interfaces";
import { useAxios } from "./useAxios";
import Cookies from "js-cookie";
import { useGlobalStore } from "@/stores/GlobalStore";
import { storeToRefs } from "pinia";

export const useAuthorize = () => {
  const { sendRequest, data, error } = useAxios();
  const { user, isAuthorized, isProfileComplete } = storeToRefs(useGlobalStore());

  const saveAuthToken = (token?: string) => {
    if (token) {
      Cookies.set("token", token, { expires: 365 });
    }
  };

  const fetchUserInfo = async () => {
    if (!isAuthorized.value) return;

    try {
      await sendRequest({
        method: "GET",
        url: "/me",
        useToken: true
      });

      return data.value?.data;
    } catch (err) {
      console.error("Fetch User Info Error:", err);
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

      saveAuthToken(data.value?.data?.token);
      return { success: true, user: data.value?.data?.user };
    } catch (err) {
      console.error("Registration Error:", err);
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

      saveAuthToken(data.value?.data?.token);
      return { success: true, user: data.value?.data?.user };
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const updateProfile = async (formData: ProfileForm) => {
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
      console.error("Profile Update Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  return {
    isAuthenticated: isAuthorized,
    isProfileComplete,
    user,
    fetchUserInfo,
    register,
    logIn,
    updateProfile
  };
};
