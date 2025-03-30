const Product = require('../../models/Product');
const User = require('../../models/User');
const mongoose = require('mongoose');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, rating, imageUrl: imageUrlFromBody } = req.body;
    const userId = req.user.id;

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      // Use only the Cloudinary URL directly without any fallbacks
      imageUrl = req.file.path;
      console.log('Creating product with Cloudinary image URL from file:', imageUrl);
    } else if (imageUrlFromBody) {
      // Use imageUrl from request body if no file was uploaded but URL was provided
      imageUrl = imageUrlFromBody;
      console.log('Creating product with Cloudinary image URL from body:', imageUrl);
    }

    console.log('Creating new product with data:', {
      name, description, category, price, rating, imageUrl, userId
    });

    const product = await Product.create({
      name,
      description,
      category,
      price: parseFloat(price),
      rating: rating ? parseFloat(rating) : 0,
      imageUrl,
      userId
    });

    // Immediately refetch the product to ensure all fields are populated
    const populatedProduct = await Product.findById(product._id)
      .populate('userId', 'name email')
      .exec();

    console.log('Created product with data:', populatedProduct);

    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Get all products with filtering, sorting, and pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      minRating,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      userId
    } = req.query;

    // Build filter conditions
    const filter = {};
    
    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by userId if provided (for dashboard)
    if (userId) {
      filter.userId = userId;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);

    // Create sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get products
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .exec();

    res.status(200).json({
      products,
      pagination: {
        total: totalProducts,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalProducts / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(id)
      .populate('userId', 'name email')
      .exec();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, rating, imageUrl: imageUrlFromBody } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership or admin role
    if (existingProduct.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Create update data
    const updateData = {
      name,
      description,
      category,
      price: price ? parseFloat(price) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
    };

    // Add image URL if file was uploaded or provided in body
    if (req.file) {
      // Use only the Cloudinary URL directly
      updateData.imageUrl = req.file.path;
      console.log('Updating product with Cloudinary image URL from file:', updateData.imageUrl);
    } else if (imageUrlFromBody) {
      // Use imageUrl from request body if no file was uploaded but URL was provided
      updateData.imageUrl = imageUrlFromBody;
      console.log('Updating product with Cloudinary image URL from body:', updateData.imageUrl);
    }

    // Log the complete update data
    console.log('Update data before applying:', updateData);

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email').exec();

    console.log('Updated product result:', product);
    res.status(200).json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if product exists and belongs to user
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership or admin role
    if (product.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
}; 