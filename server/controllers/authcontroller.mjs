import User from "../models/usermodel.mjs";
import jwt from "jsonwebtoken";
import 'dotenv/config'
// --------------------
// helper: create token
// --------------------
const createToken = (payload) => {
    return jwt.sign(payload, "secret", {
        expiresIn: "1d",
    });
};

// --------------------
// POST /signup
// --------------------
export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const user = await User.create({ name, email, password });

        const token = createToken({ id: user._id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

// --------------------
// POST /login
// --------------------
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = createToken({ id: user._id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.json({
            message: "Logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

// --------------------
// POST /logout
// --------------------
export const logout = (req, res) => {
    res.clearCookie("token");
    return res.json({ message: "Logged out successfully" });
};

// --------------------
// GET /me
// --------------------
export const getMe = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, "secret");
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ user });
    } catch (error) {
        next(error);
    }
};
