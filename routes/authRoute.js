const express = require("express");
const {
  createUser,
  loginUserCtrl,
  handleRefreshToken,
  logout,
  updatedUser,
  getallUser,
  getaUser,
  deleteaUser,
  blockUser,
  unblockUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  getUser,
  updateProfile,
  addToCart,
  getCart,
  removeFromCart,
  addAddress,          // New - Add Address
    updateAddress,       // New - Update Address
    getAllAddresses,     // New - Get All Addresses
    deleteAddress 

} = require("../controller/UserCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", createUser);
router.post("/forgot-password-token",forgotPasswordToken);
router.put("/reset-password/:token",resetPassword);

router.put("/password",authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);




router.use("/admin", authMiddleware, isAdmin);  // Admin routes
router.get('admin/all-users', getallUser);
router.get('/all-users', getallUser); 
router.get('/refresh', handleRefreshToken);
router.get('/me', authMiddleware, getUser);
router.put('/update-profile', authMiddleware, updateProfile);
router.post('/logout', logout);
router.get('/:id', authMiddleware, isAdmin, getaUser);
router.delete('/:id', authMiddleware, isAdmin, deleteaUser);

router.put('/edit-user', authMiddleware, updatedUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
router.post("/address", authMiddleware, addAddress);                // Add new address
router.put("/address", authMiddleware, updateAddress);              // Update address
router.get("/addresses", authMiddleware, getAllAddresses);          // Get all addresses
router.delete("/address/:addressId", authMiddleware, deleteAddress); // Delete address

module.exports = router;
