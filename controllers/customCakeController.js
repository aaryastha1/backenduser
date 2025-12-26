import mongoose from "mongoose";
import CustomCake from "../models/admin/CustomCake.js";

// Helper to parse comma-separated IDs
const parseIds = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((id) => id.trim())
    .filter((id) => mongoose.Types.ObjectId.isValid(id));
};

// ------------------ CREATE CUSTOM CAKE ------------------
export const createCustomCake = async (req, res) => {
  try {
    const { name, basePrice, flavour, size, color, shape, toppings } = req.body;

    // Parse IDs
    const flavourIds = parseIds(flavour);
    const sizeIds = parseIds(size);
    const colorIds = parseIds(color);
    const shapeIds = parseIds(shape);       // ✅ NEW
    const toppingIds = parseIds(toppings);  // ✅ NEW

    // Prepare colorImages array
    const colorImagesArray = [];
    if (req.files && req.files.colorImages) {
      req.files.colorImages.forEach((file, index) => {
        colorImagesArray.push({
          color: colorIds[index] || null, // match color ID with uploaded image
          image: `/uploads/custom-cakes/${file.filename}`,
        });
      });
    }

    // Create cake
    const cake = await CustomCake.create({
      name,
      basePrice,
      image: req.files?.image ? `/uploads/custom-cakes/${req.files.image[0].filename}` : "",
      flavour: flavourIds,
      size: sizeIds,
      color: colorIds,
      colorImages: colorImagesArray,
      shape: shapeIds,       // ✅ include shape
      toppings: toppingIds,  // ✅ include toppings
    });

    res.status(201).json({ success: true, cake });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------ GET ALL CUSTOM CAKES ------------------
export const getAllCustomCakes = async (req, res) => {
  try {
    const cakes = await CustomCake.find({ isActive: true })
      .populate("flavour", "name desc")
      .populate("size", "name price")
      .populate("color", "name")
      .populate("colorImages.color", "name")
      .populate("shape", "name image")    // ✅ shape populated
      .populate("toppings", "name image") // ✅ toppings populated
      .sort({ createdAt: -1 });

    res.json(cakes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------ GET SINGLE CUSTOM CAKE ------------------
export const getCustomCakeById = async (req, res) => {
  try {
    const cake = await CustomCake.findById(req.params.id)
      .populate("flavour", "name desc")
      .populate("size", "name price")
      .populate("color", "name")
      .populate("colorImages.color", "name")
      .populate("shape", "name image")    // ✅ shape populated
      .populate("toppings", "name image"); // ✅ toppings populated

    res.json(cake);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
