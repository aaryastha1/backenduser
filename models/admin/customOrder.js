// models/admin/CustomOrder.js
import mongoose from "mongoose";

const customOrderSchema = new mongoose.Schema({
  cakeId: String,
  color: [String],
  size: [String],
  flavor: [String],
  message: [String],
  extras: [String],
  referenceImage: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CustomOrder", customOrderSchema); // <-- export default
