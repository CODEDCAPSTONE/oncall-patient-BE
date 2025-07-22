import express from "express";
import { uploadImage } from "../middlewares/upload"; // ✅ Use named export (if your upload.ts exports named `uploadImage`)
import { validateRequest } from "../middlewares/validateRequest";
import { authenticate } from "../middlewares/authMiddleWare"; // ✅ Optional if you want to secure routes

import {
  registerProviderLab,
  registerProviderDoctor,
  registerProviderNurse,
  registerProviderPhysiotherapist,
  loginProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
} from "../controllers/providerAuthController";

import {
  doctorRegistrationSchema,
  nurseRegistrationSchema,
  labRegistrationSchema,
  physiotherapistRegistrationSchema,
} from "../validations/providerValidations";

const router = express.Router();

// 🩺 Registration routes (with Zod validation & image upload)
router.post(
  "/auth/register/doctor",
  uploadImage.single("profileImage"),
  validateRequest(doctorRegistrationSchema),
  registerProviderDoctor
);

router.post(
  "/auth/register/nurse",
  uploadImage.single("profileImage"),
  validateRequest(nurseRegistrationSchema),
  registerProviderNurse
);

router.post(
  "/auth/register/lab",
  uploadImage.single("profileImage"),
  validateRequest(labRegistrationSchema),
  registerProviderLab
);

router.post(
  "/auth/register/physiotherapist",
  uploadImage.single("profileImage"),
  validateRequest(physiotherapistRegistrationSchema),
  registerProviderPhysiotherapist
);

// 🔑 Login route
router.post("/auth/login", loginProvider);

// 📋 Management routes (✅ optionally secured)
router.get("/", authenticate, getAllProviders);
router.get("/:id", authenticate, getProviderById);
router.put(
  "/:id",
  authenticate,
  uploadImage.single("profileImage"),
  updateProvider
);
router.delete("/:id", authenticate, deleteProvider);

export default router;
