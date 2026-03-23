import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const app = express();
connectDB();

// Security Headers
app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both common Vite ports
  }),
);
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/votes", voteRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
