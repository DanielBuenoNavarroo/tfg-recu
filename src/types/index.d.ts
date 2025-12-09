export interface User {
  id: number;
  fullName: string;
  email: string;
  status: "PENDING" | "APPROVED" | "BLOCKED";
  role: "AUTHOR" | "ADMIN" | "DEFAULT";
  lastActivityDate: Date;
  createdAt: Date;
}
