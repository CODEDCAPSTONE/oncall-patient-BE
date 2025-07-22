import express from "express";
import { startCall, endCall } from "../controllers/callController";
import { authenticate } from "../middlewares/authMiddleWare";
const router = express.Router();

// Start a call (only authenticated healthcare providers)
router.post("/calls/start", authenticate, startCall);

// End a call by ID (only authenticated healthcare providers)
router.post("/calls/:id/end", authenticate, endCall);

export default router;
