import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Candidate name is required"],
      trim: true
    },

    department: {
      type: String,
      required: [true, "Department is required"]
    },

    manifesto: {
      type: String,
      default: ""
    },

    image: {
      type: String, // URL for candidate image
      default: ""
    },

    votes: {
      type: Number,
      default: 0
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" // admin who created
    }
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);