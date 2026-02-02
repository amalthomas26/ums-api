import { UserModel } from "../models/User";
import { signToken } from "../utils/jwt";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { Context } from "../types/context";
import { RegisterUserArgs, LoginUser } from "../types/args";

import bcrypt from "bcrypt";

export const resolvers = {
  Query: {
    users: async (
      _: unknown,
      args: { page?: number; limit?: number; search?: string },
      context: Context,
    ) => {
      requireAdmin(context);
      const page = args.page ?? 1;
      const limit = args.limit ?? 10;
      const skip = (page - 1) * limit;

      const filter: any = {};
      if (args.search) {
        filter.name = { $regex: args.search, $options: "i" };
      }
      return UserModel.find(filter).skip(skip).limit(limit);
    },
    user: async (_: unknown, args: { id: string }, context: Context) => {
      requireAdmin(context);
      return UserModel.findById(args.id);
    },
    me: (_: unknown, __: unknown, context: Context) => {
      requireAuth(context);
      return context.user;
    },
  },
  Mutation: {
    registerUser: async (_: unknown, { input }: RegisterUserArgs) => {
      const { name, email, password } = input;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error("user already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role: "USER",
      });

      return user;
    },
    login: async (_: unknown, { input }: LoginUser) => {
      const { email, password } = input;
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Email does'nt exist");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }
      const token = signToken({ id: user.id, role: user.role });
      return { token, user };
    },
    deleteUser: async (_: unknown, args: { id: string }, context: Context) => {
      requireAdmin(context);
      const result = await UserModel.findByIdAndDelete(args.id);
      return !!result;
    },
  },
};
