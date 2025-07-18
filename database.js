const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI, 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 30000
      }
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectionDB;