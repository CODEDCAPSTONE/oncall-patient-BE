import express from "express";
import {
  getPatientProfile,
  updatePatientProfile,
  deletePatient,
  uploadProfileImage,
  uploadPDFDoc,
} from "../controllers/PatientController";

import {
  addDependent,
  getDependents,
  updateDependent,
  deleteDependent,
} from "../controllers/DependentController";

import { uploadImage, uploadPDF } from "../middlewares/upload";
import { authorize } from "../middlewares/authMiddleWare";

const router = express.Router();

// 👤 Patient
router.get("/me", authorize, getPatientProfile);
router.put("/me", authorize, updatePatientProfile);
router.delete("/:id", authorize, deletePatient);

// 👨‍👩‍👧 Dependents

// router.post("/dependents", authorize, addDependent);
// router.get("/dependents", authorize, getDependents);
// router.put("/dependents/:id", authorize, updateDependent);
// router.delete("/dependents/:id", authorize, deleteDependent);

router.post(
  "/:id/upload-profile",
  uploadImage.single("profileImage"),
  uploadProfileImage
);

router.post("/:id/upload-document", uploadPDF.single("document"), uploadPDFDoc);

export default router;
