const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
// const Admin = require("../models/AdminSchema");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

// ✅ Place an order
// ✅ Place an order
router.post("/place-order", async (req, res) => {
  try {
    const { cart } = req.body;
    // console.log("Received Cart Data:", cart);

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orders = cart.map(({ userId, restaurantId, items }) => {
      const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        userId,
        restaurantId,
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          section: item.section,
        })),
        totalPrice, 
      };
    });

    // console.log("Final Order Structure:", orders);

    // Insert each order into the database
    await Order.insertMany(orders.map(order => ({
      userId: order.userId,
      restaurantId: order.restaurantId,
      items: order.items,
      totalPrice: order.totalPrice,
    })));

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Get orders for a specific admin's restaurant
router.get("/admin/:adminId/orders", async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Invalid Admin ID" });
    }

    // ✅ Find the restaurant linked to the admin
    const restaurant = await Restaurant.findOne({ adminId });
    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found for this admin" });
    }

    const restaurantId = restaurant._id;

    // ✅ Fetch all orders for the restaurant
    const orders = await Order.find({ restaurantId })
      .populate("userId", "name email") // Populate user details
      .populate("restaurantId", "restaurantName"); // Optional: Populate restaurant details

    res.status(200).json(orders);
    // console.log("Orders:", orders);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders for a specific user and categorize them
router.get("/user/:userId/orders", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user orders
    const orders = await Order.find({ userId }).populate("restaurantId", "restaurantName");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    // Categorize orders into live and past
    const liveOrders = orders.filter(
      (order) => order.status !== "Delivered" && order.status !== "Cancelled"
    );
    const pastOrders = orders.filter(
      (order) => order.status === "Delivered" || order.status === "Cancelled"
    );

    res.status(200).json({ liveOrders, pastOrders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error while fetching orders." });
  }
});

// ✅ Update order status from admin
router.put("/admin/orders/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, restaurantId, deliveryBoy, deliveryTime } = req.body;

    const order = await Order.findOne({ _id: orderId, restaurantId });

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    order.status = status;
    order.deliveryBoy = deliveryBoy;

    if (deliveryTime !== undefined) {
      order.deliveryTime = deliveryTime;
    }
    await order.save();

    res.json({ message: "Order status updated successfully!", order });
  } catch (error) {
    res.status(500).json({ message: "Server error while updating status!" });
  }
});


// ✅ Update order status from user
router.put("/orders/:orderId/cancel", async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Find the order and check if it's still pending
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled." });
    }

    // Update order status to "Cancelled"
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Server error while cancelling order." });
  }
});


module.exports = router;
