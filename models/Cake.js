import mongoose from "mongoose";

const cakeSchema = new mongoose.Schema({
  name: String,
  price: Number,

  baseImage: String,   // main cake image
  maskImage: String,   // color-change mask (PNG)

  availableColors: [String], // ["Pink", "Blue", "Red"]
  flavors: [String],
  sizes: [String],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Cake", cakeSchema);
