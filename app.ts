import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRouter from "./src/routes/AuthRouter";
import patientRouter from "./src/routes/PatientRouter";
import reviewRoutes from "./src/routes/ReviewRouter";
import { connectDB } from "./src/config/DataBase";
import favoriteRouter from "./src/routes/FavoriteRouter";
import bookingRouter from "../newnewnweONCall/src/routes/bookingsRoutes";
import appointmentsRoutes from "../newnewnweONCall/src/routes/appointmentsRoutes";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/dependants", patientRouter);
app.use("/api", reviewRoutes);
app.use("/api", favoriteRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/", favoriteRouter);
// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

connectDB();
app.listen(process.env.PORT, () => {
  console.log(`✅ Server is running on http://localhost:${process.env.PORT}`);
});
