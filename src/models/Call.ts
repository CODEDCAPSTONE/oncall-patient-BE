import { Schema, model, Types, Document } from "mongoose";

export interface ICall extends Document {
  session: Types.ObjectId;        // One-to-One with Session
  type: "video" | "voice";
  caller: Types.ObjectId;         // Doctor
  receiver: Types.ObjectId;       // Patient
  startedAt?: Date;
  endedAt?: Date;
  altTranscript?: Types.ObjectId; // Ref to Transcript
}

const callSchema = new Schema<ICall>(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      unique: true, // ensure one-to-one with Session
    },
    type: {
      type: String,
      enum: ["video", "voice"],
      required: true,
    },
    caller: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",  // or "HealthCareProvider" if that matches your collection
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    altTranscript: {
      type: Schema.Types.ObjectId,
      ref: "Transcript",
    },
  },
  { timestamps: true }
);

export default model<ICall>("Call", callSchema);
