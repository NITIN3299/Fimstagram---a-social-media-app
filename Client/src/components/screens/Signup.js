import React,{useEffect, useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
// import axios from '../../axios';
const SignUp=()=>{
    const [name,setname]=useState("");
    const [password,setpassword]=useState("");
    const [email,setemail]=useState("");
    const [image,setimage]=useState("");
    const [pic,setpic]=useState(undefined);
    const history = useHistory();

    const UploadPic=()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","dpbpidrgl")
        fetch("https://api.cloudinary.com/v1_1/dpbpidrgl/image/upload",{
            method:"post",
            body:data 
        })
         .then((res)=>res.json())
         .then((data)=>{
             setpic(data.url)
         })
         .catch(err=>console.log(err)) 
    }
    const Uploadfields=()=>{
         // validation 
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html:"Invalid email",classes:"#921616 red darken-4"})
            return;
        }
        if(!/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/.test(name)){
            M.toast({html:"Invalid Username",classes:"#921616 red darken-4"})
            return;
        }
        if(!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password)){
            M.toast({html:"Please Enter valid password",classes:"#921616 red darken-4"})
            return;
        }
        //validation end
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic
            })
        }).then((res)=>res.json())
          .then((data)=>{
              if(data.error){
                  M.toast({html:data.error,classes:"#921616 red darken-4"})
              }else{
                  M.toast({html:data.message,classes:"#368039 green darken-1"})
                  history.push('/signin')
              }
          })
          .catch((err)=>console.log(err));
          // if u want to post using axios 
        // axios.post("/signup",{name,password,email})
        //   .then((data)=>{  // status code 200 means ok h to then me data aayga nhi to catch me error jayga
        //       console.log(data);
        //       if((data && data.data.error)){
        //           M.toast({html:data.data.error,classes:"#921616 red darken-4"})
        //       }else{
        //           M.toast({html:data.data.message,classes:"#368039 green darken-1"})
        //           history.push('/signin')
        //       }
        //   })
        //   .catch((err)=>{
        //       console.log("user already exist",err);
        //        M.toast({html:err,classes:"#921616 red darken-4"})
        //   })
    }
     useEffect(()=>{
        if(pic){
            Uploadfields();
        }
    },[pic])
    
    const Postdata = ()=>{
        if(image){
            UploadPic();
        }else{
            Uploadfields();
        }
    }
    return (
         <div className="mycard">
           <div className="card auth-card input-field input">
               <img className="app_headerImage"
                   src="https://1000logos.net/wp-content/uploads/2017/02/ig-logo.png" alt=""/>
                <input 
                 type="text"
                 placeholder="username" 
                 value={name}
                 onChange={(e)=>setname(e.target.value)}
                 />
               <input 
                 type="text"
                 placeholder="email" 
                 value={email}
                 onChange={(e)=>setemail(e.target.value)}
                 />
                 <input 
                 type="password"
                 value={password}
                 onChange={(e)=>setpassword(e.target.value)}
                 placeholder="password" 
                 />
                  <div className="file-field input-field">
                     <div className="btn #0a6ab6 blue">
                         <span>Upload Image</span>
                         <input type="file" onChange={(e)=>setimage(e.target.files[0])} />
                     </div>
                     <div className="file-path-wrapper">
                         <input type="text" className="file-path validate" />
                     </div>
                 </div>
                 <button onClick={()=>Postdata()} className="btn waves-effec waves-light #0a6ab6 blue"> 
                     SignUp!
                 </button>
                 <h5>
                     <Link to="/signin">Already have an account ?</Link>
                 </h5>
           </div>
       </div>
    )
}

export default SignUp;