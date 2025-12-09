// server.js
import "dotenv/config";
import app from "./index.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5006;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI) // <-- match your .env
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err.message);
  });
