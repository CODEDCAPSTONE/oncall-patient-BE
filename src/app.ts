import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { connectDB, disconnectDB } from "./config/DataBase";
import { cleanupCronJobs } from "./controllers/bookings.controller";

// Middleware handlers
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";

// Routes
import appointmentsRoutes from "./routes/appointmentsRoutes";
import bookingsRoutes from "./routes/bookingsRoutes";
import availabilityRoutes from "./routes/availablityRoutes";
import analyzeRoutes from "./routes/analyzeRoutes";
import providerRoutes from "./routes/providerRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import chatroomRoutes from "./routes/chatroomRoutes";
import messageRoutes from "./routes/messageRoutes";
import callRoutes from "./routes/callRoutes";
import medicalReportRoutes from "./routes/medicalReportRoutes";
import prescriptionRoutes from "./routes/prescriptionRoutes";
import authRouter from "./routes/AuthRouter";
import dependentsRoutes from "../src/routes/dependentsRoutes";
import router from "./routes/AuthRouter";
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ message: "OnCall API is running ✅" });
});

// Mount routes
app.use("/auth", authRouter);
app.use("/dependents", dependentsRoutes); // ✅ mounts /dependents
app.use("/api", router);
app.use("/appointments", appointmentsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/availability", availabilityRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/chatrooms", chatroomRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/reports", medicalReportRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// Not found & error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(() => {
    console.log('✅ HTTP server closed');
  });

  // Cleanup cron jobs
  cleanupCronJobs();
  console.log('✅ Cron jobs cleaned up');

  // Disconnect database
  try {
    await disconnectDB();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting database:', error);
  }

  // Exit process
  process.exit(0);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
