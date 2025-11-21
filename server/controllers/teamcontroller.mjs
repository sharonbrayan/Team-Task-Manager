import Team from "../models/teammodel.mjs";
import User from "../models/usermodel.mjs";
import Task from "../models/taskmodel.mjs"; 
// -------------------------------------
// CREATE TEAM
// POST /api/teams
// -------------------------------------
export const createTeam = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const userId = req.user._id; // will come from auth middleware

        const team = await Team.create({
            name,
            description,
            members: [{ user: userId, role: "admin" }],
        });

        // add team reference to user
        await User.findByIdAndUpdate(userId, {
            $push: { teams: team._id },
        });

        return res.status(201).json(team);
    } catch (error) {
        next(error);
    }
};

// -------------------------------------
// GET MY TEAMS
// GET /api/teams
// -------------------------------------
export const getMyTeams = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const teams = await Team.find({
            "members.user": userId,
        }).select("name description members");

        return res.json(teams);
    } catch (error) {
        next(error);
    }
};

// -------------------------------------
// INVITE MEMBER
// POST /api/teams/:teamId/invite
// -------------------------------------
export const inviteMember = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const { email } = req.body; // user invited by email

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add user to team
        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            {
                $push: { members: { user: user._id, role: "member" } },
            },
            { new: true }
        );

        // Add team to user's team list
        await User.findByIdAndUpdate(user._id, {
            $push: { teams: teamId },
        });

        return res.json({
            message: "User invited successfully",
            team: updatedTeam,
        });
    } catch (error) {
        next(error);
    }
};

// -------------------------------------
// GET TEAM DETAILS
// GET /api/teams/:teamId
// -------------------------------------
export const getTeamDetails = async (req, res, next) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId)
            .populate("members.user", "name email");

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        return res.json(team);
    } catch (error) {
        next(error);
    }
};


export const deleteTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const userId = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // ONLY admin of that team can delete
    const memberEntry = team.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    if (!memberEntry || memberEntry.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete team" });
    }

    // Remove team reference from all users
    await User.updateMany(
      { teams: teamId },
      { $pull: { teams: teamId } }
    );

    // Delete all tasks in the team
    await Task.deleteMany({ team: teamId });

    // Delete team
    await Team.findByIdAndDelete(teamId);

    res.json({ message: "Team deleted" });
  } catch (err) {
    next(err);
  }
};
