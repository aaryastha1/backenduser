import express from "express";
import cors from "cors";

// Import your routes
import userRoutes from "./routers/userRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Virtual Closet Backend is running!");
});

// API Routes
app.use("/api/users", userRoutes);

// Export app so server.js can start it
export default app;
