
import { Schema, model, Types, Document } from "mongoose";export interface IAITool extends Document {
  name: string;
  description?: string;
  reports: Types.ObjectId[];
}

const aiToolSchema = new Schema<IAITool>({
  name: { type: String, required: true },
  description: String,
  reports: [{ type: Schema.Types.ObjectId, ref: "MedicalReport" }]
}, { timestamps: true });

export default model<IAITool>("AITool", aiToolSchema);
