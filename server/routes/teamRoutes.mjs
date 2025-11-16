import express from "express";
const router = express.Router();

// Controllers will be added tomorrow
import {
  createTeam,
  getMyTeams,
  inviteMember,
  getTeamDetails,
} from "../controllers/teamController.mjs";

// Create a team
router.post("/", createTeam);

// Get all teams of logged-in user
router.get("/", getMyTeams);

// Invite member to team
router.post("/:teamId/invite", inviteMember);

// Get team details + members
router.get("/:teamId", getTeamDetails);

export default router;
