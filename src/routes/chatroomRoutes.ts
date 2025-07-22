import express from "express";
import {
  createChatroom,
  getChatroomById,
  getAllChatrooms,
  deleteChatroom,
} from "../controllers/chatroomController";
import { authenticate } from "../middlewares/authMiddleWare";
const router = express.Router();
// Create a new chatroom (doctor only)
router.post("/chatrooms", authenticate, createChatroom);

// Get all chatrooms (for admin or doctor, depending on your logic)
router.get("/chatrooms", authenticate, getAllChatrooms);

// Get single chatroom by ID
router.get("/chatrooms/:id", authenticate, getChatroomById);

// Delete chatroom by ID (doctor only)
router.delete("/chatrooms/:id", authenticate, deleteChatroom);

export default router;
