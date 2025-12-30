import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  addToCart,
  getUserCart,
  removeFromCart,
  subtractFromCart
} from "../controllers/cartController.js";

const router = express.Router();

// ➕ ADD TO CART (user only)
router.post("/add", authMiddleware, addToCart);

router.post("/subtract", authMiddleware, subtractFromCart);

// 📦 GET USER CART
router.get("/", authMiddleware, getUserCart);

// ❌ REMOVE FROM CART (productId + size)
router.delete("/remove/:productId/:size", authMiddleware, removeFromCart);

export default router;
