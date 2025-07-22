import { Schema, model, Types, Document } from "mongoose";

export interface ISession extends Document {
  appointment: Types.ObjectId;
  status: "pending" | "active" | "ended";
  startTime?: Date;
  endTime?: Date;
  participants: Types.ObjectId[];
}

const sessionSchema = new Schema<ISession>(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "active", "ended"],
      default: "pending"
    },
    startTime: {
      type: Date,
      default: null
    },
    endTime: {
      type: Date,
      default: null
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

export default model<ISession>("Session", sessionSchema);
