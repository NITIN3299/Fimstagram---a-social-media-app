import React,{useState,useEffect,useContext} from 'react';
import { UserContext } from '../../App';
import M from "materialize-css";
const Profile=()=>{
    const {state,dispatch}=useContext(UserContext);
    const [mypics,setmypics]=useState([]);
    const [image,setimage] = useState("");
    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then((res)=>{
            setmypics(res.myposts)
        })
    },[])
    useEffect(()=>{
        if(image){
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
             //console.log(data);
            fetch('/updatepic',{
                method:"put",
                headers:{
                     "Content-Type":"application/json",
                     Authorization:"Bearer "+localStorage.getItem('jwt')
                },
                body:JSON.stringify({
                    pic:data.url
                })
            })
            .then(res=>res.json())
            .then(result=>{
                // console.log(result);
                 localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
                 dispatch({type:"UPDATE_PIC",payload:result.pic})
                 M.toast({html:"DP Changed successfully",classes:"#368039 green darken-1"})
            })
            .catch(err=>console.log(err))
         })
         .catch(err=>console.log(err)) 
        }
    },[image])
    const updatePic = (file)=>{
        setimage(file);
    }
    return (
        <div style={{maxWidth:"550px",margin:"10px auto"}}>
            <div style={{
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                }}>
                    <div>
                    <img className="profile_image"
                         src={state?state.pic:"loading..."}
                         />
                    </div>
                <div>
                    <h4>{state?state.name:'loading...'}</h4>
                    <h5>{state?state.email:"loading..."}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?state.followers.length:"loading..."} followers</h6>
                        <h6>{state?state.following.length:"loading..."} followings</h6>
                    </div>
                </div>
                </div>
               <div className="file-field input-field">
                <div className="btn #0a6ab6 blue">
                    <span>Change</span>
                    <input type="file" onChange={(e)=>updatePic(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input type="text" className="file-path validate" />
                </div>
            </div>
            </div>
           
            <div className="gallery">
                {
                    mypics.map((item)=>{
                        return(
                           <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile;