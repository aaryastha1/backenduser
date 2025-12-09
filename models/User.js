import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phoneNumber: { type: String, unique: true }, // optional now, remove required

    password: { type: String, required: true },

    role: { type: String, default: "normal" },

    filepath: { type: String } // profile image path if needed
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
