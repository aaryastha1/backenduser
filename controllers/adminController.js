import Order from "../models/Order.js";
import Product from "../models/admin/product.js";
import User from "../models/User.js";
import Bakery from "../models/admin/bakery.js";

export const getDashboardStats = async (req, res) => {
  try {
    const allOrders = await Order.find();
    
    // 1. Revenue: Only from orders where eSewa paymentStatus is "PAID"
    const totalRevenue = allOrders
      .filter(order => order.paymentStatus === 'PAID')
      .reduce((sum, order) => sum + (order.total || 0), 0);

    // 2. Count metrics
    const totalOrdersCount = await Order.countDocuments();
    const totalProductsCount = await Product.countDocuments();
    const totalCustomersCount = await User.countDocuments({ role: { $ne: "admin" } });
    const totalBakeriesCount = await Bakery.countDocuments();

    // 3. Count Pending eSewa Payments
    const pendingPaymentsCount = await Order.countDocuments({ 
      paymentStatus: "PENDING" 
    });

    // 4. Get Recent Orders for the table
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: totalOrdersCount,
        totalProducts: totalProductsCount,
        totalCustomers: totalCustomersCount,
        totalBakeries: totalBakeriesCount,
        pendingOrders: pendingPaymentsCount, // Matches your "PENDING" card
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};