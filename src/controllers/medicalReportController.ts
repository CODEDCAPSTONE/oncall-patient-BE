import { Request, Response } from "express";
import MedicalReport from "../models/MedicalReport";

/**
 * Upload a medical report.
 * Uploaded by any HealthCareProvider (not restricted to lab or booking).
 */
export const uploadReport = async (req: Request, res: Response): Promise<void> => {
  const {
    patientId,
    reportURL,
    notes,
    testName,
    price,
    analysisId,
    createdAt,
    validUntil,
    status,
  } = req.body;

  console.log("Upload report body:", req.body);
  console.log("Upload report file:", req.file);

  if (!req.file && !reportURL) {
    res.status(422).json({ message: "Report file or URL is required" });
    return;
  }

  if (!patientId) {
    res.status(422).json({ message: "patientId is required" });
    return;
  }

  if (!testName) {
    res.status(422).json({ message: "testName is required" });
    return;
  }

  if (price === undefined || price === null) {
    res.status(422).json({ message: "price is required" });
    return;
  }

  try {
    const report = await MedicalReport.create({
      patient: patientId,
      reportURL: reportURL || req.file?.path,
      notes,
      testName,
      price: Number(price),
      analysis: analysisId || undefined,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      status: status || "Pending",
      uploadedBy: req.user?.id, // uploader is any logged-in HealthCareProvider
    });

    const populatedReport = await report.populate([
      "patient",
      "analysis",
      "uploadedBy",
    ]);

    res.status(201).json({ message: "Report uploaded", report: populatedReport });
  } catch (err) {
    console.error("Upload report error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all reports
 */
export const getReports = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reports = await MedicalReport.find().populate([
      "patient",
      "analysis",
      "uploadedBy",
    ]);
    res.status(200).json(reports);
  } catch (err) {
    console.error("Get reports error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get report by ID
 */
export const getReportById = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await MedicalReport.findById(req.params.id).populate([
      "patient",
      "analysis",
      "uploadedBy",
    ]);
    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    res.status(200).json(report);
  } catch (err) {
    console.error("Get report by ID error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update report
 */
export const updateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await MedicalReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate([
      "patient",
      "analysis",
      "uploadedBy",
    ]);

    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    res.status(200).json({ message: "Report updated", report });
  } catch (err) {
    console.error("Update report error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete report
 */
export const deleteReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await MedicalReport.findByIdAndDelete(req.params.id);
    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    res.status(200).json({ message: "Report deleted" });
  } catch (err) {
    console.error("Delete report error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
