import express from "express";
import { 
  getAllCustomCakes, 
  getCustomCakeById, 
  createCustomCake 
} from "../controllers/customCakeController.js";

const router = express.Router();

// Custom cake routes
router.get("/", getAllCustomCakes);
router.get("/:id", getCustomCakeById);
router.post("/", createCustomCake);

export default router;
