import Vote from "../models/Vote.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Private/Student
export const castVote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { electionId, candidateId } = req.body;
    const userId = req.user._id;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    if (!election.isActive) {
      return res
        .status(400)
        .json({ message: "Election is not currently active" });
    }

    const currentTime = new Date();
    if (currentTime < election.startTime || currentTime > election.endTime) {
      return res
        .status(400)
        .json({ message: "Election is not open for voting at this time" });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (!election.candidates.includes(candidateId)) {
      return res
        .status(400)
        .json({ message: "Candidate is not part of this election" });
    }

    await Vote.create({
      user: userId,
      election: electionId,
      candidate: candidateId,
    });

    candidate.votes += 1;
    await candidate.save();

    const user = await User.findById(userId);
    user.hasVoted = true;
    user.votedCandidate = candidateId;
    await user.save();

    res.status(201).json({ message: "Vote cast successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already voted in this election" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get live results of an election
// @route   GET /api/votes/results/:electionId
// @access  Private
export const getResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId).populate(
      "candidates",
      "name department votes image",
    );
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    res.json({ election: election.title, results: election.candidates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if user has voted in a specific election
// @route   GET /api/votes/status/:electionId
// @access  Private
export const checkVoteStatus = async (req, res) => {
  try {
    const vote = await Vote.findOne({ 
      user: req.user._id, 
      election: req.params.electionId 
    });
    res.json({ voted: !!vote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
