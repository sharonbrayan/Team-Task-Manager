import express from "express";
const router = express.Router();

// Controllers will be added tomorrow
import { signup, login, logout, getMe } from "../controllers/authcontroller.mjs";

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);

export default router;
