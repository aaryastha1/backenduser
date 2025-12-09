import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { googleAuth } from "../controllers/authgoogleController.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

router.post("/google", googleAuth);  

export default router;
