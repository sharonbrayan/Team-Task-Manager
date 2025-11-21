import express from "express";
import { protect } from "../middleware/authmiddleware.mjs";
const router = express.Router();

// Controllers will be added tomorrow
import {
  createTeam,
  getMyTeams,
  inviteMember,
  getTeamDetails,
  deleteTeam,
} from "../controllers/teamcontroller.mjs";

// Create a team
router.post("/",protect, createTeam);

// Get all teams of logged-in user
router.get("/", protect, getMyTeams);

// Invite member to team
router.post("/:teamId/invite", protect, inviteMember);

// Get team details + members
router.get("/:teamId", protect, getTeamDetails);

router.delete("/:teamId", protect, deleteTeam);

export default router;

