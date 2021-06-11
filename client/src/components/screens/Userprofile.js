import React,{useState,useEffect,useContext} from 'react';
import { UserContext } from '../../App';
import {useParams} from 'react-router-dom';
const Profile=()=>{
    const {state,dispatch}=useContext(UserContext);
    const [userprofile,setuserprofile]=useState([])
    //const [showfollow,setshowfollow]=useState(true);
    const {userid} = useParams();
    //console.log(userid);
     useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then((res)=>res.json())
        .then((res)=>{
           // console.log(res)
           setuserprofile(res)
        })
        .catch((err)=>console.log(err))
    },[])
    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                Authorization:"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
               followId:userid
            })
        })
        .then(res=>res.json())
        .then(data=>{
           // console.log(data);
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setuserprofile((prevstate)=>{  // callback function se userprofile k user object ko update kr diya
                return {
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:[...prevstate.user.followers,data._id]  //data me logged in user ka data aa rha h
                    }
                }
            })
           // setshowfollow(false);
        })
        .catch(err=>console.log(err))
    }
    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                Authorization:"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
               unfollowId:userid
            })
        })
        .then(res=>res.json())
        .then(data=>{
           // console.log(data);
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setuserprofile((prevstate)=>{  // callback function se userprofile k user object ko update kr diya
                const newlist=prevstate.user.followers.filter(item=>item!=data._id)
                return {
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:newlist  
                    }
                }
            })
           // setshowfollow(true);
        })
        .catch(err=>console.log(err))
    }
    return (
        <> 
        {userprofile.user? 
        <div style={{maxWidth:"550px",margin:"10px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                         src={userprofile.user?userprofile.user.pic:"loading..."}
                         />
                </div>
                <div>
                    <h4>{userprofile.user.name}</h4>
                    <h5>{userprofile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{userprofile.posts.length} posts</h6>
                        <h6>{userprofile.user.followers.length} followers</h6>
                        <h6>{userprofile.user.following.length} followings</h6>
                    </div>
                   {
                       userprofile.user.followers.includes(state._id)?(
                           <button onClick={()=>unfollowUser()} className="btn waves-effec waves-light #00a042 green accent-4 follow_button"> 
                             UnFollow
                           </button>
                       ):(
                             <button  onClick={()=>followUser()} className="btn waves-effec waves-light #00a042 green accent-4 follow_button"> 
                               Follow
                             </button>
                       )
                   }
                </div>
            </div>
            <div className="gallery">
                {
                    userprofile.posts.map((item)=>{
                        return(
                           <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>:
        <h2>Loading....</h2>
    }
        </>
        
    )
}

export default Profile;