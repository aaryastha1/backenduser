// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phoneNumber: { type: String, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, default: "normal" },
//     filepath: { type: String },
//     favorites: [
//       {
//         type: mongoose.Schema.Types.ObjectId, // assuming products are in Product collection
//         ref: "Product"
//       }
//     ]
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);



import mongoose from "mongoose";
const cartItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["Product", "Bakery", ], // <- tells if it's a product or bakery
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "itemType", // <- dynamic reference based on itemType
    },
    selectedSize: {
      type: String,
      default: "", // optional, only for products with sizes
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);



const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "normal" },
    filepath: { type: String },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // 🛒 ADD TO CART HERE
    cart: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
