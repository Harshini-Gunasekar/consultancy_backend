// const Product = require('../models/productModel');
// const asyncHandler = require('express-async-handler');
// const slugify = require('slugify');
// // CREATE PRODUCT

// const createProduct = asyncHandler(async (req, res) => {
//     try {
//         // Destructure fields from the request body
//         const { name, category, price, quantity } = req.body;
        
//         // Check if required fields are present
//         if (!name || !category || !price || !quantity) {
//             return res.status(400).json({ success: false, message: "All fields are required" });
//         }

//         // Log the uploaded file to check if it is getting passed
//         console.log('Uploaded file:', req.file);

//         // Create a new product instance
//         const newProduct = new Product({
//             name,
//             category,
//             price: parseFloat(price),
//             quantity: parseInt(quantity),
//             // Save the image URL (if a file was uploaded)
//             imageUrl: req.file ? `/uploads/${req.file.filename}` : null, // Ensure it matches your model
//             // Generate a unique slug from the product name
//             slug: req.file ? slugify(name, { lower: true }) : null
//         });

//         // Save the product to the database
//         const savedProduct = await newProduct.save();
        
//         // Send success response
//         res.status(201).json({ success: true, product: savedProduct });
//     } catch (error) {
//         // Log and send error response
//         console.error('Error creating product:', error.message);
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // GET ALL PRODUCTS
// const getAllProduct = asyncHandler(async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// // GET SINGLE PRODUCT
// const getaProduct = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     try {
//         const product = await Product.findById(id);
//         res.json(product);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// // UPDATE PRODUCT
// const updateProduct = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
//         res.json(updatedProduct);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// // DELETE PRODUCT
// const deleteProduct = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     try {
//         const deletedProduct = await Product.findByIdAndDelete(id);
//         res.json(deletedProduct);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// module.exports = { createProduct, getAllProduct, getaProduct, updateProduct, deleteProduct };
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;

        if (!name || !category || !price || !quantity) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Log the uploaded file to check if it is getting passed
        console.log('Uploaded file:', req.file);

        const newProduct = new Product({
            name,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
            slug: req.file ? slugify(name, { lower: true }) : slugify(name, { lower: true })
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({ success: true, product: savedProduct });
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET ALL PRODUCTS
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        throw new Error(error);
    }
});

// GET SINGLE PRODUCT
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

// UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Delete old image if a new one is uploaded
        if (req.file) {
            const imagePath = path.join(__dirname, '..', product.imageUrl.replace(/^\/+/, ''));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            product.imageUrl = `/uploads/${req.file.filename}`;
        }

        // Update slug only if name has changed
        if (name && name !== product.name) {
            product.slug = slugify(name, { lower: true });
        }

        // Update product fields with correct type handling
        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price !== undefined ? parseFloat(price) : product.price;
        product.quantity = quantity !== undefined ? parseInt(quantity) : product.quantity;

        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error); // log full error for better debugging
        res.status(500).json({ success: false, message: error.message });
    }
});


// DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Optionally, remove the image file associated with the product
        if (product.imageUrl) {
            const imagePath = path.join(__dirname, `../uploads/${product.imageUrl}`);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the image from the server
            }
        }

        // Delete product from the database
        await Product.findByIdAndDelete(id);

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = { createProduct, getAllProduct, getaProduct, updateProduct, deleteProduct };
