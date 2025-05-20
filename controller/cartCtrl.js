const Cart = require("../models/cartModel");

// Create a new cart or add to existing
const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
      res.status(200).json(cart);
    } else {
      const newCart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });

      await newCart.save();
      res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// Get cart by user ID
// Get cart by user ID
const getCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId })
        .populate('products.productId'); // Populate the product details (including price and image)
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Populate product details from the product model
      const populatedCart = cart.products.map((item) => {
        const product = item.productId;
        return {
          productId: product._id,
          productName: product.name,
          productPrice: product.price,
          productImage: product.imageUrl, // Now includes the imageUrl
          quantity: item.quantity,
        };
      });
  
      res.json({ products: populatedCart });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching cart data', error: err });
    }
  };
  
// Remove item from cart
const removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (cart) {
        // Ensure proper comparison, converting ObjectId to string
        cart.products = cart.products.filter(
          (item) => item.productId.toString() !== productId.toString()
        );
  
        // Save the updated cart
        await cart.save();
  
        // Populate the updated cart with product details
        const populatedCart = await Cart.findOne({ userId }).populate('products.productId');
  
        const response = populatedCart.products.map((item) => {
          const product = item.productId;
          return {
            productId: product._id,
            productName: product.name,
            productPrice: product.price,
            productImage: product.imageUrl,
            quantity: item.quantity,
          };
        });
  
        res.status(200).json({ products: response });
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error removing item", error });
    }
  };
  
  
  // Clear entire cart
  const clearCart = async (req, res) => {
    const userId = req.params.userId;
    try {
      const cart = await Cart.findOneAndDelete({ userId });
      res.status(200).json({ message: "Cart cleared", cart });
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart", error });
    }
  };
module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
};
