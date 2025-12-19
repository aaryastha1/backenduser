import mongoose from "mongoose";

const cakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },

    baseImage: { type: String, required: true },   // original cake
    colorMask: { type: String },                   // png for recolor

    availableColors: [String],
    flavors: [String],
    sizes: [String],
  },
  { timestamps: true }
);

// ✅ THIS LINE PREVENTS OverwriteModelError
const Cake =
  mongoose.models.Cake || mongoose.model("Cake", cakeSchema);

export default Cake;
