import jwt from "jsonwebtoken";
import User from "../models/usermodel.mjs";

// -------------------------------------
// PROTECT ROUTES (requires login)
// -------------------------------------
export const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        req.user = user; // attach user to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// -------------------------------------
// ROLE BASED ACCESS (optional)
// -------------------------------------
export const restrictTo = (...allowed) => {
    return (req, res, next) => {
        if (!allowed.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
