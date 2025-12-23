import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ✅ Get logged-in user
export const getProfile = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

// ✅ Update profile
export const updateProfile = async (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    { firstName, lastName, phoneNumber },
    { new: true }
  ).select("-password");

  res.json(user);
};

// ✅ Change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.userId);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
};
