// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, message: "Missing credential" });

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email,
        password: "google-auth",
        filepath: picture
      });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, message: "Google login successful", data: user, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Google login failed" });
  }
};
