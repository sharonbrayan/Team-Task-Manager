import express from "express";
const router = express.Router();

// Controllers will be added tomorrow
import { signup, login, logout, getMe } from "../controllers/authController.mjs";

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);

export default router;
