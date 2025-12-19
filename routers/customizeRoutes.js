import express from "express";
import multer from "multer";
import CustomOrder from "../models/admin/CustomOrder.js";

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// POST: Save Custom Cake Order
router.post("/order", upload.single("image"), async (req, res) => {
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

    res.json({
      success: true,
      message: "Custom order saved!",
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
