// import { model, Schema, Document, Types } from "mongoose";
// import autopopulate from "mongoose-autopopulate";

// export interface IAppointment extends Document {
//   patient: Types.ObjectId;
//   doctor: Types.ObjectId;
//   type: string;
//   status?: string;
//   price?: number;
//   date: Date;
//   time: number;
//   duration: number;
//   AItranscript?: Types.ObjectId;
//   notes?: string[];
// }

// const appointmentSchema = new Schema<IAppointment>(
//   {
//     patient: {
//       type: Schema.Types.ObjectId,
//       ref: "Patient",
//       required: false,
//       autopopulate: { select: "name" },
//     },
//     doctor: {
//       type: Schema.Types.ObjectId,
//       ref: "Doctor",
//       required: false,
//       autopopulate: { select: "speciality" },
//     },
//     type: { type: String, required: true }, // online, offline, emergency
//     status: { type: String }, // upcoming, pending, done, cancelled
//     price: { type: Number },
//     date: { type: Date, required: true },
//     time: { type: Number, required: true }, // could be hour or timestamp
//     duration: { type: Number, required: true }, // in minutes: 15, 30, 60
//     AItranscript: {
//       type: Schema.Types.ObjectId,
//       ref: "Transcript",
//     }, // optional, future feature
//     notes: { type: [String] },
//   },
//   { timestamps: true }
// );

// appointmentSchema.plugin(autopopulate);

// const Appointment = model<IAppointment>("Appointment", appointmentSchema);

// export default Appointment;

import { model, Schema, Document, Types } from "mongoose";
import autopopulate from "mongoose-autopopulate";

export interface IAppointment extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  type: string;
  status?: string;
  price?: number;
  date: Date;
  time: string;
  duration: number;
  AItranscript?: Types.ObjectId;
  notes?: string[];
  meetLink?: string;
  calendarEventId?: string;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      autopopulate: {
        select: "name email phoneNum", //  include patient info
      },
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      autopopulate: {
        select: "name speciality licenseNum", //  include doctor info
      },
    },
    type: { type: String, required: true }, // online, offline, emergency
    status: { type: String, default: "pending" }, // upcoming, pending, done, cancelled
    price: { type: Number },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // hour of day
    duration: { type: Number, required: true }, // in minutes
    AItranscript: {
      type: Schema.Types.ObjectId,
      ref: "Transcript",
    }, // optional
    notes: { type: [String] },
    meetLink: { type: String },
    calendarEventId: { type: String },
  },
  { timestamps: true }
);

appointmentSchema.plugin(autopopulate);

const Appointment = model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;
