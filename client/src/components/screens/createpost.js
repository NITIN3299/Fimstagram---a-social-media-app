import React,{useState,useEffect} from 'react';
import M from 'materialize-css';
import {useHistory} from 'react-router-dom';
const CreatePost = ()=>{
    const history=useHistory();
    const [title,settitle] = useState("");
    const [body,setbody] = useState("");
    const [image,setimage]=useState("");
    const [pic,setpic]=useState("");


    const Postdetails=()=>{
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
    // we used use effect kyuki server side pe request tabhi honi chiye tb picstate set ho jaye
    // us se phle ho gya to error aajyga
    useEffect(()=>{
       if(pic){
            fetch("/createpost",{
             method:"post",
             headers:{
                 "Content-Type":"application/json",
                 "Authorization":"Bearer "+localStorage.getItem('jwt')
             },
             body:JSON.stringify({
                 title,
                 body,
                 pic
             })
         })
           .then((res)=>res.json())
           .then((data)=>{
               if(data.error){
                   M.toast({html:data.error,classes:"#921616 red darken-3"})
               }else{
                   M.toast({html:"New post create successfully",classes:"#368039 green darken-1"})
                   history.push("/");
               }
           })
       }
    },[pic])
    return (
        <div className="card input-field" style={{
            maxWidth:"500px",
            margin:"100px auto",
            padding:"20px",
            textAlign:"center",
        }}>
            <input type="text" placeholder="title" value={title} onChange={(e)=>settitle(e.target.value)} />
            <input type="text" placeholder='body' value={body} onChange={(e)=>setbody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn #0a6ab6 blue">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=>setimage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input type="text" className="file-path validate" />
                </div>
            </div>
            <button onClick={()=>Postdetails()} className="btn waves-effec waves-light #0a6ab6 blue"> 
                  Submit Post   
            </button>
        </div>
    )
}

export default CreatePost;