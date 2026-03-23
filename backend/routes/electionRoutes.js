import express from "express";
import { check } from "express-validator";
import {
  createElection,
  getElections,
  getElectionById,
  updateElection,
  deleteElection,
} from "../controllers/electionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, getElections)
  .post(
    authMiddleware,
    adminMiddleware,
    [
      check("title", "Title is required").notEmpty(),
      check("startTime", "Start time is required").isISO8601(),
      check("endTime", "End time is required").isISO8601(),
    ],
    createElection,
  );

router
  .route("/:id")
  .get(authMiddleware, getElectionById)
  .put(authMiddleware, adminMiddleware, updateElection)
  .delete(authMiddleware, adminMiddleware, deleteElection);

export default router;
