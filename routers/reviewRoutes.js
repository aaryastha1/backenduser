import express from "express";
import Review from "../models/review.js";

const router = express.Router();

// ➕ Add Review
router.post("/", async (req, res) => {
  try {
    const { itemId, itemType, userName, rating, comment } = req.body;

    const review = new Review({
      itemId,
      itemType,
      userName,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📥 Get Reviews
router.get("/:itemType/:itemId", async (req, res) => {
  try {
    const { itemType, itemId } = req.params;

    const reviews = await Review.find({ itemType, itemId }).sort({
      createdAt: -1,
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
