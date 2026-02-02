import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI: string | undefined = process.env.MONGO_URI;

export const connectDB = async (): Promise<void> => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env file");
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);

    process.exit(1);
  }
};
