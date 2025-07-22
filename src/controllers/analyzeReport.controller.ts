import { Request, Response, NextFunction } from "express";
import pdfParse from "pdf-parse";
import fs from "fs";
import { OpenAI } from "openai";
import MedicalReport from "../models/MedicalReport";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// example.js
console.log("Ready for production!");

//
export const analyzePdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { labID } = req.params; // Assuming labID is passed in the URL, integration with FE: accessing already requested and uploaded report
    const medicalReport = await MedicalReport.findById(labID);
    // Check if the medical report exists
    if (!medicalReport) {
      res.status(404).json({ message: "Medical report not found" });
    }
    // grap tje reportURL from the medicalReport object
    const filePath = medicalReport?.reportURL; // Assuming reportURL contains the path to the PDF file
    const pdfBuffer = fs.readFileSync(filePath!); // req.file!.path
    const data = await pdfParse(pdfBuffer);

    const prompt = `
    You are a medical assistant. Analyze the following medical report and provide a summary and any abnormal values or concerns.
    Medical Report Content:
    ${data.text}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });
    const analysisText = completion.choices[0].message.content;

    const savedReport = await MedicalReport.findByIdAndUpdate(
      labID,
      {
        analysis: analysisText,
      },
      { new: true }
    ); // FE should be able to display the analysis text

    res.json({
      message: "PDF analyzed successfully",
      analysis: savedReport?.analysis,
    });
  } catch (error) {
    next(error);
  }
};
