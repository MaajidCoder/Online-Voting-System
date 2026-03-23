import Election from "../models/Election.js";
import { validationResult } from "express-validator";

// @desc    Create a new election
// @route   POST /api/elections
// @access  Private/Admin
export const createElection = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, startTime, endTime } = req.body;
    const election = await Election.create({
      title,
      description,
      startTime,
      endTime,
    });
    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all elections
// @route   GET /api/elections
// @access  Private
export const getElections = async (req, res) => {
  try {
    const elections = await Election.find().populate("candidates");
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get election by ID
// @route   GET /api/elections/:id
// @access  Private
export const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id).populate(
      "candidates",
    );
    if (election) {
      res.json(election);
    } else {
      res.status(404).json({ message: "Election not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update election
// @route   PUT /api/elections/:id
// @access  Private/Admin
export const updateElection = async (req, res) => {
  try {
    const updatedElection = await Election.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (updatedElection) {
      res.json(updatedElection);
    } else {
      res.status(404).json({ message: "Election not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete election
// @route   DELETE /api/elections/:id
// @access  Private/Admin
export const deleteElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (election) {
      res.json({ message: "Election removed" });
    } else {
      res.status(404).json({ message: "Election not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
