// import { Request, NextFunction, Response, Express } from "express";
// import Appointment from "../models/Appointment";
// import Doctor from "../models/Doctor";
// import Pateint from "../models/Patients";

// // CRUD for appointments
// // 1st. Read >> GET
// // get all appointments for both patients and doctors
// const getAllAppointments = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const appointments = await Appointment.find();
//     res.status(200).json(appointments);
//   } catch (error) {
//     next(error);
//   }
// };

// // get appointments by patient ID
// const getAppointmentsByPatientId = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // first get patient ID from req.user, why? because the patient is logged in
//     // const { patientId } = req.params;
//     const { pateintID } = (req as any).user.id; // assuming user is the logged in patient
//     // then findOne by patientID
//     const patientAppointments = await Appointment.find(pateintID).populate(
//       "doctor"
//     );
//     res.status(200).json(patientAppointments);
//   } catch (error) {
//     next(error);
//   }
// };

// // get appointments by doctor ID
// const getAppointmentsByDoctorId = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // first get doctor ID from req.user, why? because the patient is logged in
//     // const { doctortId } = req.params;
//     const { doctortId } = (req as any).user.id; // assuming user is the logged in doctor
//     // then find by doctortId
//     const doctorAppointments = await Appointment.find(doctortId).populate(
//       "patient"
//     );
//     res.status(200).json(doctorAppointments);
//   } catch (error) {
//     next(error);
//   }
// };

// // 2nd. Create >> POST
// // create a new appointment
// const makeAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // get appointment data from request body
//     const { type, date, time, duration } = req.body;
//     // type: online, offline, emergency
//     // status: upcoming, pending, done, cancelled
//     const { doctorID } = req.params; // user is the logged in health care provider
//     const { pateintID } = (req as any).user.id; // assuming user is the logged in patient
//     // create a new appointment
//     const newAppointment = await Appointment.create({
//       type,
//       date,
//       status: "Pending", // default status, it will show under pending appointments for the doctor they will accept or reject in FE
//       time,
//       duration,
//       // pateint: pateintID,
//       // doctor: doctorID,
//     });
//     const pateint = await Pateint.findByIdAndUpdate(pateintID, {
//       $push: { appointment: newAppointment._id },
//     });
//     const doctor = await Doctor.findByIdAndUpdate(doctorID, {
//       $push: { appointment: newAppointment._id },
//     });
//     const updatedApp = await Appointment.findByIdAndUpdate(newAppointment._id, {
//       $set: {
//         pateint: pateintID,
//         doctor: doctorID,
//       },
//     });
//     res.status(201).json(updatedApp);
//   } catch (error) {
//     next(error);
//   }
// };

// // 3rd. Update >> PUT
// // update an appointment date
// const updateDateAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { date } = req.body;
//     const { appointmentId } = req.params; // user is the logged in
//     // const { appointmentId } = (req as any).user.appointments._id; // assuming user is the logged in patient
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { date: date }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };
// // update an appointment time
// const updateTimeAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { time } = req.body;
//     const { appointmentId } = req.params; // user is the logged in
//     // const { appointmentId } = (req as any).user.appointments._id; // assuming user is the logged in patient
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { time: time }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };
// // update an appointment status
// const updateStatusAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { status } = req.body;
//     const { appointmentId } = req.params; // user is the logged in
//     // const { appointmentId } = (req as any).user.appointments._id; // assuming user is the logged in patient
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { status: status }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };
// // update an appointment type: // online, offline
// const updateTypeAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { type } = req.body;
//     const { appointmentId } = (req as any).user.appointments._id; // assuming user is the logged in patient
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { type: type }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };
// // update an appointment price, based on the type of appointment: online: 25KD, Offline 35KD or whatever we decide
// const updatePriceAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { price } = req.body;
//     const { appointmentId } = (req as any).user.appointments._id; // assuming user is the logged in patient
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { price: price }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };
// const updateDurationAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { duratoin } = req.body;
//     const { appointmentId } = (req as any).user.appointments._id; // assuming user is the logged in patient
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { duratoin: duratoin }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };
// // 4th. Delete >> DELETE
// // delete an appointment
// const deleteAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { appointmentId } = (req as any).user.appointments._id; // assuming user is the logged in patient
//     const deletedAppointment = await Appointment.findByIdAndDelete(
//       appointmentId
//     );
//     res.status(200).json({
//       message: "Appointment deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export {
//   getAllAppointments,
//   getAppointmentsByPatientId,
//   getAppointmentsByDoctorId,
//   makeAppointment,
//   updateDateAppointment,
//   updateTimeAppointment,
//   updateStatusAppointment,
//   updateTypeAppointment,
//   updatePriceAppointment,
//   updateDurationAppointment,
//   deleteAppointment,
// };

