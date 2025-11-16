import express from "express";
const router = express.Router();

// Controllers will be added tomorrow
import {
  createTask,
  updateTask,
  deleteTask,
  getTeamTasks,
  addComment,
} from "../controllers/taskController.mjs";

// Tasks for a team
router.get("/team/:teamId", getTeamTasks);

// Create task
router.post("/", createTask);

// Update task
router.patch("/:taskId", updateTask);

// Delete task
router.delete("/:taskId", deleteTask);

// Add a comment to a task
router.post("/:taskId/comments", addComment);

export default router;
