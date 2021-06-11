const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {connection_url} = require('./config/keys'); 
const port = process.env.PORT || 8080;
const User = require('./models/usermodel');
const Post = require('./models/postmodel');
const app=express();

mongoose
   .connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
   })
   .catch((err)=>console.log(err))
   .then(()=>console.log('mongoDB connected to server...'))

app.use(express.json());
app.use(cors());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));


if(process.env.NODE_ENV=="production"){   // if we are on the production side
   app.use(express.static('client/build'))   // first we want to serve our build
   const path=require('path')
   app.get("*",(req,res)=>{
      res.sendFile(path.resolve(__dirname,'client','build','index.html'))
   })
}
app.listen(port,()=>console.log(`listening on localhost ${port}`));