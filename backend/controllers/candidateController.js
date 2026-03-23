import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import { validationResult } from "express-validator";

// @desc    Create a candidate and add to election
// @route   POST /api/candidates
// @access  Private/Admin
export const createCandidate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, department, manifesto, image, electionId } = req.body;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const candidate = await Candidate.create({
      name,
      department,
      manifesto,
      image,
      createdBy: req.user._id,
    });

    election.candidates.push(candidate._id);
    await election.save();

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all candidates for a specific election
// @route   GET /api/candidates/election/:electionId
// @access  Private
export const getCandidatesByElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId).populate(
      "candidates",
    );
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    res.json(election.candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
