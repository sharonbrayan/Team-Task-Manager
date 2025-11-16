import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    description: { type: String },

    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        // Role *inside* the team (not global)
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
