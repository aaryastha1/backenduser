import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  addToCart,
  subtractFromCart,
  removeFromCart,
  getUserCart,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();

// ➕ Add to cart
router.post("/add", authMiddleware, addToCart);


// 🧹 Clear entire cart (ADD THIS LINE)
router.delete("/clear", authMiddleware, clearCart);

// ➖ Subtract from cart
router.post("/subtract", authMiddleware, subtractFromCart);

// 📦 Get cart
router.get("/", authMiddleware, getUserCart);

// ❌ Remove from cart
// optional query `?size=` for Product
router.delete("/remove/:itemId/:itemType", authMiddleware, removeFromCart);

export default router;
