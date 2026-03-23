import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true
    },

    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true
    }
  },
  { timestamps: true }
);

// Prevent multiple votes
voteSchema.index({ user: 1, election: 1 }, { unique: true });

export default mongoose.model("Vote", voteSchema);