import express from "express";

import { verifyToken } from "@middleware/require-auth";
import {
  editUserProfile,
  generatePasswordResetToken,
  getUserProfile,
  login,
  resetPassword,
} from "@controllers/auth-controller";

const authRoutes = express.Router();

authRoutes.get("/profile", verifyToken, getUserProfile);
authRoutes.put("/profile", verifyToken, editUserProfile);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password", generatePasswordResetToken);
authRoutes.post("/reset-password", resetPassword);

export default authRoutes;
