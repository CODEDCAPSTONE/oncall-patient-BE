import { Schema, model, Types, Document, models } from "mongoose";
import autopopulate from "mongoose-autopopulate";

export interface INurse extends Document {
  provider: Types.ObjectId;

  // HealthCareProvider fields
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

  // Nurse-specific
  bookings?: Types.ObjectId[];
  companyName: string;
  languages?: string[];
  role?: string[];
}

const nurseSchema = new Schema<INurse>(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "HealthCareProvider",
      required: true,
      autopopulate: true,
    },

    // HealthCareProvider fields
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

    // Nurse-specific
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    role: {
      type: [String],
      default: ["nurse", "healthCareProvider"],
    },
  },
  { timestamps: true }
);

nurseSchema.plugin(autopopulate);

export default models.Nurse || model<INurse>("Nurse", nurseSchema);
