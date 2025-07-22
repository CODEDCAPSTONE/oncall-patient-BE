// import express from "express";
// import { startSession, endSession } from "../controllers/SessionControllers";
// import authenticate from "../middlewares/authenticate";

// const router = express.Router();

// // POST /api/sessions/start
// // Starts a live chat session (HealthcareProvider only)
// router.post("/start", authenticate, startSession);

// // POST /api/sessions/end
// // Ends a live chat session (HealthcareProvider only)
// router.post("/end", authenticate, endSession);

// export default router;

import express from "express";
import { startSession, endSession } from "../controllers/SessionControllers";
import { authenticate } from "../middlewares/authMiddleWare"; // ✅ fixed

const router = express.Router();

/**
 * @route   POST /api/sessions/start
 * @desc    Start a live chat session (only by HealthcareProvider, uses Agora)
 * @access  Private
 */
router.post("/start", authenticate, startSession);

/**
 * @route   POST /api/sessions/end
 * @desc    End a live chat session (only by HealthcareProvider)
 * @access  Private
 */
router.post("/end", authenticate, endSession);

export default router;
