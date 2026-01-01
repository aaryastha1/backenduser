import express from "express";
import Product from "../models/admin/product.js";
import Category from "../models/admin/category.js";
import Bakery from "../models/admin/bakery.js";

const router = express.Router();

/**
 * 🔍 GLOBAL SEARCH
 * GET /api/search?q=cake
 */
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json({
        products: [],
        bakeries: [],
        categories: [],
      });
    }

    const regex = new RegExp(q, "i"); // case-insensitive search

    /* ---------------- PRODUCTS (CAKES) ---------------- */
    const products = await Product.find({
      name: regex,
    })
      .select("_id name image")
      .limit(6);

    /* ---------------- BAKERY ITEMS ---------------- */
    const bakeries = await Bakery.find({
      name: regex,
    })
      .select("_id name price image category")
      .populate("category", "name type")
      .limit(6);

    /* ---------------- CATEGORIES ---------------- */
    const categories = await Category.find({
      name: regex,
    })
      .select("_id name type image")
      .limit(6);

    res.status(200).json({
      products,
      bakeries,
      categories,
    });
  } catch (error) {
    console.error("🔴 Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

export default router;
