import { Context } from "../types/context";
import { IUser } from "../models/User";

export const requireAuth = (context: Context): IUser => {
  if (!context.user) {
    throw new Error("Not Authenticated");
  }
  return context.user;
};

export const requireAdmin = (context: Context): IUser => {
  const user = requireAuth(context);

  if (user.role !== "ADMIN") {
    throw new Error("Admion access only");
  }
  return user;
};
