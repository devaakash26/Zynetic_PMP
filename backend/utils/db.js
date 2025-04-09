const mongoose = require('mongoose');
require('dotenv').config();

// Cache the connection
let cachedConnection = null;

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }

    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      // Optimized for serverless
      serverSelectionTimeoutMS: 5000, // Reduced from 10000
      socketTimeoutMS: 30000, // Reduced from 45000
      connectTimeoutMS: 5000, // Reduced from 10000
      maxPoolSize: 5, // Reduced from 10
      minPoolSize: 1, // Reduced from 5
      retryWrites: true,
      w: 'majority',
      family: 4,
      autoIndex: false, // Disable auto-indexing in production
      maxIdleTimeMS: 30000, // Reduced from 60000
      heartbeatFrequencyMS: 5000 // Reduced from 10000
    });
    
    console.log(`MongoDB Connected Successfully`);

    // Cache the connection
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error('MongoDB connection error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    
    // Don't exit the process in production
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};


module.exports = connectDB; 