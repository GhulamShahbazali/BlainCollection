const express = require('express');
const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const newImage=require('../MiddleWare/uploadImageMiddleWare');
const  router = require('express').Router()


router.post('/regestierNewUser', newImage.single('userImage'), async (req, res) => {
  const { userName, userPhone, userAddress, userEmail, userPassword } = req.body;

  const imagePath = req.file ? req.file.path : "";

  let user = await User.findOne({ userEmail });
  if (user) {
    return res.status(403).json({ message: "user already exists", email: "This " + userEmail });
  } else {
    user = new User({
      userName,
      userPhone,
      userAddress,
      userEmail,
      userPassword,
      userImage: imagePath, // ✅ Cloudinary URL
    });
    await user.save();

    return res.status(200).json({
      message: "User successfully added",
      response: await User.find(),
    });
  }
});



router.get('/another-route' , (req , res)=>{
    // router code here
})

module.exports  = router