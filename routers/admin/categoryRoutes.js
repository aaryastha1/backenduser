// routes/admin/categories.js
import express from "express";
import Category from "../../models/admin/category.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/categories";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ➕ Add Category
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) return res.status(400).json({ error: "Name and type are required" });

    const exists = await Category.findOne({ name, type });
    if (exists) return res.status(400).json({ error: "Category already exists" });

    const image = req.file ? `/uploads/categories/${req.file.filename}` : "";
    const category = await Category.create({ name, type, image });
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📃 Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📃 Get categories by type
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const categories = await Category.find({ type }).sort({ createdAt: -1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update category
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    const updateData = { name, type };
    if (req.file) updateData.image = `/uploads/categories/${req.file.filename}`;
    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑 Delete category
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
