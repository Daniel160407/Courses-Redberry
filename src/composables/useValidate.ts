import type { RegistrationErrors, RegistrationForm } from "../types/interfaces";

export const useValidate = () => {
  const validateRegistration = (formData: RegistrationForm) => {
    const errors: RegistrationErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: ""
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (formData.username.length < 3) errors.username = "Username must contain at least 3 symbols";
    if (!emailRegex.test(formData.email)) errors.email = "Please enter a valid email address";
    if (formData.password.length < 3) errors.password = "Password must contain at least 3 symbols";
    if (formData.confirmPassword !== formData.password) errors.confirmPassword = "Passwords do not match";
    if (formData.avatar && !allowedTypes.includes(formData.avatar.type)) {
      errors.avatar = "Profile image should be .jpg, .png or .webp";
    }

    const isValid = !Object.values(errors).some((error) => error !== "");

    return { errors, isValid };
  };

  return {
    validateRegistration
  };
};
