const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requiredLogin');
const Post = require('../models/postmodel');
const User = require('../models/usermodel');

// another user profile page
router.get('/user/:id',requiredLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
        .select("-password")
        .then(user=>{
            Post.find({postedBy:req.params.id})
                .populate("postedBy","_id name")
                .exec((err,posts)=>{
                    if(err){
                        return res.status(422).json({error:err})
                    }
                    // console.log(user,posts)
                    res.send({user,posts})
                })
        }).catch(err=>{
            return res.status(404).send({error:"User not found"})
        })
})

//follow route
router.put('/follow',requiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id} // jisko follow krna h uske followers me hmari(log in wale user) id daaldi
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
       User.findByIdAndUpdate(req.user._id,{
           $push:{following:req.body.followId}      // upne following me follow wale ki id daaldi
       },{new:true})
       .select("-password")
       .then(result=>res.send(result))
       .catch((err)=>{
           return res.status(422).json({error:err})
       })
    })
})
//unfollow
router.put('/unfollow',requiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id} // jisko follow krna h uske followers me hmari(log in wale user) id daaldi
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
       User.findByIdAndUpdate(req.user._id,{
           $pull:{following:req.body.unfollowId}
       },{new:true})
       .select("-password")
       .then(result=>res.send(result))
       .catch((err)=>{
           return res.status(422).json({error:err})
       })
    })
})
// update pic
router.put('/updatepic',requiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},
        {new:true},
        (err,result)=>{
        if(err){
            return res.status(422).send({error:"pic cannot changed"})
        } 
         res.json(result)
    })
    
})

//search-user
router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
        .select("_id email")
        .then(user=>{
            res.send({user})
        }).catch(err=>{
            console.log(err);
        })
})
module.exports = router