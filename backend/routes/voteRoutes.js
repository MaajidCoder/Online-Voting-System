import express from "express";
import { check } from "express-validator";
import { castVote, getResults, checkVoteStatus } from "../controllers/voteController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Middlewares for roles if needed (based on previous logic)
const student = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Students only." });
  }
};

// @route   POST /api/votes
// @desc    Cast a vote
// @access  Private/Student
router.post(
  "/",
  authMiddleware,
  [
    check("electionId", "Valid Election ID is required").isMongoId(),
    check("candidateId", "Valid Candidate ID is required").isMongoId(),
  ],
  castVote
);

// @route   GET /api/votes/results/:electionId
// @desc    Get results
// @access  Private
router.get("/results/:electionId", authMiddleware, getResults);

// @route   GET /api/votes/status/:electionId
// @desc    Check if user has voted
// @access  Private
router.get("/status/:electionId", authMiddleware, checkVoteStatus);

export default router;
