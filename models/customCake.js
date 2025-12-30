import mongoose from "mongoose";

const customCakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", // reference to size category
    required: true
  },
  flavor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", // reference to flavor category
    required: true
  },
  description: { type: String }, // note
  price: { type: Number, required: true }, // comes from size category
  createdAt: { type: Date, default: Date.now },
});

const CustomCake = mongoose.models.CustomCake || mongoose.model("CustomCake", customCakeSchema);

export default CustomCake;
