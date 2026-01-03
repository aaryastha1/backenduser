// routes/orders.js
import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

/**
 * ✅ CREATE ORDER
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      items,
      amount,
      shipping,
      total,
      paymentMethod,
      paymentStatus,
      esewaRefId,
      firstName,  // <-- new
      lastName,
      address,
      phone,
      scheduleDate,
      scheduleTime,
    } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "No order items" });

    // Map items and allow product as string to avoid ObjectId errors
    const orderItems = items.map((item) => ({
      product: item._id || item.product || null, // keep whatever ID you send
      name: item.name ||  "Product", 
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      flavor: item.flavor,
      size: item.size,
      note: item.note,
    }));

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      amount,
      shipping,
      total,
      paymentMethod,
      paymentStatus,
      esewaRefId,
      firstName,
      lastName,
      address,
      phone,
      scheduleDate,
      scheduleTime,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
});

/**
 * GET MY ORDERS
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/**
 * GET SINGLE ORDER
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

export default router;
