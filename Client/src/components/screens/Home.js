import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../App';
import {Link} from 'react-router-dom'
const Home=()=>{
    const [data,setdata]=useState([]);
    const {state,dispatch}=useContext(UserContext);
    useEffect(()=>{
         fetch("/myfollowing",{
             headers:{
                 "Authorization":"Bearer "+localStorage.getItem("jwt")
             }
         })
         .then((res)=>res.json())
         .then((res)=>{
             //console.log(res);
             setdata(res.posts);
         })
    },[])
    
    //like post functionality
    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then((result)=>{
           // console.log("data",data);
           // console.log("result",result);
          const newdata=data.map(item=>{
               if(item._id===result._id){
                   return result
               }else{
                   return item
               }
           })
            setdata(newdata)
        }).catch(err=>{console.log(err)})
    }
    //unlike post funcionality
    const unlikePost = (id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then((result)=>{
           const newdata=data.map(item=>{
               if(item._id===result._id){
                   return result
               }else{
                   return item
               }
           })
           setdata(newdata)
        }).catch(err=>{console.log(err)})
    }
// make comment functionality
    const makeComment=(text,postId)=>{
        fetch("/comment",{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                text,
                postId
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            //console.log(result);
        const newdata=data.map(item=>{
               if(item._id===result._id){
                   return result
               }else{
                   return item
               }
           })
           setdata(newdata)
        }).catch(err=>{console.log(err)})
    }
// delete post functionality
const deletePost=(postId)=>{
    fetch(`/deletepost/${postId}`,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem('jwt')
        }
    })
    .then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newdata= data.filter(item=>{
            return item._id!=result._id
        })
        setdata(newdata)
    })
}
    return (
        <div className="home">
            {
                data.map((item)=>{
                    return(
                       <div className="card home-card" key={item._id}>
                <h5 style={{padding:"6px"}}><Link to={item.postedBy._id !==state._id? `/profile/${item.postedBy._id}`:`/profile`}>{item.postedBy.name}</Link>
                {item.postedBy._id===state._id && 
                  <i onClick={()=>deletePost(item._id)} className="material-icons" style={{float:"right"}}>delete</i>  }
                </h5>
                <div className="card-image">
                    <img src={item.photo} alt="" />
                </div>
                <div className="card-content">
                    <div style={{
                        display:"flex",
                        justifyContent:'space-between',
                        alignItems:'center'
                    }}>
                         {/* <i className="material-icons small" on style={{color:"red"}}>favorite</i> */}
                         {
                             item.likes.includes(state._id)?(
                                 <i style={{color:"blue"}} className="material-icons small"
                            onClick={()=>unlikePost(item._id)} >thumb_down</i>
                             ):(
                                 <i style={{color:"blue"}}
                         className="material-icons small"
                         onClick={()=>likePost(item._id)} >thumb_up</i>
                             )
                         }
                    <h6>{item.likes.length} likes</h6>
                    </div>
                    <h6>{item.title}</h6>
                    <p>{item.body}</p>
                    {
                        item.comments.map((comment)=>{
                            return(
                                <p key={comment._id}><strong>{comment.postedBy.name}: </strong>
                                {comment.text}
                                </p>
                            )
                        })
                    }
                    <form 
                    style={{
                        display:'flex',
                    }}
                    onSubmit={(e)=>{
                        e.preventDefault();
                        makeComment(e.target[0].value,item._id);
                        e.target[0].value="";
                    }}>
                        <input type="text" placeholder="Add a comment" />
                        <button className="post_button" type="submit">
                            post
                        </button>
                    </form>
                    
                </div>
            </div>
                    )
                })
            }  
        </div>
    )
}

export default Home;