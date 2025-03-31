const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../utils/db');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with retries
const connectWithRetry = async (retries = 3, delay = 3000) => {
  // Check if we're already connected
  if (mongoose.connection.readyState === 1) {
    console.log('Already connected to MongoDB');
    return;
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`MongoDB connection attempt ${i + 1}/${retries}`);
      await connectDB();
      console.log('MongoDB connection successful');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, {
        message: error.message,
        code: error.code,
        name: error.name
      });
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error('Failed to connect to MongoDB after multiple attempts');
};

// Initialize database connection
if (process.env.NODE_ENV === 'production') {
  // In production, connect on first request with timeout
  app.use(async (req, res, next) => {
    try {
      // Set a timeout for the database connection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database connection timeout')), 5000);
      });

      await Promise.race([connectWithRetry(), timeoutPromise]);
      next();
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({
        message: 'Database connection error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
} else {
  // In development, connect immediately
  connectWithRetry().catch(error => {
    console.error('Fatal: Could not connect to MongoDB:', error.message);
    process.exit(1);
  });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://zynetic-aakash.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint for API status checks
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const dbDetails = {
      status: dbStatus,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
    
    res.status(200).json({ 
      status: 'ok',
      database: dbDetails,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Root route with timeout
app.get('/', async (req, res) => {
  try {
    // Set a timeout for the response
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000);
    });

    await Promise.race([connectWithRetry(), timeoutPromise]);
    res.status(200).json({ message: 'Zyntic API is running' });
  } catch (error) {
    console.error('Root route error:', error);
    res.status(500).json({ message: 'API is running but database connection failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
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