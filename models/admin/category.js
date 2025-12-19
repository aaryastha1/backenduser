// // models/admin/category.js
// import mongoose from "mongoose";

// const categorySchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true, unique: true },
//     type: { type: String, required: true, enum: ["occasion", "flavour", "size"] },
//     image: { type: String, default: "" }, // path or URL
//   },
//   { timestamps: true }
// );

// const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
// export default Category;



// models/admin/category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["occasion", "flavour", "size", "color"], // ✅ ADD color
    },
    image: { type: String, default: "" }, 
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
