import React,{useState,useContext} from 'react';
import {Link,useHistory,useParams} from 'react-router-dom';

import M from 'materialize-css';
const NewPassword=()=>{ 
    const [password,setpassword]=useState("");
    const history = useHistory();
    const {token} = useParams();
    //console.log(token);
    const Postdata = ()=>{
        // validation 
        if(!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password)){
            M.toast({html:"Please Enter valid password",classes:"#921616 red darken-4"})
            return;
        }
        //validation end
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then((res)=>res.json())
          .then((data)=>{
              //console.log(data)
              if(data.error){
                  M.toast({html:data.error,classes:"#921616 red darken-4"})
              }else{
                  M.toast({html:data.message,classes:"#368039 green darken-1"})
                  history.push('/signin')
              }
          })
          .catch((err)=>console.log(err));
        }
    return (
       <div className="mycard">
           <div className="card auth-card input-field input">
               <img className="app_headerImage"
                   src="https://1000logos.net/wp-content/uploads/2017/02/ig-logo.png" alt=""/>
                 <input 
                 type="password"
                 placeholder="Enter new password" 
                 value={password}
                 onChange={(e)=>setpassword(e.target.value)}
                 />
                 <button onClick={()=>Postdata()} className="btn waves-effec waves-light #0a6ab6 blue"> 
                     Submit
                 </button>
           </div>
       </div>
    )
}

export default NewPassword;