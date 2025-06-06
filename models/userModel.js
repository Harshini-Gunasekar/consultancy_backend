// const mongoose = require('mongoose'); // Erase if already required
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// // Declare the Schema of the Mongo model

// var userSchema = new mongoose.Schema({
//     firstname: {
//         type: String,
//         required: true,
//     },
//     lastname: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     mobile: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     role: {
//         type: String,
//         default: "user",
//     },
//     isBlocked: {
//         type: Boolean,
//         default: false,
//     },
    
//     refreshToken: {
//         type: String,
//     },
//     passwordChangesAt: Date,
//     passwordResetToken: String,
//     passwordResetExpires: Date,
// },
//     {
//         timestamps: true,
//     }
// );

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     const salt = bcrypt.genSaltSync(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// userSchema.methods.isPasswordMatched = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// }

// userSchema.methods.createPasswordResetToken = async function () {
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     this.passwordResetToken = crypto
//         .createHash('sha256')
//         .update(resetToken)
//         .digest('hex');
//     this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10mins
//     return resetToken;
// };

// //Export the model
// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const crypto = require('crypto');

var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    address: [{
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["Home", "Office", "Other"],
            default: "Home",
        },
    }],
    refreshToken: {
        type: String,
    },
    passwordChangesAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
{
    timestamps: true,
});

// Password hashing before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password comparison
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate password reset token
userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 mins
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
