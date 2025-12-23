import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Get logged-in user's favorites
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ return object with key 'favorites'
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle favorite (add/remove)
router.post("/toggle", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.findIndex(id => id.toString() === productId);
    if (index === -1) {
      user.favorites.push(productId); // add
    } else {
      user.favorites.splice(index, 1); // remove
    }

    await user.save();
    await user.populate("favorites");

    // ✅ return object with key 'favorites'
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
