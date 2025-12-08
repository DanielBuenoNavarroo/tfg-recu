export interface User {
  is_active: any;
  id: number;
  fullName: string;
  email: string;
  status: "PENDING" | "APROVED" | "BLOCKED";
  role: "AUTHOR" | "ADMIN" | "DEFAULT";
  lastActivityDate: Date;
  createdAt: Date;
}
