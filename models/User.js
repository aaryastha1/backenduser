import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "normal" },
    filepath: { type: String },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId, // assuming products are in Product collection
        ref: "Product"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
