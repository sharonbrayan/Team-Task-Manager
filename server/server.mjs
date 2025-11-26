import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./config/mongodb.mjs";
import dotenv from "dotenv";
// Import routes (we will create these later)
import authRoutes from "./routes/authRoutes.mjs";
import teamRoutes from "./routes/teamRoutes.mjs";
import taskRoutes from "./routes/taskRoutes.mjs";

const app = express();
dotenv.config();
// Connect to MongoDB
connectDb();

// Middlewares
app.use(express.json());   // To parse JSON bodies
app.use(cookieParser());   // For reading cookies (JWT)
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL, 
      "http://localhost:5173" 
    ], // your frontend URL (vite)
    credentials: true,
  })
);

// Test route
app.get("/", (req, res) => {
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
