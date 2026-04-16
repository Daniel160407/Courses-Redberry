import { reactive, toValue, watchEffect } from "vue";
import type { LogInErrors, ProfileErrors, RegistrationErrors } from "../types/interfaces";

export const useValidate = () => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_AVATAR_SIZE = 1024 * 1024;

  const validateEmail = (val: string, touched: boolean) => {
    if (!touched) return "";
    if (val.length === 0) return "Email is required";
    if (val.length > 0 && !EMAIL_REGEX.test(val)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (val: string, touched: boolean) => {
    if (!touched) return "";
    if (val.length === 0) return "Password is required";
    if (val.length > 0 && val.length < 3) return "Password must contain at least 3 symbols";
    return "";
  };

  const validateMobile = (val: any, touched: boolean) => {
    if (!touched) return "";
    const rawMobile = val.toString().trim();
    if (rawMobile.length === 0) return "Mobile number is required";
    if (rawMobile.length > 0) {
      if (!/^\d+$/.test(rawMobile)) {
        return "Please enter a valid Georgian mobile number (9 digits starting with 5)";
      }
      if (rawMobile.length !== 9) return "Mobile number must be exactly 9 digits";
      if (!rawMobile.startsWith("5")) return "Georgian mobile numbers must start with 5";
    }
    return "";
  };

  const validateAge = (val: any, touched: boolean) => {
    if (!touched) return "";
    if (val === "" || val === null) return "Age is required";
    if (val !== "" && val !== null) {
      if (isNaN(Number(val))) return "Age must be a number";
      if (Number(val) < 16) return "You must be at least 16 years old to enroll";
      if (Number(val) > 120) return "Please enter a valid age";
    }
    return "";
  };

  const validateAvatar = (file: File | string | null, touched: boolean) => {
    if (!touched) return "";
    if (file instanceof File) {
      if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
        return "Profile image should be .jpg, .png or .webp";
      }
      if (file.size > MAX_AVATAR_SIZE) {
        return "Image size should not exceed 1MB";
      }
    }
    return "";
  };

  const useRegistrationValidate = (formData: any) => {
    const errors = reactive<RegistrationErrors>({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: ""
    });
    const touched = reactive({ username: false, email: false, password: false, confirmPassword: false, avatar: false });

    const validate = () => {
      const newData = toValue(formData);

      if (touched.username && newData.username.length === 0) errors.username = "Name is required";
      else if (touched.username && newData.username.length > 0 && newData.username.length < 3) {
        errors.username = "Username must contain at least 3 symbols";
      } else errors.username = "";

      errors.email = validateEmail(newData.email, touched.email);
      errors.password = validatePassword(newData.password, touched.password);
      errors.avatar = validateAvatar(newData.avatar, touched.avatar);
      errors.confirmPassword =
        touched.confirmPassword && newData.confirmPassword !== newData.password ? "Passwords do not match" : "";
    };

    watchEffect(validate);

    const touchAll = () => {
      Object.keys(touched).forEach((key) => {
        touched[key as keyof typeof touched] = true;
      });
      validate();
    };

    const reset = () => {
      Object.keys(touched).forEach((key) => {
        touched[key as keyof typeof touched] = false;
      });
    };

    return { errors, touchAll, reset };
  };

  const useLogInValidate = (formData: any) => {
    const errors = reactive<LogInErrors>({ email: "", password: "" });
    const touched = reactive({ email: false, password: false });

    const validate = () => {
      const newData = toValue(formData);
      errors.email = validateEmail(newData.email, touched.email);
      errors.password = validatePassword(newData.password, touched.password);
    };

    watchEffect(validate);

    const touchAll = () => {
      Object.keys(touched).forEach((key) => {
        touched[key as keyof typeof touched] = true;
      });
      validate();
    };

    const reset = () => {
      Object.keys(touched).forEach((key) => {
        touched[key as keyof typeof touched] = false;
      });
    };

    return { errors, touchAll, reset };
  };

  const useProfileValidate = (formData: any) => {
    const errors = reactive<ProfileErrors>({ full_name: "", mobile_number: "", age: "", avatar: "" });
    const touched = reactive({ full_name: false, mobile_number: false, age: false, avatar: false });

    const validate = () => {
      const newData = toValue(formData);

      if (touched.full_name && newData.full_name.length === 0) errors.full_name = "Name is required";
      else if (touched.full_name && newData.full_name.length > 0 && newData.full_name.length < 3) {
        errors.full_name = "Name must be at least 3 characters";
      } else if (touched.full_name && newData.full_name.length > 50) {
        errors.full_name = "Name must not exceed 50 characters";
      } else errors.full_name = "";

      errors.mobile_number = validateMobile(newData.mobile_number, touched.mobile_number);
      errors.age = validateAge(newData.age, touched.age);
      errors.avatar = validateAvatar(newData.avatar, touched.avatar);
    };

    watchEffect(validate);

    const touchAll = () => {
      Object.keys(touched).forEach((key) => {
        touched[key as keyof typeof touched] = true;
      });
      validate();
    };

    const reset = () => {
      Object.keys(touched).forEach((key) => {
        touched[key as keyof typeof touched] = false;
      });
    };

    return { errors, touchAll, reset };
  };

  return { useRegistrationValidate, useLogInValidate, useProfileValidate };
};
