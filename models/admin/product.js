// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     description: { type: String, default: "" },
//     occasion: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // type: occasion
//     flavours: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // type: flavour
//     sizes: [
//       {
//         size: { type: String, required: true }, // e.g., "1 Pound"
//         price: { type: Number, required: true },
//       },
//     ],
//     image: { type: String, default: "" }, // image path
//   },
//   { timestamps: true }
// );

// const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
// export default Product;



import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // 🎉 Occasion (Category type = occasion)
    occasion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // 🍓 Flavours (Category type = flavour)
    flavours: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // 🎨 Colors (Category type = color)
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // 📏 Sizes
    sizes: [
      {
        size: { type: String, required: true }, // "1 Pound"
        price: { type: Number, required: true },
      },
    ],

    // 🖼 Image
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
