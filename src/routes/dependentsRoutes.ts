import express from "express";
import {
  addDependent,
  getDependents,
} from "../controllers/DependentController";
import { authMiddleware } from "../middlewares/authMiddleWare";

const router = express.Router();

// ✅ Apply authMiddleware globally to all dependent routes
router.use(authMiddleware);

router.get("/", getDependents);
router.post("/", addDependent);

export default router;
