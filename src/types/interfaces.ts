export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  fullName: string;
  mobileNumber: string;
  age: number;
  profileComplete: boolean;
}

export interface RegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  avatar: File | null;
}

export interface LogInForm {
  email: string;
  password: string;
}

export interface RegistrationErrors {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  avatar: string;
}

export interface LogInErrors {
  email: string;
  password: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ProfileForm {
  full_name: string;
  mobile_number: string;
  age: number;
  avatar: File | null;
}

export interface ProfileErrors {
  full_name: string;
  mobile_number: string;
  age: string;
}