const express = require("express");
const router = express.Router();
const { addToCart, getCart, removeFromCart, clearCart } = require("../controller/cartCtrl");

router.post("/add", addToCart);                  // Add to cart
router.get("/:userId", getCart);                 // Get cart for user
router.post('/remove', removeFromCart);

 // Remove product from cart
router.delete("/clear/:userId", clearCart);      // Clear cart

module.exports = router;
