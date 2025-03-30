const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { authMiddleware, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Get all products (public route)
router.get('/', productController.getProducts);

// Get product by ID (public route)
router.get('/:id', productController.getProductById);

// Protected routes (require authentication)
router.use(authMiddleware);

// Upload image only endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('Cloudinary upload response file:', JSON.stringify(req.file, null, 2));
    
    // Return the Cloudinary URL
    const imageUrl = req.file.path || req.file.secure_url || req.file.url || `/uploads/${req.file.filename}`;
    
    console.log('Image URL being returned:', imageUrl);
    
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// Create product (upload.single middleware for image upload)
router.post('/', upload.single('image'), productController.createProduct);

// Update product
router.put('/:id', upload.single('image'), productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router; 