// import mongoose from "mongoose";

// const customCakeSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     image: { type: String },
//     basePrice: { type: Number, required: true },

//     // Link to Category IDs
//     flavour: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
//     size: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
//     color: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("CustomCake", customCakeSchema);


import mongoose from "mongoose";

const customCakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    basePrice: { type: Number, required: true },
    flavour: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    size: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    color: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    colorImages: [
      { color: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, image: String }
    ],
    shape: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // NEW
    toppings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // NEW
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("CustomCake", customCakeSchema);
