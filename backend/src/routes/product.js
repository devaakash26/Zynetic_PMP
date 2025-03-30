const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { authMiddleware, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Get all products (public route)
router.get('/', productController.getProducts);

// Get product by ID (public route)
router.get('/:id', (req, res, next) => {
  console.log('Product ID requested:', req.params.id);
  next();
}, productController.getProductById);

// Protected routes (require authentication)
router.use(authMiddleware);

// Create product (upload.single middleware for image upload)
router.post('/', upload.single('image'), productController.createProduct);

// Update product
router.put('/:id', upload.single('image'), productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router; 