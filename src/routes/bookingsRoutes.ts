import express from "express";
import { authorizeRole } from "../middlewares/authMiddleWare";
import {
  getAllBookings,
  getBookingsByPatientId,
  getBookingsByHealthCareProviderId,
  createBooking,
  updateBookingDate,
  updateBookingTime,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookings.controller";

const router = express.Router();

// ✅ Get all bookings
router.get("/", getAllBookings);

// ✅ Get bookings for logged-in patient
router.get("/patient", authorizeRole, getBookingsByPatientId);

// ✅ Get bookings for logged-in healthcare provider
router.get("/provider", authorizeRole, getBookingsByHealthCareProviderId);

// ✅ Create a booking — single endpoint, provider type in body
router.post("/:serviceProviderId", authorizeRole, createBooking);
router.post("/", authorizeRole, createBooking);
router.post("/bookings/:doctorId", (req, res) => {
  res.status(200).json({ message: "Route works!" });
});
// ✅ Update booking fields
router.put("/:bookingId/date", authorizeRole, updateBookingDate);
router.put("/:bookingId/time", authorizeRole, updateBookingTime);
router.put("/:bookingId/status", authorizeRole, updateBookingStatus);

// ✅ Delete booking
router.delete("/:bookingId", authorizeRole, deleteBooking);

export default router;
