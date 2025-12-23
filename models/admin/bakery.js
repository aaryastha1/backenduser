import mongoose from "mongoose";

const bakerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Pastries or Breads
      required: true,
    },
     image: { type: String, default: "" }, 
  },
  { timestamps: true }
);

const Bakery =
  mongoose.models.Bakery || mongoose.model("Bakery", bakerySchema);

export default Bakery;
