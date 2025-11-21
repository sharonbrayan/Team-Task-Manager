// controllers/taskController.mjs
import Task from "../models/taskmodel.mjs";
import Team from "../models/teammodel.mjs";
import User from "../models/usermodel.mjs";
import mongoose from "mongoose";

/**
 * Helper: check if a user is a member of a team
 */
const isMemberOfTeam = (teamDoc, userId) => {
  return teamDoc.members.some((m) => m.user.toString() === userId.toString());
};

// ------------------------------
// CREATE TASK
// POST /api/tasks
// Body: { title, description, dueDate, priority, assignedTo, teamId }
// ------------------------------
export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, assignedTo, teamId } = req.body;
    const userId = req.user._id;

    // basic validations
    if (!title || !teamId) {
      return res.status(400).json({ message: "Title and teamId are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid teamId" });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // permission: user must be a member of the team
    if (!isMemberOfTeam(team, userId)) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }

    // if assignedTo provided, ensure that user exists and is a team member
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({ message: "Invalid assignedTo id" });
      }
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) return res.status(404).json({ message: "Assigned user not found" });

      if (!team.members.some((m) => m.user.toString() === assignedTo.toString())) {
        return res.status(400).json({ message: "Assigned user is not a member of the team" });
      }
    }

    const task = await Task.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      assignedTo: assignedTo || null,
      team: teamId,
      status: "todo",
    });

    return res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// GET TEAM TASKS
// GET /api/tasks/team/:teamId
// ------------------------------
export const getTeamTasks = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid teamId" });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (!isMemberOfTeam(team, userId)) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }

    const tasks = await Task.find({ team: teamId })
      .populate("assignedTo", "name email")
      .populate("comments.author", "name email")
      .sort({ createdAt: -1 });

    return res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// UPDATE TASK
// PATCH /api/tasks/:taskId
// Body: any allowed fields (title, description, dueDate, priority, assignedTo, status)
// ------------------------------
export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const team = await Team.findById(task.team);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // permission: user must be a member of the team
    if (!isMemberOfTeam(team, userId)) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }

    // If assignedTo is being changed, validate new assignee
    if (updates.assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(updates.assignedTo)) {
        return res.status(400).json({ message: "Invalid assignedTo id" });
      }
      const assignedUser = await User.findById(updates.assignedTo);
      if (!assignedUser) return res.status(404).json({ message: "Assigned user not found" });

      if (!team.members.some((m) => m.user.toString() === updates.assignedTo.toString())) {
        return res.status(400).json({ message: "Assigned user is not a member of the team" });
      }
    }

    // Apply updates
    Object.keys(updates).forEach((key) => {
      // basic whitelist to avoid changing protected fields
      const allowed = ["title", "description", "dueDate", "priority", "assignedTo", "status"];
      if (allowed.includes(key)) {
        task[key] = updates[key];
      }
    });

    await task.save();

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("comments.author", "name email");

    return res.json(populated);
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// DELETE TASK
// DELETE /api/tasks/:taskId
// ------------------------------
export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const team = await Team.findById(task.team);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // permission: user must be a team admin OR the user who created the task (we didn't store creator; so require team admin)
    const memberEntry = team.members.find((m) => m.user.toString() === userId.toString());
    if (!memberEntry) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }
    if (memberEntry.role !== "admin") {
      return res.status(403).json({ message: "Only team admins can delete tasks" });
    }

    await Task.findByIdAndDelete(taskId);
    return res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// ADD COMMENT
// POST /api/tasks/:taskId/comments
// Body: { text }
// ------------------------------
export const addComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const team = await Team.findById(task.team);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (!isMemberOfTeam(team, userId)) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }

    task.comments.push({ author: userId, text });
    await task.save();

    const populated = await Task.findById(task._id).populate("comments.author", "name email");

    return res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};


