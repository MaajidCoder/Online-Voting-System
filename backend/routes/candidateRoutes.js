import express from "express";
import { check } from "express-validator";
import {
  createCandidate,
  getCandidatesByElection,
} from "../controllers/candidateController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [
    check("name", "Name is required").notEmpty(),
    check("department", "Department is required").notEmpty(),
    check("electionId", "Valid Election ID is required").isMongoId(),
  ],
  createCandidate,
);
router.get("/election/:electionId", authMiddleware, getCandidatesByElection);

export default router;
