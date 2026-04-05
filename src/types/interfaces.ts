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
