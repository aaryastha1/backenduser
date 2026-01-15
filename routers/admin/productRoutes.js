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
    // ❌ Prevent negative prices
for (const s of sizesArray) {
  if (s.price < 0) {
    return res.status(400).json({
      error: "Price cannot be negative",
    });
  }
}


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
      return res.status(400).json({
        error: "Name, occasion, and sizes are required",
      });
    }

    // ✅ Parse sizes FIRST
    const parsedSizes = typeof sizes === "string"
      ? JSON.parse(sizes)
      : sizes;

    // ❌ Prevent negative prices
    for (const s of parsedSizes) {
      if (Number(s.price) < 0) {
        return res.status(400).json({
          error: "Price cannot be negative",
        });
      }
    }

    const updateData = {
      name,
      description: description || "",
      occasion,
      sizes: parsedSizes,
      flavours: flavours
        ? (typeof flavours === "string" ? JSON.parse(flavours) : flavours)
        : [],
      colors: colors
        ? (typeof colors === "string" ? JSON.parse(colors) : colors)
        : [],
    };

    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true, // ✅ very important
      }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("Edit product error:", err.message);
    res.status(500).json({ error: err.message });
  }
});



router.get("/by-occasion/:occasionId", async (req, res) => {
  try {
    const { occasionId } = req.params;
    const { flavour } = req.query; // <-- get flavour from query

    let query = { occasion: occasionId };

    if (flavour && flavour !== "all") {
      query.flavours = flavour; // MongoDB will match ObjectId in array
    }

    const products = await Product.find(query)
      .populate("occasion")
      .populate("flavours")
      .populate("colors")
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    console.error("Get products by occasion error:", err.message);
    res.status(500).json({ error: err.message });
  }
});




/* ================= DELETE PRODUCT ================= */
router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 🧹 Optional: delete image file from server
    if (product.image) {
      const imagePath = path.join(process.cwd(), product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err.message);
    res.status(500).json({ error: err.message });
  }
});





export default router;
