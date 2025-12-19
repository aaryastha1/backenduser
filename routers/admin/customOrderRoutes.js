// routes/customOrderRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { createCustomOrder, getAllCustomOrders } from "../../controllers/customOrderController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("referenceImage"), createCustomOrder);
router.get("/", getAllCustomOrders);

export default router;