// import { Request, NextFunction, Response } from "express";
// import Appointment from "../models/Appointment";
// import Doctor from "../models/Doctor";
// import Patient from "../models/Patients";

// // Helper: calculate age from birthDay
// const calculateAge = (birthDay: Date | undefined) => {
//   if (!birthDay) return null;
//   const today = new Date();
//   const birth = new Date(birthDay);
//   let age = today.getFullYear() - birth.getFullYear();
//   const m = today.getMonth() - birth.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
//     age--;
//   }
//   return age;
// };

// // Get all appointments
// const getAllAppointments = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const appointments = await Appointment.find()
//       .populate("patient", "name gender birthDay")
//       .populate("doctor", "name speciality");

//     // Add age to patient
//     const enriched = appointments.map((app) => {
//       const appObj = app.toObject();
//       const patient = appObj.patient as any;
//       if (patient) {
//         patient.age = calculateAge(patient.birthDay);
//         delete patient.birthDay; // optional: remove birthDay if you don’t want to send it
//       }
//       return appObj;
//     });

//     res.status(200).json(enriched);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get appointments by patient ID
// const getAppointmentsByPatientId = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const patientID = (req as any).user.id;

//     const appointments = await Appointment.find({ patient: patientID })
//       .populate("doctor", "name speciality")
//       .populate("patient", "name gender birthDay");

//     const enriched = appointments.map((app) => {
//       const appObj = app.toObject();
//       const patient = appObj.patient as any;
//       if (patient) {
//         patient.age = calculateAge(patient.birthDay);
//         delete patient.birthDay;
//       }
//       return appObj;
//     });

//     res.status(200).json(enriched);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get appointments by doctor ID
// const getAppointmentsByDoctorId = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const doctorID = (req as any).user.id;

//     const appointments = await Appointment.find({ doctor: doctorID })
//       .populate("patient", "name gender birthDay")
//       .populate("doctor", "name speciality");

//     const enriched = appointments.map((app) => {
//       const appObj = app.toObject();
//       const patient = appObj.patient as any;
//       if (patient) {
//         patient.age = calculateAge(patient.birthDay);
//         delete patient.birthDay;
//       }
//       return appObj;
//     });

//     res.status(200).json(enriched);
//   } catch (error) {
//     next(error);
//   }
// };

// // Make a new appointment
// const makeAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { type, date, time, duration } = req.body;
//     const { doctorID } = req.params;
//     const patientID = (req as any).user.id;

//     const newAppointment = await Appointment.create({
//       type,
//       date,
//       status: "Pending",
//       time,
//       duration,
//       patient: patientID,
//       doctor: doctorID,
//     });

//     await Patient.findByIdAndUpdate(patientID, {
//       $push: { appointments: newAppointment._id },
//     });
//     await Doctor.findByIdAndUpdate(doctorID, {
//       $push: { appointments: newAppointment._id },
//     });

//     res.status(201).json(newAppointment);
//   } catch (error) {
//     next(error);
//   }
// };

// // Update appointment fields
// const updateDateAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { date } = req.body;
//     const { appointmentId } = req.params;
//     const updated = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { date },
//       { new: true }
//     );
//     res.status(200).json(updated);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateTimeAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { time } = req.body;
//     const { appointmentId } = req.params;
//     const updated = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { time },
//       { new: true }
//     );
//     res.status(200).json(updated);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateStatusAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { status } = req.body;
//     const { appointmentId } = req.params;
//     const updated = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { status },
//       { new: true }
//     );
//     res.status(200).json(updated);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateTypeAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { type } = req.body;
//     const { appointmentId } = req.params;
//     const updated = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { type },
//       { new: true }
//     );
//     res.status(200).json(updated);
//   } catch (error) {
//     next(error);
//   }
// };

// const updatePriceAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { price } = req.body;
//     const { appointmentId } = req.params;
//     const updated = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { price },
//       { new: true }
//     );
//     res.status(200).json(updated);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateDurationAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { duration } = req.body;
//     const { appointmentId } = req.params;
//     const updated = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { duration },
//       { new: true }
//     );
//     res.status(200).json(updated);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { appointmentId } = req.params;
//     await Appointment.findByIdAndDelete(appointmentId);
//     res.status(200).json({ message: "Appointment deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// export {
//   getAllAppointments,
//   getAppointmentsByPatientId,
//   getAppointmentsByDoctorId,
//   makeAppointment,
//   updateDateAppointment,
//   updateTimeAppointment,
//   updateStatusAppointment,
//   updateTypeAppointment,
//   updatePriceAppointment,
//   updateDurationAppointment,
//   deleteAppointment,
// };
// import { Request, NextFunction, Response } from "express";
// import Appointment from "../models/Appointment";
// import Doctor from "../models/Doctor";
// import Pateint from "../models/Patients";

