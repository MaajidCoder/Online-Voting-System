import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Election title is required"]
    },

    description: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: false
    },

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: true
    },

    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Election", electionSchema);