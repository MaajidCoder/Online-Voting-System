import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false // 🔥 hides password when fetching user
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    hasVoted: {
      type: Boolean,
      default: false
    },

    votedCandidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);