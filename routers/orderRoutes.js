import express from "express";
import multer from "multer";
import CustomOrder from "../models/CustomModel.js";

const router = express.Router();

// Storage settings for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// POST: upload image + save order
router.post("/custom", upload.single("image"), async (req, res) => {
  try {
    const order = new CustomOrder({
      userName: req.body.userName,
      selectedCakeId: req.body.selectedCakeId,
      color: req.body.color,
      size: req.body.size,
      occasion: req.body.occasion,
      message: req.body.message,
      uploadedImage: req.file ? req.file.filename : null,
    });

    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