// // Get all appointments (admin/debug)
// const getAllAppointments = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const appointments = await Appointment.find()
//       .populate("doctor")
//       .populate("pateint");
//     res.status(200).json(appointments);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get appointments by patient ID (for logged-in patient)
// const getAppointmentsByPatientId = async (req: any, res: any) => {
//   const patientId = req.user.id; // or req.user._id, depending on your auth
//   const appointments = await Appointment.find({ patient: patientId }).populate(
//     "doctor"
//   );
//   res.json(appointments);
// };
// // Get appointments by doctor ID (for logged-in doctor)
// const getAppointmentsByDoctorId = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const doctorID = (req as any).user.id; // or req.user._id
//     const doctorAppointments = await Appointment.find({
//       doctor: doctorID,
//     }).populate("pateint");
//     res.status(200).json(doctorAppointments);
//   } catch (error) {
//     next(error);
//   }
// };

// // Create a new appointment
// const makeAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { type, date, time, duration } = req.body;
//     const { doctorID } = req.params;
//     const pateintID = (req as any).user.id; // or req.user._id

//     // Create the appointment with both doctor and patient set
//     const newAppointment = await Appointment.create({
//       type,
//       date,
//       status: "Pending",
//       time,
//       duration,
//       pateint: pateintID,
//       doctor: doctorID,
//     });

//     // Optionally update patient/doctor with appointment ref
//     await Pateint.findByIdAndUpdate(pateintID, {
//       $push: { appointment: newAppointment._id },
//     });
//     await Doctor.findByIdAndUpdate(doctorID, {
//       $push: { appointment: newAppointment._id },
//     });

//     // Populate doctor for the response
//     const populatedAppointment = await Appointment.findById(
//       newAppointment._id
//     ).populate("doctor");
//     res.status(201).json(populatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };

// // Update appointment date
// const updateDateAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { date } = req.body;
//     const { appointmentId } = req.params;
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { date: date },
//       { new: true }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };

// // Update appointment time
// const updateTimeAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { time } = req.body;
//     const { appointmentId } = req.params;
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { time: time },
//       { new: true }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };

// // Update appointment status
// const updateStatusAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { status } = req.body;
//     const { appointmentId } = req.params;
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { status: status },
//       { new: true }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };

// // Update appointment type
// const updateTypeAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { type } = req.body;
//     const { appointmentId } = req.params;
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { type: type },
//       { new: true }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };

// // Update appointment price
// const updatePriceAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { price } = req.body;
//     const { appointmentId } = req.params;
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { price: price },
//       { new: true }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };

// // Update appointment duration
// const updateDurationAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { duration } = req.body;
//     const { appointmentId } = req.params;
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { duration: duration },
//       { new: true }
//     );
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     next(error);
//   }
// };

// // Delete appointment
// const deleteAppointment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { appointmentId } = req.params;
//     await Appointment.findByIdAndDelete(appointmentId);
//     res.status(200).json({ message: "Appointment deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// export {
//   getAllAppointments,
//   getAppointmentsByPatientId,
//   getAppointmentsByDoctorId,
//   makeAppointment,
//   updateDateAppointment,
//   updateTimeAppointment,
//   updateStatusAppointment,
//   updateTypeAppointment,
//   updatePriceAppointment,
//   updateDurationAppointment,
//   deleteAppointment,
// };
import { Request, NextFunction, Response } from "express";
import Appointment from "../models/Appointment";
import Doctor from "../models/Doctor";
import Patient from "../models/Patients";
import { calendar } from "../config/googleauth";
import moment from "moment";

// Helper: calculate age from birthDay
const calculateAge = (birthDay: Date | undefined) => {
  if (!birthDay) return null;
  const today = new Date();
  const birth = new Date(birthDay);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Get all appointments
const getAllAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name gender birthDay")
      .populate("doctor", "name speciality");

    const enriched = appointments.map((app) => {
      const appObj = app.toObject();
      const patient = appObj.patient as any;
      if (patient) {
        patient.age = calculateAge(patient.birthDay);
        delete patient.birthDay;
      }
      return appObj;
    });

    res.status(200).json(enriched);
  } catch (error) {
    next(error);
  }
};

// Get appointments by patient ID
const getAppointmentsByPatientId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patientID = (req as any).user.id;

    const appointments = await Appointment.find({ patient: patientID })
      .populate("doctor", "name speciality")
      .populate("patient", "name gender birthDay");

    const enriched = appointments.map((app) => {
      const appObj = app.toObject();
      const patient = appObj.patient as any;
      if (patient) {
        patient.age = calculateAge(patient.birthDay);
        delete patient.birthDay;
      }
      return appObj;
    });

    res.status(200).json(enriched);
  } catch (error) {
    next(error);
  }
};

