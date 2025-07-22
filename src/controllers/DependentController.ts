import { Request, Response } from "express";
import Dependent from "../models/Dependent";
import Patient from "../models/Patients";

// create dependants
const addDependent = async (req: Request, res: Response) => {
  try {
    const { name, age, relationship } = req.body;
    // const patientId = req.body.patientId;
    const patientId = (req as any).user.id;

    if (!name || !age || !relationship) {
      return res.status(422).json({
        message:
          "Dependent name, age, relationship, and patientId are required",
      });
    } else {
      const dependent = new Dependent({
        name: name,
        age: age,
        relationship: relationship,
        careGiver: patientId, // 🔷 FIXED
      });

      await dependent.save();

      await Patient.findByIdAndUpdate(patientId, {
        $push: { dependents: dependent._id },
      });

      res.status(201).json({ dependent });
    }
  } catch (error: any) {
    console.error("Error adding dependent:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
// get dependants
export const getDependents = async (req: Request, res: Response) => {
  // const patientId = req.body.patientId;
  const patientId = (req as any).user.id;

  const dependents = await Dependent.find({ careGiver: patientId }); // 🔷 FIXED
  res.status(200).json({ dependents });
};
// update dependants
const updateDependent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, age, relationship } = req.body;

  const updated = await Dependent.findByIdAndUpdate(
    id,
    { name, age, relationship },
    { new: true }
  );

  if (!updated) {
    res.status(404).json({ message: "Dependent not found" });
  } else {
    res.status(200).json({ dependent: updated });
  }
};

// ✅ DELETE DEPENDENT
const deleteDependent = async (req: Request, res: Response) => {
  const { id } = req.params;

  const dependent = await Dependent.findById(id);
  if (!dependent) {
    res.status(404).json({ message: "Dependent not found" });
  } else if (
    dependent.hasActivePrescription ||
    dependent.hasActiveAppointment
  ) {
    res.status(400).json({
      message:
        "Cannot delete dependent with active prescriptions or appointments",
    });
  } else {
    await Dependent.findByIdAndDelete(id);

    await Patient.findByIdAndUpdate(dependent.careGiver, {
      // 🔷 FIXED
      $pull: { dependents: id },
    });

    res.status(200).json({ message: "Dependent deleted successfully" });
  }
};

export { addDependent, deleteDependent, updateDependent };
