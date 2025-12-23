import express from "express";
import cors from "cors";
import path from "path";

// Import your routes
import userRoutes from "./routers/userRoutes.js";
import homeRoutes from "./routers/homeRoutes.js";
import profileRoute from "./routers/profileRoute.js";
import favoriteRoutes from "./routers/favoriteRoutes.js";

import cakeRoutes from "./routers/cakeRoutes.js";
import customizeRoutes from "./routers/customizeRoutes.js";
import admincakeRoutes from "./routers/admin/admincakeRoutes.js";
import customOrderRoutes from "./routers/admin/customOrderRoutes.js";
import customCakeRoutes from "./routers/admin/customCakeRoutes.js"
import bakeryRoutes from "./routers/admin/bakeryRoutes.js"




const app = express();

// Middlewares
app.use(cors());
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


// NEW APIs for customization
app.use("/api/cakes", cakeRoutes);          // GET filtering cakes
app.use("/api/customize", customizeRoutes);


app.use("/api/admin/cakes", admincakeRoutes);

import categoryRoutes from "./routers/admin/categoryRoutes.js";

app.use("/api/admin/categories", categoryRoutes);


import productRoutes from "./routers/admin/productRoutes.js";

app.use("/api/admin/products", productRoutes);
app.use("/api/customOrders", customOrderRoutes);
app.use("/api/admin/custom-cakes", customCakeRoutes);
app.use("/api/admin/bakery", bakeryRoutes);

// Export app so server.js can start it
export default app;
