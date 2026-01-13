import dotenv from "dotenv";
dotenv.config()

import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routers/userRoutes.js";
import homeRoutes from "./routers/homeRoutes.js";
import profileRoute from "./routers/profileRoute.js";
import favoriteRoutes from "./routers/favoriteRoutes.js";
import cartRoutes from "./routers/cartRoutes.js";

import cakeRoutes from "./routers/cakeRoutes.js";
import adminOrder from "./routers/admin/adminOrder.js";

import admincakeRoutes from "./routers/admin/admincakeRoutes.js";
import customOrderRoutes from "./routers/admin/customOrderRoutes.js";
import customCakeRoutes from "./routers/customCakeRoutes.js";
import bakeryRoutes from "./routers/admin/bakeryRoutes.js";
import searchRoutes from "./routers/searchRoutes.js";
import orderRoutes from "./routers/orderRoutes.js"
import reviewRoutes from "./routers/reviewRoutes.js";

const app = express();

// Middlewares
// Middlewares
app.use(cors());

// ✅ Increase the limit to 50mb to allow product images in the order
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());


// ⭐ Make uploads folder public (ADD THIS)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Virtual Closet Backend is running!");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/user", profileRoute)
app.use("/api/favorites", favoriteRoutes);
app.use("/api", searchRoutes);
app.use("/api/cakes", cakeRoutes);          // GET filtering cakes
app.use("/api/admin/cakes", admincakeRoutes);

import categoryRoutes from "./routers/admin/categoryRoutes.js";
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
import productRoutes from "./routers/admin/productRoutes.js";

app.use("/api/admin/products", productRoutes);
app.use("/api/customOrders", customOrderRoutes);
app.use("/api/custom-cakes", customCakeRoutes);
app.use("/api/admin/bakery", bakeryRoutes);
app.use("/api/admin/orders", adminOrder);
// server.js
import adminDashboardRoutes from "./routers/admin/dashbRoutes.js"; // or your specific filename

app.use("/api/admin/dash", adminDashboardRoutes);



app.use("/api/orders", orderRoutes);


import paymentRoutes from "./routers/payment.js";

app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes)


// Export app so server.js can start it
export default app;
