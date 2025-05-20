
// const express = require("express");
// const router = express.Router();
// const { placeOrder, getOrdersByUser, getAllOrders } = require("../controller/orderCtrl");
// const Order = require("../models/Order.js"); // Make sure this import exists

// // Admin - Get all orders
// router.get("/admin/all", getAllOrders);

// // Route to place a new order
// router.post("/place", placeOrder);

// // Route to get all orders for a user (optional, for order history)
// router.get("/:userId", getOrdersByUser);

// // Admin - Mark Order as Paid
// router.patch("/mark-paid/:orderId", async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     // Find and update the order's payment status to "Paid"
//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { paymentStatus: "Paid" },
//       { new: true } // Return the updated order object
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json({ message: "Order marked as paid", order: updatedOrder });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to mark order as paid", error });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const { placeOrder, getOrdersByUser, getAllOrders, markAsPaid, addReview, getReviewsByOrder } = require("../controller/orderCtrl");
const Order = require("../models/Order.js"); // Make sure this import exists

// Admin - Get all orders
router.get("/admin/all", getAllOrders);

// Route to place a new order
router.post("/place", placeOrder);

// Route to get all orders for a user (optional, for order history)
router.get("/:userId", getOrdersByUser);

// Admin - Mark Order as Paid
router.patch("/mark-paid/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find and update the order's payment status to "Paid"
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "Paid" },
      { new: true } // Return the updated order object
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order marked as paid", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark order as paid", error });
  }
});

// Route to add a review to an order
router.post("/:orderId/review", addReview);

// Route to get all reviews for a specific order
router.get("/:orderId/review", getReviewsByOrder);

module.exports = router;
