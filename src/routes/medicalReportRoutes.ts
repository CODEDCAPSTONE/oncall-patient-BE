import express from "express";
import {
  uploadReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} from "../controllers/medicalReportController";
import { uploadPDF } from "../middlewares/upload";
import { authenticate } from "../middlewares/authMiddleWare";

const router = express.Router();

router.post("/", authenticate, uploadPDF.single("reportFile"), uploadReport);
router.get("/", authenticate, getReports);
router.get("/:id", authenticate, getReportById);
router.put("/:id", authenticate, uploadPDF.single("reportFile"), updateReport);
router.delete("/:id", authenticate, deleteReport);

export default router;
