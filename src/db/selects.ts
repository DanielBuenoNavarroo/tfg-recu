import { users } from "./schema";

export const publicUserFields = {
  id: users.id,
  fullName: users.fullName,
  email: users.email,
  status: users.status,
  role: users.role,
  lastActivityDate: users.lastActivityDate,
  createdAt: users.createdAt,
};
