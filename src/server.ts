import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import { connectDB } from "./config/DataBase";

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("✅ Connected to MongoDB: OnCall Full Stack");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 8080;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 OnCall API Server is running at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error during DB connection or startup:", err);
    process.exit(1);
  });