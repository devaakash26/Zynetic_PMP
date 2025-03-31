const mongoose = require('mongoose');
require('dotenv').config();

// Cache the connection
let cachedConnection = null;

const connectDB = async () => {
  try {
    // Return cached connection if available
    if (cachedConnection) {
      console.log('Using cached MongoDB connection');
      return cachedConnection;
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URL:', process.env.DATABASE_URL.replace(/(mongodb\+srv:\/\/)([^:]+):([^@]+)@/, '$1****:****@'));

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
    
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log('Database Name:', conn.connection.name);
    console.log('Connection State:', conn.connection.readyState);

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

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
  console.log('Connection State:', mongoose.connection.readyState);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  console.log('Connection State:', mongoose.connection.readyState);
  // Clear cached connection on disconnect
  cachedConnection = null;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', {
    message: err.message,
    code: err.code,
    name: err.name
  });
  // Clear cached connection on error
  cachedConnection = null;
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

module.exports = connectDB; 