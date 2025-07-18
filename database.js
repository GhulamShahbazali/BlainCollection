const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://shahbaz:chand12345@demoshahbaz.pvi1urc.mongodb.net/BralinCollection", 
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