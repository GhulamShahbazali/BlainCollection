const  mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({

    userName:{type:String,required:true},
    userPhone:{type:String,required:false},
    userAddress:{type:String,required:false},
    userEmail:{type:String,required:true},
    userPassword:{type:String,required:true},
    userImage:{type:String,required:true},

});

userSchema.pre('save',async function (next) {
    const user =this;
    if(!user.isModified('userPassword')){
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        user.userPassword = await bcrypt.hash(user.userPassword,salt);
        next();
    } catch (error) {
        next(err);
    }
    
});

const userModel = mongoose.model('user',userSchema);
module.exports=userModel;