// import express from "express";
// import {
//   createPrescription,
//   getAllPrescriptions,
//   getPrescriptionById,
//   updatePrescription,
//   deletePrescription
// } from "../controllers/prescriptionController";
// //import authenticate from "../middlewares/authenticate";
// import upload from "../middlewares/Upload"; // multer setup

// const router = express.Router();

// // router.post("/prescriptions", authenticate, createPrescription);
// // router.get("/prescriptions", authenticate, getAllPrescriptions);
// // router.get("/prescriptions/:id", authenticate, getPrescriptionById);
// // router.put("/prescriptions/:id", authenticate, updatePrescription);
// // router.delete("/prescriptions/:id", authenticate, deletePrescription);
// // router.post("/prescriptions", authenticate, upload.single('image'), createPrescription);
// // router.put("/prescriptions/:id", authenticate, upload.single('image'), updatePrescription);

// router.post("/", upload.single('image'), createPrescription);
// router.get("/", getAllPrescriptions);
// router.get("/:id", getPrescriptionById);
// router.put("/:id", upload.single('image'), updatePrescription);
// router.delete("/:id", deletePrescription);

// export default router;
import express from "express";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescriptionController";
import { authenticate } from "../middlewares/authMiddleWare"; // ✅ Correct import
import { uploadImage } from "../middlewares/upload"; // ✅ Use correct named export for images

const router = express.Router();

// ✅ Create a prescription (with image upload)
router.post("/", authenticate, uploadImage.single("image"), createPrescription);

// ✅ Get all prescriptions
router.get("/", authenticate, getAllPrescriptions);

// ✅ Get single prescription by ID
router.get("/:id", authenticate, getPrescriptionById);

// ✅ Update prescription (with optional image upload)
router.put(
  "/:id",
  authenticate,
  uploadImage.single("image"),
  updatePrescription
);

// ✅ Delete prescription
router.delete("/:id", authenticate, deletePrescription);

export default router;
