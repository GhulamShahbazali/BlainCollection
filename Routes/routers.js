const express = require('express');
const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const newImage=require('../MiddleWare/uploadImageMiddleWare');
const  router = require('express').Router()


router.post('/regestierNewUser' ,newImage.single('userImage'),async (req , res)=>{
    
    const  {userName,userPhone,userAddress,userEmail,userPassword}=req.body;

    const imagePath = req.file ? `http://localhost:9000/uploadImages/${req.file.filename}` : "";

    let user = await User.findOne({ userEmail });
    if(user){
        return res.status(403).json({message:"user already exist",email:"this "+userEmail})
    }else{
        user = new User({userName,userPhone,userAddress,userEmail,userPassword,userImage:imagePath});
        await user.save();
        
        return res.status(200).json({message:"user sucessfully added",response:await User.find()});

    }

})


router.get('/another-route' , (req , res)=>{
    // router code here
})

module.exports  = router