const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../utils/db');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => console.log('MongoDB connection established'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://zynetic-aakash.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint for API status checks
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Zyntic API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server if running directly (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless function
module.exports = app; 