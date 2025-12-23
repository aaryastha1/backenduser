import mongoose from "mongoose";

const customOrderSchema = new mongoose.Schema({
  cakeId: { type: mongoose.Schema.Types.ObjectId, ref: "CustomCake", required: true },
  color: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  size: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  flavor: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  message: String,
  extras: [String],
  referenceImage: String,
  notes: String,
  finalPrice: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CustomOrder", customOrderSchema);
