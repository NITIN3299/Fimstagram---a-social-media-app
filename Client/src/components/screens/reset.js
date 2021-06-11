import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../../App';
import M from 'materialize-css';
const Reset=()=>{
    const [email,setemail]=useState("");
    const history = useHistory();
    const Postdata = ()=>{
        // validation 
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html:"Invalid email",classes:"#921616 red darken-4"})
            return;
        }

        fetch("/reset-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email
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
                 type="text"
                 placeholder="email" 
                 value={email}
                 onChange={(e)=>setemail(e.target.value)}
                 />
                 <button onClick={()=>Postdata()} className="btn waves-effec waves-light #0a6ab6 blue"> 
                     Reset Password
                 </button>
           </div>
       </div>
    )
}

export default Reset;