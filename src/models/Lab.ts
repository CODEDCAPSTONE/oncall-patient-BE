import { Schema, model, Types, Document, models } from "mongoose";
import autopopulate from "mongoose-autopopulate";

export interface ILab extends Document {
  provider: Types.ObjectId;

  // Duplicated fields from HealthCareProvider
  name: string;
  email: string;
  civilID: string;
  phoneNum: string;
  YOEX: number;
  licenseNum: string;
  specialization: string;
  image?: string;
  bio?: string;
  gender?: string;
  age?: number;

  // Lab-specific
  companyName: string;
  typesOfTests?: string[];
  bookings?: Types.ObjectId[];
  medicalReports?: Types.ObjectId[];
}

const labSchema = new Schema<ILab>(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "HealthCareProvider",
      required: true,
      autopopulate: true,
    },

    // Duplicated HealthCareProvider fields
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    civilID: { type: String, required: true, trim: true },
    phoneNum: { type: String, required: true, trim: true },
    YOEX: { type: Number, required: true },
    licenseNum: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    image: { type: String },
    bio: { type: String },
    gender: { type: String },
    age: { type: Number },

    // Lab-specific
    companyName: { type: String, required: true, trim: true },
    typesOfTests: [
      {
        type: String,
        trim: true,
      },
    ],

    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],

    medicalReports: [
      {
        type: Schema.Types.ObjectId,
        ref: "MedicalReport",
      },
    ],
  },
  { timestamps: true }
);

labSchema.plugin(autopopulate);

export default models.Lab || model<ILab>("Lab", labSchema);
