//routes
export const DASHBOARD_ROUTE = "/dashboard" as const;
export const CATALOG_ROUTE = "/catalog" as const;
export const DASHBOARD_COURSE_ROUTE = "/dashboard/course/:id" as const;
export const CATALOG_COURSE_ROUTE = "/catalog/course/:id" as const;

//page names
export const DASHBOARD_PAGE_NAME = "dashboard" as const;
export const CATALOG_PAGE_NAME = "catalog" as const;

//Dropdown options
export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
  { label: "Title: A-Z", value: "title_asc" }
] as const;

export const WEEKLY_SCHEDULE_CONFIG = [
  { id: 1, label: "Monday - Wednesday", shortLabel: "Mon - Wed", days: ["monday", "wednesday"] },
  { id: 2, label: "Tuesday - Thursday", shortLabel: "Tue - Thu", days: ["tuesday", "thursday"] },
  { id: 3, label: "Friday - Saturday", shortLabel: "Fri - Sat", days: ["friday", "saturday"] },
  { id: 4, label: "Weekend Only", shortLabel: "Weekend", days: ["saturday", "sunday"] }
] as const;

export const TIME_SLOT_CONFIG = [
  { id: 1, label: "Morning", startTime: "9:00 AM", endTime: "11:00 AM" },
  { id: 2, label: "Afternoon", startTime: "12:00 PM", endTime: "6:00 PM" },
  { id: 3, label: "Evening", startTime: "6:00 PM", endTime: "8:00 PM" }
] as const;
