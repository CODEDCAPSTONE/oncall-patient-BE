import { Request, Response } from "express";
import Patient from "../models/Patients";
const getPatientProfile = async (req: Request, res: Response) => {
  const patientId = (req as any).user.id; // or ._id, depending on your JWT payload

  try {
    const patient = await Patient.findById(patientId).populate("dependents");
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
    } else res.status(200).json({ patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePatientProfile = async (req: Request, res: Response) => {
  const patientId = req.body.patientId;
  const updates = req.body;

  const updated = await Patient.findByIdAndUpdate(patientId, updates, {
    new: true,
  });

  if (!updated) {
    res.status(404).json({ message: "Patient not found" });
  } else {
    res.status(200).json({ patient: updated });
  }
};

export const uploadProfileImage = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.file) {
    res.status(400).json({ message: "No image uploaded" });
  } else {
    const patient = await Patient.findOne({ civilID: id });

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
    } else {
      patient.profileImage = req.file.path;
      await patient.save();

      res.status(200).json({ message: "Profile image uploaded", patient });
    }
  }
};

const uploadPDFDoc = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.file) {
    res.status(400).json({ message: "No document uploaded" });
  } else {
    const patient = await Patient.findById(id);

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
    } else {
      patient.documentPath = req.file.path;
      await patient.save();

      res.status(200).json({ message: "Document uploaded", patient });
    }
  }
};

const deletePatient = async (req: Request, res: Response) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);
  if (!patient) {
    res.status(404).json({ message: "Patient not found" });
  } else {
    if (patient.dependents && patient.dependents.length > 0) {
      res.status(400).json({
        message: "Cannot delete patient with active dependents",
      });
    }

    await Patient.findByIdAndDelete(id);

    res.status(200).json({ message: "Patient deleted successfully" });
  }
};

export { getPatientProfile, updatePatientProfile, uploadPDFDoc, deletePatient };
