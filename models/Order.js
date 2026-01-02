// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [],
  amount: Number,
  shipping: Number,
  total: Number,
  paymentMethod: String,
  paymentStatus: { type: String, default: "PENDING" },
  esewaRefId: String,
  address: String,
  phone: String,
  scheduleDate: String,
  scheduleTime: String,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
