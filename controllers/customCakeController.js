import CustomCake from "../models/CustomCake.js";
import Category from "../models/admin/category.js";

// Get all cakes
export const getAllCustomCakes = async (req, res) => {
  try {
    const cakes = await CustomCake.find()
      .populate("size", "name price")     // populate size name and price
      .populate("flavor", "name");       // populate flavor name
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single cake by ID
export const getCustomCakeById = async (req, res) => {
  try {
    const cake = await CustomCake.findById(req.params.id)
      .populate("size", "name price")
      .populate("flavor", "name");

    if (!cake) return res.status(404).json({ message: "Cake not found" });

    res.json({
      id: cake._id,
      name: cake.name,
      size: cake.size,
      flavor: cake.flavor,
      description: cake.description,
      price: cake.price,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create new cake (admin)
export const createCustomCake = async (req, res) => {
  try {
    const { name, sizeId, flavorId, description } = req.body;

    // fetch price from size category
    const sizeCategory = await Category.findById(sizeId);
    if (!sizeCategory) return res.status(400).json({ message: "Invalid size category" });

    const price = sizeCategory.price;

    const newCake = new CustomCake({
      name,
      size: sizeId,
      flavor: flavorId,
      description,
      price,
    });

    const savedCake = await newCake.save();
    res.status(201).json(savedCake);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
