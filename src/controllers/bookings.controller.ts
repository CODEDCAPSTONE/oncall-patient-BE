import { Request, Response, NextFunction } from "express";
import cron from "node-cron";
import moment from "moment";
import Booking from "../models/Bookings";
import Patient from "../models/Patients";
import Doctor from "../models/Doctor";
import Physio from "../models/Physiotherapist";
import Labs from "../models/Lab";
import { sendNotification } from "../utils/sendNotification";

// Store cron jobs for cleanup
const activeCronJobs = new Map<string, any>();

// ✅ Get all bookings
export const getAllBookings = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await Booking.find()
      .populate("patient")
      .populate("serviceProvider")
      .exec();

    res.status(200).json({ bookings });
  } catch (error) {
    next(error);
  }
};

// ✅ Get bookings by logged-in patient
export const getBookingsByPatientId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: patientId } = (req as any).user;

    const bookings = await Booking.find({ patient: patientId })
      .populate("serviceProvider")
      .exec();

    res.status(200).json({ bookings });
  } catch (error) {
    next(error);
  }
};

// ✅ Get bookings by logged-in healthcare provider
export const getBookingsByHealthCareProviderId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: providerId } = (req as any).user;

    const bookings = await Booking.find({ serviceProvider: providerId })
      .populate("patient")
      .exec();

    res.status(200).json({ bookings });
  } catch (error) {
    next(error);
  }
};

// ✅ Create booking (general)
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serviceProviderId } = req.params;
    const { date, time, type, location, notes, providerType } = req.body;
    const { _id: patientId } = (req as any).user;

    console.log("➡️ Received booking request");
    console.log("🔍 Patient ID:", patientId);
    console.log("📍 Service Provider ID:", serviceProviderId);
    console.log("🩺 Provider Type:", providerType);

    if (!providerType || !["doctor", "physio", "lab"].includes(providerType)) {
      return res
        .status(400)
        .json({
          message: "Invalid or missing providerType (doctor, physio, lab)",
        });
    }

    if (!date || !time || !type || !location) {
      return res
        .status(400)
        .json({
          message: "Missing required fields: date, time, type, location",
        });
    }

    const newBooking = await Booking.create({
      patient: patientId,
      serviceProvider: serviceProviderId,
      status: "Pending",
      date,
      time,
      type,
      location,
      notes,
    });

    await Patient.findByIdAndUpdate(patientId, {
      $push: { bookings: newBooking._id },
    }).exec();

    if (providerType === "doctor") {
      await Doctor.findByIdAndUpdate(serviceProviderId, {
        $push: { bookings: newBooking._id },
      }).exec();
    } else if (providerType === "physio") {
      await Physio.findByIdAndUpdate(serviceProviderId, {
        $push: { bookings: newBooking._id },
      }).exec();
    } else if (providerType === "lab") {
      await Labs.findByIdAndUpdate(serviceProviderId, {
        $push: { bookings: newBooking._id },
      }).exec();
    }

    await sendNotification(
      patientId,
      "Your booking has been confirmed.",
      "booking confirmation"
    );

    // 🕑 Fixed: Cron Reminder with proper cleanup
    const reminderTime = moment(date).subtract(1, "hour").toDate();
    const cronJobId = `booking-${newBooking._id}-${reminderTime.getTime()}`;

    // Only schedule if reminder time is in the future
    if (reminderTime > new Date()) {
      const cronJob = cron.schedule(
        `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1
        } *`,
        async () => {
          try {
            await sendNotification(
              patientId,
              "Reminder: Your booking is in 1 hour.",
              "reminder"
            );
          } catch (err) {
            console.error("Reminder job failed", err);
          } finally {
            // Clean up the job after execution
            activeCronJobs.delete(cronJobId);
          }
        }
      );

      // Store the job reference for potential cleanup
      activeCronJobs.set(cronJobId, cronJob);
      cronJob.start();
    }

    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("❌ Booking failed", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ✅ Update booking date
export const updateBookingDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { date } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { date },
      { new: true }
    ).exec();
    res.status(200).json({ updatedBooking });
  } catch (error) {
    next(error);
  }
};

// ✅ Update booking time
export const updateBookingTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { time } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { time },
      { new: true }
    ).exec();
    res.status(200).json({ updatedBooking });
  } catch (error) {
    next(error);
  }
};

// ✅ Update booking status
export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).exec();
    res.status(200).json({ updatedBooking });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete booking
export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(bookingId).exec();
    res.status(200).json({ deletedBooking });
  } catch (error) {
    next(error);
  }
};

// Add cleanup function for cron jobs
export const cleanupCronJobs = () => {
  activeCronJobs.forEach((job, id) => {
    job.stop();
    activeCronJobs.delete(id);
  });
};
