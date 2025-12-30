import User from "../models/User.js";
import Product from "../models/admin/product.js";

/**
 * ➕ ADD TO CART
 * body: { productId, size, quantity, replace }
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    let { productId, size, quantity = 1, replace = false } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ message: "Product and size are required" });
    }

    size = size.trim(); // remove extra spaces
    const normalizedSize = size.toLowerCase();

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const selectedSize = product.sizes.find(s => s.size.trim().toLowerCase() === normalizedSize);
    if (!selectedSize) return res.status(400).json({ message: "Invalid size selected" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Merge duplicates and normalize legacy items
    const mergedCart = [];
    user.cart.forEach(item => {
      const index = mergedCart.findIndex(
        i => i.product.toString() === item.product.toString() &&
             i.selectedSize?.trim().toLowerCase() === item.selectedSize?.trim().toLowerCase()
      );
      if (index > -1) {
        mergedCart[index].quantity += item.quantity;
      } else {
        mergedCart.push(item);
      }
    });
    user.cart = mergedCart;

    // Find if item already exists
    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId && item.selectedSize.trim().toLowerCase() === normalizedSize
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = replace
        ? quantity
        : user.cart[itemIndex].quantity + quantity;
    } else {
      user.cart.push({
        product: productId,
        selectedSize: size, // keep display format
        quantity,
        price: selectedSize.price,
      });
    }

    await user.save();
    res.status(200).json({ message: "Cart updated", cart: user.cart });

  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ➖ SUBTRACT FROM CART
 * body: { productId, size }
 */
export const subtractFromCart = async (req, res) => {
  try {
    let { productId, size } = req.body;
    if (!productId || !size) return res.status(400).json({ message: "Product and size required" });

    size = size.trim();
    const normalizedSize = size.toLowerCase();

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Merge duplicates and normalize legacy items
    const mergedCart = [];
    user.cart.forEach(item => {
      const index = mergedCart.findIndex(
        i => i.product.toString() === item.product.toString() &&
             i.selectedSize?.trim().toLowerCase() === item.selectedSize?.trim().toLowerCase()
      );
      if (index > -1) {
        mergedCart[index].quantity += item.quantity;
      } else {
        mergedCart.push(item);
      }
    });
    user.cart = mergedCart;

    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId && item.selectedSize.trim().toLowerCase() === normalizedSize
    );

    if (itemIndex === -1) return res.status(404).json({ message: "Item not found in cart" });

    if (user.cart[itemIndex].quantity > 1) {
      user.cart[itemIndex].quantity -= 1;
    } else {
      user.cart.splice(itemIndex, 1);
    }

    await user.save();
    res.status(200).json({ message: "Quantity updated", cart: user.cart });

  } catch (error) {
    console.error("SUBTRACT FROM CART ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 📦 GET USER CART
 */
export const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("cart.product");
    res.status(200).json(user.cart || []);
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ❌ REMOVE FROM CART
 * params: productId, size
 */
export const removeFromCart = async (req, res) => {
  try {
    let { productId, size } = req.params;
    if (!productId || !size) return res.status(400).json({ message: "Product and size required" });

    size = decodeURIComponent(size).trim();
    const normalizedSize = size.toLowerCase();

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Normalize legacy items
    user.cart = user.cart.map(item => ({
      ...item.toObject?.() || item,
      selectedSize: item.selectedSize || size
    }));

    user.cart = user.cart.filter(
      item => !(item.product.toString() === productId && item.selectedSize.trim().toLowerCase() === normalizedSize)
    );

    await user.save();
    res.status(200).json({ message: "Removed", cart: user.cart });

  } catch (error) {
    console.error("REMOVE FROM CART ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
