import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../../App';
import M from 'materialize-css';
const SignIn=()=>{
    const {state,dispatch} = useContext(UserContext); 
    const [password,setpassword]=useState("");
    const [email,setemail]=useState("");
    const history = useHistory();
    const Postdata = ()=>{
        // validation 
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html:"Invalid email",classes:"#921616 red darken-4"})
            return;
        }
        if(!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password)){
            M.toast({html:"Please Enter valid password",classes:"#921616 red darken-4"})
            return;
        }
        //validation end
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then((res)=>res.json())
          .then((data)=>{
              //console.log(data)
              if(data.error){
                  M.toast({html:data.error,classes:"#921616 red darken-4"})
              }else{
                  localStorage.setItem("jwt",data.token)
                  localStorage.setItem("user",JSON.stringify(data.user));
                  dispatch({type:"USER",payload:data.user})
                  M.toast({html:`${data.user.name} successfully signed in`,classes:"#368039 green darken-1"})
                  history.push('/')
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
                 <input 
                 type="password"
                 placeholder="password" 
                 value={password}
                 onChange={(e)=>setpassword(e.target.value)}
                 />
                 <button onClick={()=>Postdata()} className="btn waves-effec waves-light #0a6ab6 blue"> 
                     SignIn!
                 </button>
                 <h5 className="links-turnblue">
                     <Link to="/signup">Don't have an account ?</Link>
                 </h5>
                 <h6 className="links-oversized">
                     <Link to="/reset">Forgot Password ?</Link>
                 </h6>
           </div>
       </div>
    )
}

export default SignIn;