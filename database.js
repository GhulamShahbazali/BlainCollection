const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    const conect =await  mongoose.connect("mongodb+srv://shahbazamanat93:chand12345@cluster0.icyzsis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/BralinCollection");
    console.log("connection successfully ");
  } catch (error) {
    console.log(error);
    console.log("connection failed " +error);
    process.exit(1);
  }
};

module.exports=connectionDB ;