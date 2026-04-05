import type { RegistrationForm } from "../types/interfaces";
import { useAxios } from "./useAxios";
import Cookies from "js-cookie";

export const useAuthorize = () => {
  const { sendRequest, data, error } = useAxios();

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

      if (data.value?.token) {
        Cookies.set("token", data.value.token, { expires: 365 });
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  return { register };
};
