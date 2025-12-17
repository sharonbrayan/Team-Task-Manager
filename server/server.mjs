import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./config/mongodb.mjs";
import dotenv from "dotenv";
// NEW IMPORTS for handling directory paths in ES Modules (.mjs)
import path from "path";
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from "./routes/authRoutes.mjs";
import teamRoutes from "./routes/teamRoutes.mjs";
import taskRoutes from "./routes/taskRoutes.mjs";

// Define __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

// Connect to MongoDB
connectDb();

// Middlewares
app.use(express.json());  // To parse JSON bodies
app.use(cookieParser());  // For reading cookies (JWT)
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173"
    ], // your frontend URL (vite)
    credentials: true,
  })
);

// Test route (Keep this here for local testing)
app.get("/", (req, res) => {
  // If running in production, this route will be handled by the static serve below, 
  // but keep it for development clarity.
  res.send("Backend server is running ✔️");
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tasks", taskRoutes);



// Global error handler (simple version)
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  return res.status(500).json({ message: "Server error" });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});