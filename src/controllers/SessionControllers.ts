import { Request, Response } from "express";
import Session, { ISession } from "../models/Session";
import Appointment, { IAppointment } from "../models/Appointment";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import { Types } from "mongoose";

// Extend Request type to include authenticated user
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

const appId = process.env.AGORA_APP_ID!;
const appCertificate = process.env.AGORA_APP_CERTIFICATE!;

/**
 * POST /sessions/start
 * Only the assigned doctor (HealthcareProvider) can start the session
 */
export const startSession = async (req: Request, res: Response): Promise<void> => {
  const { sessionId } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!sessionId) {
    res.status(400).json({ message: "sessionId is required" });
    return;
  }

  if (!userId || userRole !== "HealthcareProvider") {
    res.status(403).json({ message: "Only a healthcare provider can start the session" });
    return;
  }

  try {
    const session = await Session.findById(sessionId).populate("appointment") as ISession | null;
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const appointment = (await Appointment.findById(session.appointment)) as IAppointment | null;
    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    if (String(appointment.doctor) !== userId) {
      res.status(403).json({ message: "You are not assigned to this appointment" });
      return;
    }

    if (appointment.date && Date.now() < appointment.date.getTime()) {
      res.status(403).json({ message: "Cannot start session before appointment time" });
      return;
    }

    const channelName = sessionId;
    const agoraUid = parseInt(userId, 10) || 0;
    const expirationTimeInSeconds = 3600; // 1 hour
    const privilegeExpireTime = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      agoraUid,
      RtcRole.PUBLISHER,
      privilegeExpireTime
    );

    session.status = "active";
    session.startTime = new Date();
    session.participants = [appointment.patient, appointment.doctor];

    await session.save();

    res.status(200).json({
      message: "Session started successfully",
      session,
      agora: {
        token,
        channelName,
        uid: agoraUid,
        expiresIn: expirationTimeInSeconds
      }
    });
  } catch (err) {
    console.error("Error starting session:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /sessions/end
 * Only the assigned doctor (HealthcareProvider) can end the session
 */
export const endSession = async (req: Request, res: Response): Promise<void> => {
  const { sessionId } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!sessionId) {
    res.status(400).json({ message: "sessionId is required" });
    return;
  }

  if (!userId || userRole !== "HealthcareProvider") {
    res.status(403).json({ message: "Only a healthcare provider can end the session" });
    return;
  }

  try {
    const session = await Session.findById(sessionId) as ISession | null;
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);

    if (!session.participants.some(p => p.equals(userObjectId))) {
      res.status(403).json({ message: "You are not authorized to end this session" });
      return;
    }

    session.status = "ended";
    session.endTime = new Date();

    await session.save();

    res.status(200).json({ message: "Session ended successfully", session });
  } catch (err) {
    console.error("Error ending session:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
