// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import Product from "../../models/admin/product.js";

// const router = express.Router();

// // ------------------- Multer for image upload -------------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/products";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // ------------------- Add Product -------------------
// router.post("/add", upload.single("image"), async (req, res) => {
//   try {
//     const { name, description, occasion, flavours, sizes } = req.body;

//     if (!name || !occasion || !sizes) {
//       return res.status(400).json({ error: "Name, occasion, and sizes are required" });
//     }

//     // ---------------- Sizes parsing ----------------
//     let sizesArray = [];
//     try {
//       sizesArray = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
//     } catch {
//       return res.status(400).json({ error: "Sizes must be a valid JSON array" });
//     }

//     // ---------------- Flavours parsing ----------------
//     let flavoursArray = [];
//     if (flavours) {
//       try {
//         flavoursArray = typeof flavours === "string" ? JSON.parse(flavours) : flavours;
//         flavoursArray = flavoursArray.map(f => f.toString());
//       } catch {
//         flavoursArray = Array.isArray(flavours) ? flavours.map(f => f.toString()) : [];
//       }
//     }

//     // ---------------- Description ----------------
//     const desc = description ? description.toString() : "";

//     // ---------------- Image ----------------
//     const image = req.file ? `/uploads/products/${req.file.filename}` : "";

//     // ---------------- Create Product ----------------
//     const product = await Product.create({
//       name,
//       description: desc,
//       occasion,
//       flavours: flavoursArray,
//       sizes: sizesArray,
//       image,
//     });

//     res.json({ success: true, product });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ------------------- Get All Products -------------------
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("occasion")
//       .populate("flavours")
//       .sort({ createdAt: -1 });
//     res.json({ products });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ------------------- Get Single Product -------------------
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id)
//       .populate("occasion")
//       .populate("flavours");
//     if (!product) return res.status(404).json({ error: "Product not found" });
//     res.json({ product });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ------------------- Update Product -------------------
// router.put("/edit/:id", upload.single("image"), async (req, res) => {
//   try {
//     const { name, description, occasion, flavours, sizes } = req.body;

//     let sizesArray;
//     if (sizes) {
//       try {
//         sizesArray = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
//       } catch {
//         return res.status(400).json({ error: "Sizes must be a valid JSON array" });
//       }
//     }

//     let flavoursArray = [];
//     if (flavours) {
//       try {
//         flavoursArray = typeof flavours === "string" ? JSON.parse(flavours) : flavours;
//         flavoursArray = flavoursArray.map(f => f.toString());
//       } catch {
//         flavoursArray = Array.isArray(flavours) ? flavours.map(f => f.toString()) : [];
//       }
//     }

//     const updateData = {
//       name,
//       description: description ? description.toString() : "",
//       occasion,
//     };
//     if (sizesArray) updateData.sizes = sizesArray;
//     if (flavoursArray) updateData.flavours = flavoursArray;
//     if (req.file) updateData.image = `/uploads/products/${req.file.filename}`;

//     const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     res.json({ success: true, product });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ------------------- Delete Product -------------------
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) return res.status(404).json({ error: "Product not found" });
//     res.json({ success: true, message: "Product deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// // ------------------- Get Products By Occasion (USER SIDE) -------------------
// router.get("/by-occasion/:occasionId", async (req, res) => {
//   try {
//     const { occasionId } = req.params;

//     const products = await Product.find({ occasion: occasionId })
//       .populate("occasion")
//       .populate("flavours")
//       .sort({ createdAt: -1 });

//     res.json({ products });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

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

/* ================= GET ALL PRODUCTS (ADMIN) ================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("occasion")
      .populate("flavours")
      .populate("colors")
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADD PRODUCT ================= */
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, occasion, flavours, colors, sizes } = req.body;

    if (!name || !occasion || !sizes) {
      return res
        .status(400)
        .json({ error: "Name, occasion and sizes are required" });
    }

    const sizesArray = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    const flavoursArray = flavours
      ? (typeof flavours === "string" ? JSON.parse(flavours) : flavours)
      : [];
    const colorsArray = colors
      ? (typeof colors === "string" ? JSON.parse(colors) : colors)
      : [];

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
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPDATE PRODUCT ================= */
router.put("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) updateData.image = `/uploads/products/${req.file.filename}`;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE PRODUCT ================= */
router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Product not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= GET SINGLE PRODUCT BY ID ================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("occasion")
      .populate("flavours")
      .populate("colors");

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
