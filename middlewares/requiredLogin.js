const jwt = require('jsonwebtoken');
const {jwt_secret} = require('../config/keys');
const mongoose = require('mongoose');
const User = require('../models/usermodel');

module.exports = (req,res,next) =>{
    const {authorization} = req.headers
    // authorization === Bearer wewdfjvfadafndv
    if(!authorization){
        return res.status(401).json({error:"you must be logged in!"});
    }
    const token = authorization.replace("Bearer ","");
    jwt.verify(token,jwt_secret,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in!"});
        }

        const {_id}=payload
        User.findById(_id).then((userdata)=>{
            req.user=userdata;
            next();
        })
    })
}