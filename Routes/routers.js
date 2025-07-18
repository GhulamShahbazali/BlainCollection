const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const newImage = require('../MiddleWare/uploadImageMiddleWare');

router.post('/regestierNewUser', newImage.single('userImage'), async (req, res) => {
  try {
    const { userName, userPhone, userAddress, userEmail, userPassword } = req.body;
    const imagePath = req.file ? req.file.path : '';

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(403).json({ message: 'User already exists', email: userEmail });
    }

    const newUser = new User({
      userName,
      userPhone,
      userAddress,
      userEmail,
      userPassword,
      userImage: imagePath,
    });

    await newUser.save();

    return res.status(200).json({
      message: 'User successfully added',
      users: await User.find(),
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
