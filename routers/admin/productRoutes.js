import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../../models/admin/product.js";

const router = express.Router();

/* ================= MULTER ================= */
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

/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("occasion")
      .populate("flavours")
      .populate("colors")
      .sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    console.error("Get all products error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADD PRODUCT ================= */
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, occasion, flavours, colors, sizes } = req.body;

    if (!name || !occasion || !sizes) {
      return res.status(400).json({ error: "Name, occasion, and sizes are required" });
    }

    const sizesArray = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    const flavoursArray = flavours ? (typeof flavours === "string" ? JSON.parse(flavours) : flavours) : [];
    const colorsArray = colors ? (typeof colors === "string" ? JSON.parse(colors) : colors) : [];

    const image = req.file ? `/uploads/products/${req.file.filename}` : "";

    const product = await Product.create({
      name,
      description: description || "",
      occasion,
      flavours: flavoursArray,
      colors: colorsArray,
      sizes: sizesArray,
      image,
    });

    res.json({ success: true, product });
  } catch (err) {
    console.error("Add product error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET PRODUCT BY ID ================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("occasion")
      .populate("flavours")
      .populate("colors");

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ product });
  } catch (err) {
    console.error("Get product by ID error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= EDIT PRODUCT ================= */
router.put("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, occasion, sizes, flavours, colors } = req.body;

    if (!name || !occasion || !sizes) {
      return res.status(400).json({ error: "Name, occasion, and sizes are required" });
    }

    const updateData = {
      name,
      description: description || "",
      occasion,
      sizes: typeof sizes === "string" ? JSON.parse(sizes) : sizes,
      flavours: flavours ? (typeof flavours === "string" ? JSON.parse(flavours) : flavours) : [],
      colors: colors ? (typeof colors === "string" ? JSON.parse(colors) : colors) : [],
    };

    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    console.error("Edit product error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE PRODUCT ================= */
router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= PRODUCTS BY OCCASION + FILTERS ================= */
router.get("/by-occasion/:occasionId", async (req, res) => {
  try {
    const { occasionId } = req.params;
    const { flavour, color, size } = req.query;

    const filter = { occasion: occasionId };
    if (flavour) filter.flavours = { $in: [flavour] };
    if (color) filter.colors = { $in: [color] };
    if (size) filter["sizes.size"] = size;

    const products = await Product.find(filter)
      .populate("occasion")
      .populate("flavours")
      .populate("colors")
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    console.error("Products by occasion error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET FAVORITE PRODUCTS ================= */
router.post("/favorites", async (req, res) => {
  const { ids } = req.body; // array of product IDs
  try {
    const products = await Product.find({ _id: { $in: ids } })
      .populate("occasion")
      .populate("flavours")
      .populate("colors");
    res.json(products);
  } catch (err) {
    console.error("Get favorite products error:", err.message);
    res.status(500).json({ message: "Failed to fetch favorite products" });
  }
});

export default router;
