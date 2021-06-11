import React,{useContext,useRef,useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom'
import { UserContext } from '../App';
import M from 'materialize-css';
const Navbar = ()=>{
    const searchModal = useRef(null)
    const history=useHistory();
    const [search,setsearch]=useState('');
    const [userdetails,setuserdetails]=useState([]);
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])
    const renderList = ()=>{
        if(state){
            return ([
                <li key="0"><i data-target="modal1" className="material-icons  modal-trigger" style={{color:"black"}}>search</i></li>,
                <li key="1"><Link to="/explore" >Explore</Link></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/createpost">Create Post</Link></li>,
                <li key="4"><button className="btn #c62828 red darken-3"
                      onClick={()=>{
                          localStorage.clear()
                          dispatch({type:"CLEAR"})
                          history.push("/signin")
                      }}
                      >
                          LogOut
                      </button></li>
            ])
        }else{
            return ([
                <li key="5"><Link to="/signin">SignIn</Link></li>,
                <li key="6"><Link to="/signup">SignUp</Link></li>
            ])
        }
    }
    const fetchusers = (query)=>{
        setsearch(query)
        fetch('/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(results=>{
           // console.log(results);
            setuserdetails(results.user)
        })
    }
    return (
        <nav>
       <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} className="brand-logo">
          <img className="app_headerImage"
       src="https://1000logos.net/wp-content/uploads/2017/02/ig-logo.png" alt=""/>
      </Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        {renderList()}
      </ul>
    </div>
    <div id="modal1" className="modal" style={{color:'black'}} ref={searchModal}>
    <div className="modal-content">
      <input 
         type="text"
         placeholder="search user" 
         value={search}
         onChange={(e)=>fetchusers(e.target.value)}
         />
         <ul className="collection" style={{color:'black'}}>
           {
               userdetails.map((item)=>{
                return (
                    <Link to={item._id!==state._id?`/profile/${item._id}`:`/profile`} onClick={()=>{
                        M.Modal.getInstance(searchModal.current).close()
                        setsearch('');
                        setuserdetails([]);
                    }}>
                       <li className="collection-item">{item.email}</li>
                    </Link>
                )
           })
           }
        </ul>
    </div>
    <div className="modal-footer">
      <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>setsearch('')} >Close</button>
    </div>
  </div>
  </nav>
    )
}

export default Navbar;