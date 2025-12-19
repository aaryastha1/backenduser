import express from "express";
import multer from "multer";
import Cake from "../../models/admin/cakeadmin.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post(
  "/add",
  upload.fields([
    { name: "baseImage", maxCount: 1 },
    { name: "colorMask", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("req.files:", req.files);
      console.log("req.body:", req.body);

      if (!req.files?.baseImage || !req.files?.colorMask)
        return res.status(400).json({ error: "Both images are required" });

      const { name, price, availableColors, flavors, sizes } = req.body;
      if (!name || !price)
        return res.status(400).json({ error: "Name and price are required" });

      const cake = new Cake({
        name,
        price: Number(price),
        availableColors: availableColors ? JSON.parse(availableColors) : [],
        flavors: flavors ? JSON.parse(flavors) : [],
        sizes: sizes ? JSON.parse(sizes) : [],
        baseImage: req.files.baseImage[0].filename,
        colorMask: req.files.colorMask[0].filename,
      });

      const savedCake = await cake.save();
      res.json({ success: true, cake: savedCake.toObject() });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
