import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // Works for both Bakery & Product
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    itemType: {
      type: String,
      enum: ["Product", "Bakery"],
      required: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
