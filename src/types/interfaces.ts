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
  avatar: File | string | null;
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
  avatar: File | string | null;
}

export interface ProfileErrors {
  full_name: string;
  mobile_number: string;
  age: string;
  avatar: string;
}

export interface SliderItem {
  title: string;
  description: string;
  buttonLabel: string;
  action: () => void;
  image: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  basePrice: string;
  durationWeeks: number;
  isFeatured: boolean;
  avgRating: number | null;
  reviewCount: number;
  category: Category;
  topic: Topic;
  instructor: Instructor;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Topic {
  id: number;
  name: string;
  categoryId: number;
}

export interface Instructor {
  id: number;
  name: string;
  avatar: string;
}

export interface Enrollment {
  id: number;
  quantity: number;
  totalPrice: string;
  progress: number;
  completedAt: Date | null;
  course: Course;
  schedule: {
    weeklySchedule: WeeklySchedule;
    timeSlot: TimeSlot;
    sessionType: SessionType;
    location: string;
  };
}

export interface WeeklySchedule {
  id: number;
  label: string;
  days: string[];
}

export interface TimeSlot {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
}

export interface SessionType {
  id: number;
  courseScheduleId: number;
  name: string;
  priceModifier: string;
  availableSeats: number;
  location: string | null;
}

export interface DummyCourse {
  id: number;
  course: {
    instructor: {
      name: string;
    };
    avgRating: number;
    title: string;
  };
  progress: number;
}

export interface CoursesResponse {
  success: boolean;
  courses: Course[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  serverErrors?: undefined;
}

export interface ExtendedCourse {
  id: number;
  title: string;
  description: string;
  image: string;
  basePrice: string;
  durationWeeks: number;
  hours: number;
  isFeatured: boolean;
  reviews: Review[];
  isRated: boolean;
  category: Category;
  topic: Topic;
  instructor: Instructor;
  enrollment: Enrollment | null;
}

export interface Review {
  userId: number;
  rating: number;
}

export interface EnrollmentForm {
  courseId: number;
  courseScheduleId: number;
  force: boolean;
}

export interface EnrollmentConflict {
  requestedCourseId: number;
  conflictingEnrollmentId: number;
  conflictingCourseName: string;
  schedule: string;
}
