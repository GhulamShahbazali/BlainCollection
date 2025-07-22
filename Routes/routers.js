const express = require('express');
const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const newImage=require('../MiddleWare/uploadImageMiddleWare');
const  router = require('express').Router()


router.post('/registerNewUser', newImage.single('userImage'), async (req, res) => {
  try {
    const { userName, userPhone, userAddress, userEmail, userPassword } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image' });
    }

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    const newUser = new User({
      userName,
      userPhone,
      userAddress,
      userEmail,
      userPassword: hashedPassword,
      userImage: req.file.path 
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.userName,
        email: newUser.userEmail,
        image: newUser.userImage
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: 'Registration failed',
      details: error.message 
    });
  }
});



router.get('/another-route' , (req , res)=>{
    // router code here
})

module.exports  = router