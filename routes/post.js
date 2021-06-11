const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requiredLogin');
const Post = require('../models/postmodel');

//createpost route
router.post('/createpost',requiredLogin,(req,res)=>{
    const {title,body,pic}=req.body;
    if(!title || !body || !pic){
        return res.status(422).send({error:"Please enter all fields"});
    }
    //console.log(req.user);
    //res.send('ok')
    req.user.password=undefined;
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save()
       .then((result)=>{
           res.send({post:result})
       })
       .catch((err)=>console.log(err))
})

//all posts route
router.get('/allposts',requiredLogin,(req,res)=>{
    Post.find()
     .populate('postedBy',"_id name")
     .populate('comments.postedBy',"_id name")
     .sort('-createdAt')
     .then((posts)=>{
         res.send({posts:posts})
     })
     .catch((err)=>console.log(err));
})

//my following posts
router.get('/myfollowing',requiredLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
     .populate('postedBy',"_id name")
     .populate('comments.postedBy',"_id name")
     .sort('-createdAt')
     .then((posts)=>{
         res.send({posts:posts})
     })
     .catch((err)=>console.log(err));
})

//my posts route (for profile page)
router.get('/myposts',requiredLogin,(req,res)=>{
     Post.find({postedBy:req.user._id})
         .populate("postedBy","_id name")
         .then((myposts)=>{
             res.send({myposts})
         })
         .catch((err)=>console.log(err));
})

//like
router.put('/like',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true // taaki new likes dikhaye
    })
    .populate("comments.postedBy","_id name")  // hum bss object id daalte h posted by me but hme naam or id dono chiye to populate krne pdenge
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).send({error:err});
        }else{
            res.send(result);
        }
    })
})

//unlike
router.put('/unlike',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true // taaki new likes dikhaye
    })
    .populate("comments.postedBy","_id name")  // hum bss object id daalte h posted by me but hme naam or id dono chiye to populate krne pdenge
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).send({error:err});
        }else{
            res.status(200).send(result);
        }
    })
})

//comment
router.put('/comment',requiredLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true // taaki new likes dikhaye
    })
    .populate("comments.postedBy","_id name")  // hum bss object id daalte h posted by me but hme naam or id dono chiye to populate krne pdenge
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).send({error:err});
        }else{
            res.send(result);
        }
    })
})

//delete post
router.delete('/deletepost/:postId',requiredLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
        .populate("postedBy","_id")
        .exec((err,post)=>{
            if(err || !post){
                return res.status(422).json({error:err})
            }
            if(post.postedBy._id.toString()===req.user._id.toString()){
                post.remove()
                .then(result=>{
                    res.json(result)
                }).catch(err=>console.log(err))
            }
        })
})
module.exports = router;