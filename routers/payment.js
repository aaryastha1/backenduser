import express from "express";
import crypto from "crypto";
import Order from "../models/Order.js";
import authMiddleware from "../middlewares/auth.js"; // ✅ ADDED

const router = express.Router();

// Helper to generate eSewa Signature
const generateSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q"; // DO NOT add spaces here
  return crypto.createHmac("sha256", secret).update(message).digest("base64");
};

router.post("/esewa/initiate", authMiddleware, async (req, res) => { // ✅ ADDED
  try {
    const {
      total,
      subtotal,
      shipping,
      items,
      firstName,
      lastName,
      address,
      phone,
      email,
      scheduleDate,
      scheduleTime,
    } = req.body;

   const orderItems = items.map((item) => ({
  productId: item.item?._id || item.productId || item._id, 
  itemType: item.itemType || "Product",
  name: item.item?.name || item.name || "Unknown Product", 
  image: item.image || item.item?.image || "", // Saves the path string
  price: item.price,
  quantity: item.quantity,
  size: item.selectedSize || item.size || null,
  notes: item.notes || "" // Capture notes if passed from cart
}));

    // 1. Create Order in DB
    const order = await Order.create({
      user: req.userId, // ✅ NOW THIS WORKS
      items: orderItems,
      amount: subtotal,
      shipping,
      total,
      paymentMethod: "ESEWA",
      paymentStatus: "PENDING",
      firstName,
      lastName,
      address,
      phone,
      email,
      scheduleDate,
      scheduleTime,
    });

    // 2. Format Data for eSewa (Strict 2 decimal places)
    const transaction_uuid = order._id.toString();
    const product_code = "EPAYTEST";

    // eSewa Math: total_amount = amount + tax + service + delivery
    const amt = Number(subtotal).toFixed(2);
    const tax = "0.00";
    const service = "0.00";
    const delivery = Number(shipping).toFixed(2);
    const total_amt = (
      Number(amt) +
      Number(tax) +
      Number(service) +
      Number(delivery)
    ).toFixed(2);

    // 3. Generate Signature Message (NO SPACES after commas)
    const signatureMessage = `total_amount=${total_amt},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = generateSignature(signatureMessage);

    const esewaFormData = {
      amount: amt,
      failure_url: "http://localhost:5173/payment-failed",
      product_delivery_charge: delivery,
      product_service_charge: service,
      product_code: product_code,
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: "http://localhost:5006/api/payment/esewa/success",
      tax_amount: tax,
      total_amount: total_amt,
      transaction_uuid: transaction_uuid,
    };

    console.log("DEBUG - Message:", signatureMessage);
    console.log("DEBUG - Signature:", signature);

    return res.json({ esewaFormData });
  } catch (error) {
    console.error("eSewa initiate error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// SUCCESS CALLBACK
router.get("/esewa/success", async (req, res) => {
  try {
    const { data } = req.query;
    const decodedString = Buffer.from(data, "base64").toString("utf-8");
    const decodedData = JSON.parse(decodedString);

    if (decodedData.status === "COMPLETE") {
      await Order.findByIdAndUpdate(decodedData.transaction_uuid, {
        paymentStatus: "PAID",
        esewaRefId: decodedData.transaction_code,
      });
      return res.redirect("http://localhost:5173/payment-success");
    }

    res.redirect("http://localhost:5173/payment-failed");
  } catch (err) {
    res.redirect("http://localhost:5173/payment-failed");
  }
});

export default router;
