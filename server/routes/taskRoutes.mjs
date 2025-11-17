import express from "express";
import { protect } from "../middleware/authmiddleware.mjs";
const router = express.Router();

// Controllers will be added tomorrow
import {
  createTask,
  updateTask,
  deleteTask,
  getTeamTasks,
  addComment,
} from "../controllers/taskcontroller.mjs";

// Tasks for a team
router.get("/team/:teamId",protect, getTeamTasks);

// Create task
router.post("/",protect, createTask);

// Update task
router.patch("/:taskId",protect, updateTask);

// Delete task
router.delete("/:taskId", protect,deleteTask);

// Add a comment to a task
router.post("/:taskId/comments", protect,addComment);

export default router;
