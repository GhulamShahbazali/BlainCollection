const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    const conect =await  mongoose.connect("mongodb+srv://shahbaz:chand12345@demoshahbaz.pvi1urc.mongodb.net/BralinCollection");
    console.log("connection successfully ");
  } catch (error) {
    console.log(error);
    console.log("connection failed " +error);
    process.exit(1);
  }
};

module.exports=connectionDB ;