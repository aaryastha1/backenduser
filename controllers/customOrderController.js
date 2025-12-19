// controllers/customOrderController.js
import CustomOrder from "../models/admin/CustomOrder.js";

// Create a new custom order
export const createCustomOrder = async (req, res) => {
  try {
    const data = req.body;
    const newOrder = new CustomOrder({
      ...data,
      extras: data.extras ? JSON.parse(data.extras) : [],
      referenceImage: req.file ? req.file.filename : null,
    });
    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all custom orders (for admin)
export const getAllCustomOrders = async (req, res) => {
  try {
    const orders = await CustomOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