// Get appointments by doctor ID
const getAppointmentsByDoctorId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorID = (req as any).user.id;

    const appointments = await Appointment.find({ doctor: doctorID })
      .populate("patient", "name gender birthDay")
      .populate("doctor", "name speciality");

    const enriched = appointments.map((app) => {
      const appObj = app.toObject();
      const patient = appObj.patient as any;
      if (patient) {
        patient.age = calculateAge(patient.birthDay);
        delete patient.birthDay;
      }
      return appObj;
    });

    res.status(200).json(enriched);
  } catch (error) {
    next(error);
  }
};

// // export const createAppointment = async (req: Request, res: Response) => {
// try {
//   const { doctorId } = req.params;
//   const { date, time, patientId } = req.body;

//   // Check if the doctor exists
//   const doctor = await Doctor.findById(doctorId);
//   if (!doctor) {
//     return res.status(404).json({ message: "Doctor not found" });
//   }

//   // Create the appointment
//   const appointment = await Appointment.create({
//     doctor: doctorId,
//     patient: patientId,
//     date,
//     time,
//   });

//   res.status(201).json({ message: "Appointment created", appointment });
// } catch (error) {
//   console.error("Error creating appointment:", error);
//   res.status(500).json({ message: "Internal server error" });
// }
// };

// Make a new appointment & generate Google Mee
const makeAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, date, time, duration } = req.body;
    const doctorID = req.params.doctorId;
    const patientID = (req as any).user.id;

    console.log("make appointment request body:", req.body);

    // 🔷 Validate doctorID and patientID
    const doctor = await Doctor.find({ provider: doctorID });
    console.log("doctor found:", doctor);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patient = await Patient.findById(patientID);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    console.log("updated date, ", moment(date).format("YYYY-MM-DD"));
    const appointmentData: any = {
      type,
      date,
      status: "Pending",
      time,
      duration,
      patient: patientID,
      doctor: doctorID,
    };

    if (type === "online") {
      // Combine date and time into a single string
      const startDateTimeString = `${moment(date).format(
        "YYYY-MM-DD"
      )}T${time}:00`;
      console.log("startDateTimeString:", startDateTimeString);
      const startDateTime = new Date(startDateTimeString);

      console.log("startDateTime:", startDateTime.getTime());
      if (isNaN(startDateTime.getTime())) {
        return res.status(400).json({ message: "Invalid date or time format" });
      }

      // Calculate the end time by adding the duration (in minutes)
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      // Format the start and end times in ISO 8601 format
      const startDateTimeISO = startDateTime.toISOString();
      const endDateTimeISO = endDateTime.toISOString();

      // Create the Google Calendar event
      const event = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: "Doctor Appointment",
          attendees: [
            { email: "f.n.zamanan@gmail.com" },
            { email: "janaalhamad21@gmail.com" },
            { email: "oncallapptesting@gmail.com" },
          ],
          start: {
            dateTime: startDateTimeISO,
            timeZone: "Asia/Kuwait", // Specify the time zone
          },
          end: {
            dateTime: endDateTimeISO,
            timeZone: "Asia/Kuwait", // Specify the time zone
          },
          conferenceData: {
            createRequest: {
              requestId: `meet-${Date.now()}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        },
        conferenceDataVersion: 1,
      });

      // Save the Google Meet link and event ID in the appointment data
      appointmentData.meetLink =
        event.data.conferenceData?.entryPoints?.[0]?.uri || "";
      appointmentData.calendarEventId = event.data.id;
    }

    // Save the appointment in the database
    const newAppointment = await Appointment.create(appointmentData);

    // Update the patient and doctor with the new appointment
    await Patient.findByIdAndUpdate(patientID, {
      $addToSet: { appointments: newAppointment._id },
    });
    await Doctor.findByIdAndUpdate(doctorID, {
      $addToSet: { appointments: newAppointment._id },
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("make appointment error:", error);
    next(error);
  }
};

// Update appointment fields
const updateDateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.body;
    const { appointmentId } = req.params;
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { date },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const updateTimeAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { time } = req.body;
    const { appointmentId } = req.params;
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { time },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const updateStatusAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;
    const { appointmentId } = req.params;
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const updateTypeAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.body;
    const { appointmentId } = req.params;
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { type },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const updatePriceAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { price } = req.body;
    const { appointmentId } = req.params;
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { price },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const updateDurationAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { duration } = req.body;
    const { appointmentId } = req.params;
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { duration },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appointmentId } = req.params;
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  getAllAppointments,
  makeAppointment,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
  updateDateAppointment,
  updateTimeAppointment,
  updateStatusAppointment,
  updateTypeAppointment,
  updatePriceAppointment,
  updateDurationAppointment,
  deleteAppointment,
};
