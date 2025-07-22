// src/types/express/index.d.ts
import { PatientDocument } from "../../models/Patients"; // Adjust import based on your path

declare global {
  namespace Express {
    interface Request {
      patient?: {
        id: string;
      };
    }
  }
}
