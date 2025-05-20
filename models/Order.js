
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User'
//   },
//   products: [
//     {
//       productId: String,
//       productName: String,
//       productPrice: Number,
//       quantity: Number,
//       productImage: String
//     }
//   ],
//   totalAmount: Number,
//   paymentMode: {
//     type: String,
//     default: 'Cash on Delivery'
//   },
//   paymentStatus: {
//     type: String,
//     default: 'Pending' // Will be marked as 'Paid' after delivery
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  products: [
    {
      productId: String,
      productName: String,
      productPrice: Number,
      quantity: Number,
      productImage: String
    }
  ],
  totalAmount: Number,
  paymentMode: {
    type: String,
    default: 'Cash on Delivery'
  },
  paymentStatus: {
    type: String,
    default: 'Pending' // Will be marked as 'Paid' after delivery
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      reviewText: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('Order', orderSchema);
