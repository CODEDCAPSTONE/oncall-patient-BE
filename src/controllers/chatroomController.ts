import { Request, Response } from "express";
import Chatroom from "../models/Chatroom";

/**
 * Create a new chatroom between doctor (sender) and patient (receiver)
 * Only a doctor (HealthcareProvider role) can create chatrooms to start messaging/calls
 */
export const createChatroom = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const { sender, receiver, session } = req.body;

  // Validate required fields
  if (!sender || !receiver || !session) {
    res.status(400).json({ message: "sender, receiver, and session are required" });
    return;
  }

  // Only doctor (HealthcareProvider) can create/start chatroom
  if (!userId || userRole !== "HealthcareProvider") {
    res.status(403).json({ message: "Only a healthcare provider can start a chatroom" });
    return;
  }

  // Ensure the authenticated user is the sender (doctor)
  if (userId !== sender) {
    res.status(403).json({ message: "You can only create chatrooms as the sender (doctor)" });
    return;
  }

  try {
    // Create chatroom with empty messages array
    const chatroom = await Chatroom.create({
      sender,
      receiver,
      session,
      messages: []
    });

    res.status(201).json({ message: "Chatroom created", chatroom });
  } catch (err) {
    console.error("Error creating chatroom:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * Get chatroom by ID
 */
export const getChatroomById = async (req: Request, res: Response) => {
  try {
    const chatroom = await Chatroom.findById(req.params.id).populate("messages sender receiver session");
    if (!chatroom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }
    res.status(200).json(chatroom);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all chatrooms
 */
export const getAllChatrooms = async (_req: Request, res: Response) => {
  try {
    const chatrooms = await Chatroom.find().populate("messages sender receiver session");
    res.status(200).json(chatrooms);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete chatroom by ID
 */
export const deleteChatroom = async (req: Request, res: Response) => {
  try {
    const deleted = await Chatroom.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Chatroom not found" });
    }
    res.status(200).json({ message: "Chatroom deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
