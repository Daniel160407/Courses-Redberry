import type { LogInForm, RegistrationForm } from "../types/interfaces";
import { useAxios } from "./useAxios";
import Cookies from "js-cookie";

export const useAuthorize = () => {
  const { sendRequest, data, error } = useAxios();

  const isAuthenticated = (): boolean => {
    const token = Cookies.get("token");
    return !!token;
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

      return { success: true };
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
        return { success: true };
      }

      return { success: true };
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  return { isAuthenticated, register, logIn };
};
