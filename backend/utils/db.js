const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URL:', process.env.DATABASE_URL.replace(/(mongodb\+srv:\/\/)([^:]+):([^@]+)@/, '$1****:****@'));

    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority',
      family: 4,
      autoIndex: true,
      maxIdleTimeMS: 60000,
      heartbeatFrequencyMS: 10000
    });
    
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log('Database Name:', conn.connection.name);
    console.log('Connection State:', conn.connection.readyState);
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
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', {
    message: err.message,
    code: err.code,
    name: err.name
  });
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