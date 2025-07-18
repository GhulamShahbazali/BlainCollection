const mongoose = require('mongoose');

const connectionDB = async () => {
  try {
    // Verify MongoDB URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable not set');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Fixed from WS to MS
      socketTimeoutMS: 30000 // Fixed from WS to MS
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

// Close connection on process termination
process.on('SIGINT', async () => { // Fixed from SIGHT to SIGINT
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connectionDB;