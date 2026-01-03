// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      image: String, // Store the image URL here
      category: String // e.g., 'Bakery' or 'Cake'
    }
  ],
  amount: Number,
  shipping: Number,
  total: Number,
  paymentMethod: String,
  paymentStatus: { type: String, default: "PENDING" },
  esewaRefId: String,
  firstName: String,  // <-- new
  lastName: String,
  address: String,
  phone: String,
  scheduleDate: String,
  scheduleTime: String,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
