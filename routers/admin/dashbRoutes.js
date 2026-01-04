import express from "express";
const router = express.Router();
import { getDashboardStats } from "../../controllers/adminController.js";
// import { protect, adminOnly } from "../middleware/authMiddleware.js"; // Highly recommended

// This creates the endpoint: GET /api/admin/dashboard-stats
router.get("/dashboard-stats", getDashboardStats);

export default router;