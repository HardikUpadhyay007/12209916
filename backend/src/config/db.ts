import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully.");
  } catch (error: any) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
