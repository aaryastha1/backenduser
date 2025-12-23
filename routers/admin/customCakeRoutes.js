import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createCustomCake, getAllCustomCakes, getCustomCakeById } from "../../controllers/customCakeController.js";

const router = express.Router();

// Ensure folder exists
const uploadDir = path.join("uploads", "custom-cakes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 }, // main image
    { name: "colorImages", maxCount: 20 } // multiple color images
  ]),
  createCustomCake
);

router.get("/", getAllCustomCakes);
router.get("/:id", getCustomCakeById);

export default router;
