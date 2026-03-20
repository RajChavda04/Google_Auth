import express from "express";
import {
  registerUser,
  loginUser,
  googleAuthUser,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-auth", googleAuthUser);
router.get("/profile", getUserProfile);

export default router;
