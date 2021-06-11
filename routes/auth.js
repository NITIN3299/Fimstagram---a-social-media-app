const express =require('express');
const router = express.Router();
const crypto = require('crypto')
const mongoose = require('mongoose');
const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {jwt_secret}=require('../config/keys');
const requiredLogin = require('../middlewares/requiredLogin');
const nodemailer= require('nodemailer');
const {email_pass,email_id,EMAIL} = require('../config/keys')
//const sendinblueTransport = require('nodemailer-sendinblue-transport')

//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



let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: email_id,
        pass: email_pass
    }
});

router.get('/',(req,res)=>{
    res.send("hello")
})

//signup
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body;
    if(!email || !password || !name){
        return res.status(422).send({error:"please enter all fields"});
    }
    User.findOne({email:email})
        .then((saveduser)=>{
            if(saveduser){
                return res.status(422).send({error:"email already registered with some account"});
            }
            bcrypt.hash(password,12)
             .then((hashedpass)=>{
                  const user = new User({
                email,
                password:hashedpass,
                name,
                pic
            })
            user.save()
             .then((user)=>{
                 transporter.sendMail({
                     from:"no-reply@insta.com",
                     to:user.email,
                     subject:"signup success",
                     text: "Welcome to instagram"
                 },(err,info)=>{
                     if(err){
                         return console.log(err.message);
                     }
                      console.log('successfully sent mail');
                 })
                 res.json({message:`${user.name} saved successfully`})
             })
             .catch(err=>console.log(err))
         })
            
        })
        .catch((err)=>{
            console.log(err);
        })
})

//sign in route
router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(422).send({error:"please add both fields!"})
    }
    User.findOne({email:email})
       .then((saveduser)=>{
           if(!saveduser){
               return res.status(422).send({error:"Please enter correct email and password"});
           }
           bcrypt.compare(password,saveduser.password)
                .then((domatch)=>{
                    if(domatch){
                       // res.status(200).send({message:"successfully signed in"})
                       const token = jwt.sign({_id:saveduser._id},jwt_secret)
                       const {_id,name,email,followers,following,pic} = saveduser;
                       res.status(200).send({token:token,user:{_id,name,email,followers,following,pic}});
                    }
                    else{
                        return res.status(422).send({error:"Invalid Email or Password"});
                    }
                })
                .catch((err)=>console.log(err))
       })
})

//reset password
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token=buffer.toString('hex') // buffer ko hex se string  me kr diya
        User.findOne({email:req.body.email})
         .then(user=>{
             if(!user){
                 return res.status(422).json({error:"User dont exists with this email"})
             }
             user.resetToken = token;
             user.expireToken = Date.now() + 3600000
             user.save()
                 .then((result)=>{
                     transporter.sendMail({
                         to:user.email,
                         from:"no-reply@insta.com",
                         subject:"Password reset",
                         html:`
                           <p>You requested for password reset </p>
                           <h5>click on this <a href="${EMAIL}/reset/${token}">link</a> to reset your password
                         `
                     })
                     res.send({message:"Check your email"})
                 })
         })
    })
})

// new-password
router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password;
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
         .then(user=>{
             if(!user){
                 return res.status(422).json({error:"Try again session expired"})
             }
             bcrypt.hash(newPassword,12)
                   .then(hashedpass=>{
                       user.password=hashedpass
                       user.resetToken=undefined
                       user.expireToken=undefined
                       user.save()
                           .then((saveduser)=>{
                               res.json({message:"password updated successfully"})
                           })
                   })
         }).catch(err=>console.log(err))
})

module.exports = router;