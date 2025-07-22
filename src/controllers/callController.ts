import { Request, Response } from "express";
import Call from "../models/Call";

/**
 * Start a new call (video or voice)
 * Only the authenticated doctor (caller) can start the call
 */
export const startCall = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  const { session, type, caller, receiver } = req.body;

  if (!session || !type || !caller || !receiver) {
    res.status(400).json({ message: "session, type, caller, and receiver are required" });
    return;
  }

  // Only doctor can start the call
  if (!userId || userRole !== "HealthcareProvider") {
    res.status(403).json({ message: "Only a healthcare provider can start a call" });
    return;
  }

  // The authenticated user must be the caller (doctor)
  if (userId !== caller) {
    res.status(403).json({ message: "You can only start a call as the caller (doctor)" });
    return;
  }

  try {
    const call = await Call.create({
      session,
      type,
      caller,
      receiver,
      startedAt: new Date()
    });

    res.status(201).json({ message: "Call started", call });
  } catch (err) {
    console.error("Error starting call:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * End a call
 * Only the caller (doctor) can end the call
 */
export const endCall = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  const { callId } = req.body;

  if (!callId) {
    res.status(400).json({ message: "callId is required" });
    return;
  }

  if (!userId || userRole !== "HealthcareProvider") {
    res.status(403).json({ message: "Only a healthcare provider can end a call" });
    return;
  }

  try {
    const call = await Call.findById(callId);
    if (!call) {
      res.status(404).json({ message: "Call not found" });
      return;
    }

    // Only caller can end the call
    if (call.caller.toString() !== userId) {
      res.status(403).json({ message: "You are not authorized to end this call" });
      return;
    }

    call.endedAt = new Date();
    await call.save();

    res.status(200).json({ message: "Call ended", call });
  } catch (err) {
    console.error("Error ending call:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
