// const { generateToken } = require("../config/jwtToken");
// const User = require("../models/userModel");
// const asyncHandler = require("express-async-handler");
// const validateMongoDbId = require("../utils/validateMongodbId");
// const { generaterefreshToken } = require("../config/refreshToken");
// const crypto = require("crypto");
// const jwt = require("jsonwebtoken");
// // const sendEmail = require("./emailCtrl");
// const { json } = require("body-parser");

// const createUser = asyncHandler(async (req, res) => {
//     const email = req.body.email;
//     const findUser = await User.findOne({ email: email });
//     if (!findUser) {
//         // Create a new user
//         const newUser = await User.create(req.body);
//         res.json(newUser);
//     }
//     else {
//         throw new Error("User Already Exists");
//     }
// });

// const loginUserCtrl = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     // check if the user exists or not
//     const findUser = await User.findOne({ email });
//     if (findUser && await findUser.isPasswordMatched(password)) {
//         const refreshToken = await generaterefreshToken(findUser?._id);
//         const updateuser = await User.findByIdAndUpdate(
//             findUser.id,
//             {
//                 refreshToken: refreshToken,
//             },
//             {
//                 new: true
//             });
//         res.cookie("refreshToken", refreshToken, {
//             httpOnly: true,
//             maxAge: 72 * 60 * 60 * 1000,
//         });

//         const accessToken = generateToken(findUser._id);

//         res.cookie("token", accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: "Lax",
//             maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
//         });

//         res.json({
//             success: true,
//             token: generateToken(findUser._id),
//             user: {
//                 _id: findUser._id,
//                 firstname: findUser.firstname,
//                 lastname: findUser.lastname,
//                 email: findUser.email,
//                 mobile: findUser.mobile,
//                 role: findUser.role
//             }
//         });

//     } else {
//         throw new Error("Invalid Credentials");
//     }
// });

// //handle refresh token
// const handleRefreshToken = asyncHandler(async (req, res) => {
//     const cookie = req.cookies;
//     if (!cookie?.refreshToken) throw new Error("No Refresh token in cookies");
//     const refreshToken = cookie.refreshToken;
//     const user = await User.findOne({ refreshToken });
//     if (!user) throw new Error("No Refresh present in db or not matched");
//     jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
//         if (err || user.id !== decoded.id) {
//             throw new Error("There is something wrong with refresh token");
//         }
//         const accessToken = generateToken(user?._id)
//         res.json({ accessToken });
//     });
// });



// const logout = asyncHandler(async (req, res) => {
//     const refreshToken = req.cookies?.refreshToken;


//     res.clearCookie("refreshToken", {
//         httpOnly: true,
//         secure: true,
//         sameSite: "strict",
//     });

//     res.clearCookie("token", {
//         httpOnly: true,
//         secure: true,
//         sameSite: "strict",
//     });

//     if (!refreshToken) {
//         return res.sendStatus(204);
//     }

//     const user = await User.findOne({ refreshToken });
//     if (!user) {
//         return res.sendStatus(204);
//     }

//     await User.findOneAndUpdate({ refreshToken }, {
//         refreshToken: "",
//     });

//     return res.sendStatus(204);
// });


// //update a user
// const updatedUser = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     validateMongoDbId(_id);
//     try {
//         const updatedUser = await User.findByIdAndUpdate(
//             _id,
//             {
//                 firstname: req?.body?.firstname,
//                 lastname: req?.body?.lastname,
//                 email: req?.body?.email,
//                 mobile: req?.body?.mobile,
//             },
//             {
//                 new: true,
//             }
//         );
//         res.json(updatedUser);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// //Get all the users
// const getallUser = asyncHandler(async (req, res) => {
//     try {
//         const getUsers = await User.find();
//         res.json(getUsers);
//     }
//     catch (error) {
//         throw new Error(error);
//     }
// });

// //Get a single user
// const getaUser = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     validateMongoDbId(id);
//     try {
//         const getaUser = await User.findById(id);
//         res.json({
//             getaUser,
//         })
//     } catch (error) {
//         throw new Error(error);
//     }
// });


// const addToCart = asyncHandler(async (req, res) => {
//     const { productId, quantity } = req.body;
//     const userId = req.user?._id;
  
//     if (!productId || !quantity) {
//       return res.status(400).json({ message: "Product ID and quantity are required" });
//     }
  
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
  
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
  
//     const existingItemIndex = user.cart.findIndex(
//       (item) => item.product.toString() === productId
//     );
  
//     if (existingItemIndex > -1) {
//       user.cart[existingItemIndex].quantity += quantity;
//     } else {
//       user.cart.push({
//         product: productId,
//         quantity,
//         price: product.price,
//       });
//     }
  
//     await user.save();
//     return res.status(200).json({ message: "Product added to cart", cart: user.cart });
//   });
  
//   // 🛒 GET CART
//   const getCart = asyncHandler(async (req, res) => {
//     const userId = req.user?._id;
  
//     const user = await User.findById(userId).populate('cart.product');
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
  
//     return res.status(200).json({ cart: user.cart });
//   });
  
//   // ❌ REMOVE FROM CART
//   const removeFromCart = asyncHandler(async (req, res) => {
//     const { productId } = req.body;
//     const userId = req.user?._id;
  
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
  
//     const newCart = user.cart.filter(
//       (item) => item.product.toString() !== productId
//     );
//     user.cart = newCart;
//     await user.save();
  
//     return res.status(200).json({ message: "Product removed from cart", cart: user.cart });
//   });
  
