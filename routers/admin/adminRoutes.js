import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../../models/admin/product.js";

const router = express.Router();

// Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/products";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ➕ Add Product
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, sizes } = req.body;

    if (!name || !category || !sizes) {
      return res.status(400).json({ error: "Name, category, and sizes are required" });
    }

    // Parse sizes (expects JSON string from frontend)
    let sizesArray;
    try {
      sizesArray = JSON.parse(sizes); // [{ size: "1 pound", price: 20 }, ...]
    } catch {
      return res.status(400).json({ error: "Sizes should be valid JSON array" });
    }

    const image = req.file ? `/uploads/products/${req.file.filename}` : "";

    const product = await Product.create({ name, description, category, sizes: sizesArray, image });
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 📃 Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
