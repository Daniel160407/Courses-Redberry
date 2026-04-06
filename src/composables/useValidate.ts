import { reactive, watch, toValue } from "vue";
import type { LogInErrors, ProfileErrors, RegistrationErrors } from "../types/interfaces";

export const useValidate = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  const useRegistrationValidate = (formData: any) => {
    const errors = reactive<RegistrationErrors>({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: ""
    });
    const touched = reactive({ username: false, email: false, password: false, confirmPassword: false });

    watch(
      () => toValue(formData),
      (newData) => {
        if (newData.username !== "") touched.username = true;
        if (newData.email !== "") touched.email = true;
        if (newData.password !== "") touched.password = true;
        if (newData.confirmPassword !== "") touched.confirmPassword = true;

        // Username
        if (touched.username && newData.username.length === 0) errors.username = "Name is required";
        else if (newData.username.length > 0 && newData.username.length < 3)
          errors.username = "Username must contain at least 3 symbols";
        else errors.username = "";

        // Email
        if (touched.email && newData.email.length === 0) errors.email = "Email is required";
        else if (newData.email.length > 0 && !emailRegex.test(newData.email))
          errors.email = "Please enter a valid email address";
        else errors.email = "";

        // Password
        if (touched.password && newData.password.length === 0) errors.password = "Password is required";
        else if (newData.password.length > 0 && newData.password.length < 3)
          errors.password = "Password must contain at least 3 symbols";
        else errors.password = "";

        // Confirm Password
        if (touched.confirmPassword && newData.confirmPassword !== newData.password)
          errors.confirmPassword = "Passwords do not match";
        else errors.confirmPassword = "";

        // Avatar
        if (newData.avatar && !allowedTypes.includes(newData.avatar.type))
          errors.avatar = "Profile image should be .jpg, .png or .webp";
        else errors.avatar = "";
      },
      { deep: true, immediate: true }
    );

    return errors;
  };

  const useLogInValidate = (formData: any) => {
    const errors = reactive<LogInErrors>({ email: "", password: "" });
    const touched = reactive({ email: false, password: false });

    watch(
      () => toValue(formData),
      (newData) => {
        if (newData.email !== "") touched.email = true;
        if (newData.password !== "") touched.password = true;

        // Email
        if (touched.email && newData.email.length === 0) errors.email = "Email is required";
        else if (newData.email.length > 0 && !emailRegex.test(newData.email))
          errors.email = "Please enter a valid email address";
        else errors.email = "";

        // Password
        if (touched.password && newData.password.length === 0) errors.password = "Password is required";
        else if (newData.password.length > 0 && newData.password.length < 3)
          errors.password = "Password must contain at least 3 symbols";
        else errors.password = "";
      },
      { deep: true, immediate: true }
    );

    return errors;
  };

  const useProfileValidate = (formData: any) => {
    const errors = reactive<ProfileErrors>({ full_name: "", mobile_number: "", age: "" });
    const touched = reactive({ full_name: false, mobile_number: false, age: false });

    watch(
      () => toValue(formData),
      (newData) => {
        if (newData.full_name !== "") touched.full_name = true;
        if (newData.mobile_number !== "") touched.mobile_number = true;
        if (newData.age !== 0 && newData.age !== "") touched.age = true;

        // Full Name
        if (touched.full_name && newData.full_name.length === 0) errors.full_name = "Name is required";
        else if (newData.full_name.length > 0 && newData.full_name.length < 3)
          errors.full_name = "Name must be at least 3 characters";
        else if (newData.full_name.length > 50) errors.full_name = "Name must not exceed 50 characters";
        else errors.full_name = "";

        // Mobile
        const rawMobile = newData.mobile_number.toString().trim();
        if (touched.mobile_number && rawMobile.length === 0) errors.mobile_number = "Mobile number is required";
        else if (rawMobile.length > 0) {
          if (!/^\d+$/.test(rawMobile))
            errors.mobile_number = "Please enter a valid Georgian mobile number (9 digits starting with 5)";
          else if (rawMobile.length !== 9) errors.mobile_number = "Mobile number must be exactly 9 digits";
          else if (!rawMobile.startsWith("5")) errors.mobile_number = "Georgian mobile numbers must start with 5";
          else errors.mobile_number = "";
        } else errors.mobile_number = "";

        // Age
        const ageValue = newData.age;
        if (touched.age && (ageValue === "" || ageValue === null)) errors.age = "Age is required";
        else if (ageValue !== "" && ageValue !== null) {
          if (isNaN(Number(ageValue))) errors.age = "Age must be a number";
          else if (Number(ageValue) < 16) errors.age = "You must be at least 16 years old to enroll";
          else if (Number(ageValue) > 120) errors.age = "Please enter a valid age";
          else errors.age = "";
        } else errors.age = "";
      },
      { deep: true, immediate: true }
    );

    return errors;
  };

  return { useRegistrationValidate, useLogInValidate, useProfileValidate };
};