//   module.exports = {
//     addToCart,
//     getCart,
//     removeFromCart,
//   };
// //delete a user
// const deleteaUser = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     validateMongoDbId(id);
//     try {
//         const deleteaUser = await User.findByIdAndDelete(id);
//         res.json({
//             deleteaUser,
//         })
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const blockUser = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     validateMongoDbId(id);
//     try {
//         const block = await User.findByIdAndUpdate(
//             id,
//             {
//                 isBlocked: true,
//             },
//             {
//                 new: true,
//             });
//         res.json({
//             message: "User Blocked",
//         });
//     } catch (error) {
//         throw new Error(error);
//     }
// });
// const unblockUser = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     validateMongoDbId(id);
//     try {
//         const unblock = await User.findByIdAndUpdate(id, {
//             isBlocked: false,
//         },
//             {
//                 new: true,
//             });
//         res.json({
//             message: "User Unblocked",
//         });
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const updatePassword = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     const { password } = req.body;
//     validateMongoDbId(_id);
//     const user = await User.findById(_id);
//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }
//     if (password) {
//         user.password = password;
//         const updatedPassword = await user.save();
//         res.json(updatedPassword);
//     } else {
//         res.json(user);
//     }
// })

// const forgotPasswordToken = asyncHandler(async (req, res) => {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) throw new Error("User Not found with this email");
//     try {
//         const token = await user.createPasswordResetToken();
//         await user.save();
//         const resetURL = `Hi, Please follow this link to reset your password. This is valid for 10 minutes from now. <a href = 'http://localhost:5000/api/user/reset-password/${token}' > Click Here </a>`
//         const data = {
//             to: email,
//             text: "Hey User",
//             subject: "Forgot Password Link",
//             html: resetURL,
//         };
//         sendEmail(data);
//         res.json(token);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const resetPassword = asyncHandler(async (req, res) => {
//     const { password } = req.body;
//     const { token } = req.params;
//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
//     const user = await User.findOne({
//         passwordResetToken: hashedToken,
//         passwordResetExpires: { $gt: Date.now() },
//     });
//     if (!user) throw new Error("Token expired, please again later");
//     user.password = password;
//     user.passwordResetToken = undefined,
//         user.passwordResetExpires = undefined;
//     await user.save();
//     res.json(user);
// });

// const getUser = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     validateMongoDbId(_id);
//     try {
//         const user = await User.findById(_id);
//         res.json(user);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const updateProfile = async (req, res) => {
//     try {
//         const { firstname, lastname, mobile } = req.body;

//         const updatedUser = await User.findByIdAndUpdate(
//             req.user._id,
//             {
//                 firstname,
//                 lastname,
//                 mobile
//             },
//             { new: true, runValidators: true }
//         ).select('-password');

//         if (!updatedUser) return res.status(404).json({ message: 'User not found' });

//         res.status(200).json({
//             message: 'Profile updated successfully',
//             user: updatedUser
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating profile', error });
//     }
// };


// module.exports = {
//     createUser,
//     loginUserCtrl,
//     handleRefreshToken,
//     logout,
//     updatedUser,
//     getallUser,
//     getaUser,
//     deleteaUser,
//     blockUser,
//     unblockUser,
//     updatePassword,
//     forgotPasswordToken,
//     resetPassword,
//     getUser,
//     updateProfile,
//     addToCart,
//     getCart,
//     removeFromCart
// };

const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generaterefreshToken } = require("../config/refreshToken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
// const sendEmail = require("./emailCtrl");

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User Already Exists");
    }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generaterefreshToken(findUser._id);
        await User.findByIdAndUpdate(findUser.id, { refreshToken }, { new: true });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        const accessToken = generateToken(findUser._id);
        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Lax",
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            token: accessToken,
            user: {
                _id: findUser._id,
                firstname: findUser.firstname,
                lastname: findUser.lastname,
                email: findUser.email,
                mobile: findUser.mobile,
                role: findUser.role
            }
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh present in db or not matched");

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("Invalid refresh token");
        }
        const accessToken = generateToken(user._id);
        res.json({ accessToken });
    });
});

const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    if (!refreshToken) return res.sendStatus(204);

    const user = await User.findOne({ refreshToken });
    if (!user) return res.sendStatus(204);

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    return res.sendStatus(204);
});

const updatedUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobile: req.body.mobile,
            },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const user = await User.findById(id);
        res.json({ user });
    } catch (error) {
        throw new Error(error);
    }
});

const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json({ deletedUser });
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        res.json({ message: "User Blocked" });
    } catch (error) {
        throw new Error(error);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        res.json({ message: "User Unblocked" });
    } catch (error) {
        throw new Error(error);
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User Not found with this email");

    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This is valid for 10 minutes. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetURL,
        };
        // sendEmail(data); // Uncomment after setting up email utility
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token expired, please try again later");

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const getUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findById(_id);
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});
const addAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { street, city, state, pincode, country, type } = req.body;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $push: { address: { street, city, state, pincode, country, type } } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

// Update an Existing Address
const updateAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { addressId, street, city, state, pincode, country, type } = req.body;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id, "address._id": addressId },
            {
                $set: {
                    "address.$.street": street,
                    "address.$.city": city,
                    "address.$.state": state,
                    "address.$.pincode": pincode,
                    "address.$.country": country,
                    "address.$.type": type,
                },
            },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

// Get All Addresses of a User
const getAllAddresses = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findById(_id);
        if (user) {
            res.json(user.address);
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        throw new Error(error);
    }
});

// Delete an Address by ID
const deleteAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { addressId } = req.params;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $pull: { address: { _id: addressId } } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProfile = asyncHandler(async (req, res) => {
    const { firstname, lastname, mobile } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { firstname, lastname, mobile },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    addAddress,
    updateAddress,
    getAllAddresses,
    deleteAddress,
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
};
