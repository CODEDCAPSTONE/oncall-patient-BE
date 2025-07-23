import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/DataBase";

dotenv.config();

const PORT = process.env.PORT

connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
