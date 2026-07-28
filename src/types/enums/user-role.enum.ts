export const UserRole = {
  ADMIN: "admin",
  STAFF: "staff",
  CUSTOMER: "customer",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
