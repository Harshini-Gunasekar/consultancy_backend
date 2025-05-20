// // controllers/orderCtrl.js
// const Order = require("../models/Order");
// const Cart = require("../models/Cart");

// const placeOrder = async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const cart = await Cart.findOne({ userId }).populate('products.productId');
//     if (!cart || cart.products.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const totalAmount = cart.products.reduce((total, item) => {
//       return total + item.productId.price * item.quantity;
//     }, 0);

//     const newOrder = new Order({
//       userId,
//       products: cart.products.map((item) => ({
//         productId: item.productId._id,
//         quantity: item.quantity,
//       })),
//       totalAmount,
//       paymentStatus: "Pending",
//     });

//     await newOrder.save();
//     await Cart.deleteOne({ userId }); // clear cart

//     res.status(201).json({ message: "Order placed", order: newOrder });
//   } catch (error) {
//     res.status(500).json({ message: "Order placement failed", error });
//   }
// };

// module.exports = { placeOrder };
// const Order = require("../models/Order.js");
// const Cart = require("../models/cartModel.js");

// const placeOrder = async (req, res) => {
//     const { userId } = req.body;
  
//     try {
//       const cart = await Cart.findOne({ userId }).populate("products.productId");
//       if (!cart || cart.products.length === 0) {
//         return res.status(400).json({ message: "Cart is empty" });
//       }
  
//       const totalAmount = cart.products.reduce((total, item) => {
//         return total + item.productId.price * item.quantity;
//       }, 0);
  
//       const newOrder = new Order({
//         userId,
//         products: cart.products.map((item) => ({
//           productId: item.productId._id,
//           productName: item.productId.name,
//           productPrice: item.productId.price,
//           productImage: item.productId.imageUrl, // update based on your actual schema
//           quantity: item.quantity,
//         })),
//         totalAmount,
//       });
  
//       await newOrder.save();
//       await Cart.deleteOne({ userId }); // Clear cart
  
//       res.status(201).json({ message: "Order placed successfully", order: newOrder });
//     } catch (error) {
//       res.status(500).json({ message: "Order placement failed", error });
//     }
//   };
  
// // ✅ New function to get all orders for a specific user
// const getOrdersByUser = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const orders = await Order.find({ userId })
//       .populate("products.productId")
//       .sort({ createdAt: -1 });

//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch orders", error });
//   }
// };

// // ✅ New: Admin - Get all orders
// // Get all orders (Admin only)
// const getAllOrders = async (req, res) => {
//     try {
//       const orders = await Order.find().sort({ createdAt: -1 });
//       res.status(200).json(orders);
//     } catch (error) {
//       res.status(500).json({ message: "Failed to fetch all orders", error });
//     }
//   };
  
//   module.exports = {
//     placeOrder,
//     getOrdersByUser,
//     getAllOrders, // ⬅️ export this
//   };
  
const Order = require("../models/Order.js");
const Cart = require("../models/cartModel.js");

// Place Order (COD)
const placeOrder = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.products.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    const newOrder = new Order({
      userId,
      products: cart.products.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.name,
        productPrice: item.productId.price,
        productImage: item.productId.imageUrl,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentMode: "Cash on Delivery",   // COD mode
      paymentStatus: "Pending"           // Will update to "Paid" after delivery
    });

    await newOrder.save();
    await Cart.deleteOne({ userId }); // Clear cart after placing order

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Order placement failed", error });
  }
};

// Get orders by user
const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// Admin - Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders", error });
  }
};

// Admin - Mark Order as Paid
const markAsPaid = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find and update the order's payment status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'Paid' },
      { new: true } // Return the updated order object
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Optionally, you can send a notification to the user (email, SMS, etc.) about the status update.

    res.status(200).json({ message: "Order marked as paid", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment status", error });
  }
};

const addReview = async (req, res) => {
  const { orderId } = req.params;
  const { userId, reviewText, rating } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create the review object
    const review = {
      userId,
      reviewText,
      rating
    };

    // Add the review to the order's reviews array
    order.reviews.push(review);
    await order.save();

    res.status(201).json({ message: "Review added successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error });
  }
};

// Get all reviews for a specific order (Admin or User)
const getReviewsByOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('reviews.userId', 'name');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order.reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};


module.exports = {
  placeOrder,
  getOrdersByUser,
  getAllOrders,
  markAsPaid,
  addReview,          // New function for adding review
  getReviewsByOrder   // New function for getting reviews
};