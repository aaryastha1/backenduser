import express from "express";
import Bakery from "../../models/admin/bakery.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/bakery";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ GET all bakery items (Admin listing)
router.get("/", async (req, res) => {
  try {
    const items = await Bakery.find().populate("category", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST add bakery product (NO negative price)
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        error: "Name, price and category are required",
      });
    }

    // ❌ Prevent negative price
    if (Number(price) < 0) {
      return res.status(400).json({
        error: "Price cannot be negative",
      });
    }

    const bakery = await Bakery.create({
      name,
      price: Number(price),
      category,
      image: req.file ? `/${req.file.path}` : "",
    });

    res.json({ success: true, bakery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET bakery products by category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Bakery.find({ category: categoryId }).populate("category", "name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT update bakery item (NO negative price)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ❌ Prevent negative price (if price is being updated)
    if (updateData.price !== undefined && Number(updateData.price) < 0) {
      return res.status(400).json({
        error: "Price cannot be negative",
      });
    }

    if (req.file) {
      updateData.image = `/${req.file.path}`;
    }

    const updated = await Bakery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Bakery item not found" });
    }

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET single bakery item (View)
router.get("/:id", async (req, res) => {
  try {
    const item = await Bakery.findById(req.params.id).populate("category", "name");
    if (!item) {
      return res.status(404).json({ error: "Bakery item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ DELETE bakery item
router.delete("/:id", async (req, res) => {
  try {
    const item = await Bakery.findById(req.params.id);
    if (item?.image) {
      // delete the image file
      fs.unlinkSync(item.image.slice(1)); // remove starting "/" from path
    }
    await Bakery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






export default router;
