// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     category: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true
//     },
//     imageUrl: {
//         type: String,
//         required: false
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);
// const mongoose = require('mongoose');
// const slugify = require('slugify');  // Import slugify for generating slugs

// const productSchema = new mongoose.Schema({
//     category: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true
//     },
//     imageUrl: {
//         type: String,
//         required: false
//     },
//     slug: {
//         type: String,
//         unique: true,  // Ensure the slug is unique
//         required: true
//     }
// }, { timestamps: true });

// // Pre-save hook to generate the slug before saving the product
// productSchema.pre('save', function(next) {
//     if (this.name) {
//         // Generate slug from product name
//         let generatedSlug = slugify(this.name, { lower: true, strict: true });
        
//         // Check for existing slug conflict, if it exists, modify it
//         mongoose.models.Product.findOne({ slug: generatedSlug })
//             .then(existingProduct => {
//                 if (existingProduct) {
//                     generatedSlug = `${generatedSlug}-${Date.now()}`;  // Adding unique suffix
//                 }
//                 this.slug = generatedSlug;
//                 next();
//             })
//             .catch(error => {
//                 console.error('Error checking slug uniqueness:', error);
//                 next(error);
//             });
//     } else {
//         next();
//     }
// });

// module.exports = mongoose.model('Product', productSchema);
// const mongoose = require('mongoose');
// const slugify = require('slugify');  // Import slugify for generating slugs

// const productSchema = new mongoose.Schema({
//     category: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true
//     },
//     imageUrl: {
//         type: String, // Optional image URL for the product
//         required: false
//     },
//     slug: {
//         type: String,
//         unique: true,  // Ensure the slug is unique
//         required: true
//     }
// }, { timestamps: true });

// // Pre-save hook to generate the slug before saving the product
// productSchema.pre('save', function(next) {
//     if (this.name) {
//         // Generate slug from product name
//         let generatedSlug = slugify(this.name, { lower: true, strict: true });

//         mongoose.models.Product.findOne({ slug: generatedSlug })
//             .then(existingProduct => {
//                 if (existingProduct) {
//                     generatedSlug = `${generatedSlug}-${Date.now()}`;  // Adding unique suffix
//                 }
//                 this.slug = generatedSlug;
//                 next();
//             })
//             .catch(error => {
//                 console.error('Error checking slug uniqueness:', error);
//                 next(error);
//             });
//     } else {
//         next();
//     }
// });

// module.exports = mongoose.model('Product', productSchema);
// const mongoose = require('mongoose');

// const productSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     price: { type: Number, required: true },
//     quantity: { type: Number, required: true },
//     imageUrl: { type: String }, // Store the image URL or file path
//     slug: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;
const mongoose = require('mongoose');
const slugify = require('slugify');  // Import slugify for generating slugs

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    slug: {
        type: String,
        unique: true,  // Ensure the slug is unique
        required: true
    }
}, { timestamps: true });

// Middleware to generate slug before saving the product
productSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
