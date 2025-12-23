import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;
