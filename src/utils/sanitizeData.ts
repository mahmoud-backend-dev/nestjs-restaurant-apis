import { User } from "src/auth/schemas/user.schema";

export const sanitizeData = (data: User) => {
  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    role: data.role,
  }
}