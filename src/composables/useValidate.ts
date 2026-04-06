import type {
  LogInErrors,
  LogInForm,
  ProfileErrors,
  ProfileForm,
  RegistrationErrors,
  RegistrationForm
} from "../types/interfaces";

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

  const validateLogIn = (formData: LogInForm) => {
    const errors: LogInErrors = {
      email: "",
      password: ""
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) errors.email = "Please enter a valid email address";
    if (formData.password.length < 3) errors.password = "Password must contain at least 3 symbols ";

    const isValid = !Object.values(errors).some((error) => error !== "");

    return { errors, isValid };
  };

  const validateProfileDetails = (formData: ProfileForm) => {
    const errors: ProfileErrors = {
      full_name: "",
      mobile_number: "",
      age: ""
    };

    if (formData.full_name.length === 0) {
      errors.full_name = "Name is required";
    } else if (formData.full_name.length < 3) {
      errors.full_name = "Name must be at least 3 characters";
    } else if (formData.full_name.length > 50) {
      errors.full_name = "Name must not exceed 50 characters";
    }

    const rawMobile = formData.mobile_number.toString().trim();

    if (rawMobile.length === 0) {
      errors.mobile_number = "Mobile number is required";
    } else if (!/^\d+$/.test(rawMobile)) {
      errors.mobile_number = "Please enter a valid Georgian mobile number (9 digits starting with 5)";
    } else if (rawMobile.length !== 9) {
      errors.mobile_number = "Mobile number must be exactly 9 digits";
    } else if (!rawMobile.startsWith("5")) {
      errors.mobile_number = "Georgian mobile numbers must start with 5";
    }

    if (!formData.age) {
      errors.age = "Age is required";
    } else if (isNaN(formData.age)) {
      errors.age = "Age must be a number";
    } else if (formData.age < 16) {
      errors.age = "You must be at least 16 years old to enroll";
    } else if (formData.age > 120) {
      errors.age = "Please enter a valid age";
    }

    const isValid = !Object.values(errors).some((error) => error !== "");

    return {
      errors,
      isValid
    };
  };

  return {
    validateRegistration,
    validateLogIn,
    validateProfileDetails
  };
};
