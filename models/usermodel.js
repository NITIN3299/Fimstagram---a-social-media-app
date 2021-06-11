const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    followers:[{type:ObjectId,ref:"users"}],
    following:[{type:ObjectId,ref:"users"}],
    resetToken:{
        type:String
    },
    expireToken :{
        type:Date
    },
    pic:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW6wRWOjhYe9HP1hvqWiY_x4tDvhbtNcvKUw&usqp=CAU"
    },
    password:{
        type:String,
        required:true
    }
})

module.exports = User = mongoose.model('users',userschema);