import express from "express";
import Order from "../../models/Order.js";
import authMiddleware from "../../middlewares/auth.js";
import adminMiddleware from "../../middlewares/admin.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      // We don't strictly need to populate productId if name and image 
      // are already saved inside the order.items array.
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Admin fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
export default router;