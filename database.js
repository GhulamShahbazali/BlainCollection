const mongoose = require("mongoose");

// Optimal connection settings for serverless environments
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Maximum number of sockets in the connection pool
  socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  retryWrites: true,
  w: 'majority'
};

const connectionDB = async () => {
  try {
    // Use environment variable for connection string
    const connectionString = process.env.MONGODB_URI || 
      "mongodb+srv://shahbaz:chand12345@demoshaz.pvi1urc.mongodb.net/BralinCollection?retryWrites=true&w=majority";
    
    const connection = await mongoose.connect(connectionString, connectionOptions);
    
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });
    
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    // In serverless, we might not want to exit the process immediately
    throw error; // Let the serverless function handle it
  }
};

module.exports = connectionDB;