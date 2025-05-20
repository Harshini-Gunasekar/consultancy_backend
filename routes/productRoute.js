// const express = require('express');
// const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct } = require('../controller/productCtrl');
// const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
// const router = express.Router();

// router.post('/',  createProduct);
// router.get('/:id', getaProduct);
// router.get('/', getAllProduct);
// router.put('/:id', authMiddleware, isAdmin, updateProduct);
// router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

// module.exports = router;
// const express = require('express');
// const { createProduct, getAllProduct, getaProduct, updateProduct, deleteProduct } = require('../controller/productCtrl');
// const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
// const router = express.Router();

// router.post('/', authMiddleware, isAdmin, createProduct);
// router.get('/', getAllProduct);
// router.get('/:id', getaProduct);
// router.put('/:id', authMiddleware, isAdmin, updateProduct);
// router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

// module.exports = router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct } = require('../controller/productCtrl');
const upload = require('../middlewares/uploadMulter');
// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // The directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique file names
  }
});



// Set up routes
const router = express.Router();

router.post('/', upload.single('image'), createProduct);  // 'image' is the name of the field in the form

router.get('/:id', getaProduct);
router.get('/', getAllProduct);
router.put('/:id', upload.single('image'), updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;
