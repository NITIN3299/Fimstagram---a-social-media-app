import './App.css';
import React,{useState,createContext,useReducer, useEffect,useContext} from 'react'
import Navbar from './components/Navbar';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom';
import Home from './components/screens/Home';
import SignIn from './components/screens/Signin';
import SignUp from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/createpost';
import Explore from './components/screens/explore'
import {reducer,initialState} from './reducers/userReducer';
import Userprofile from './components/screens/Userprofile';
import Reset from './components/screens/reset';
import NewPassword from './components/screens/newpassword'
export const UserContext = createContext();

  const Routing = ()=>{
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);
    useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("user"))
      if(user){
        dispatch({type:'USER',payload:user});
      }else{
        if(!history.location.pathname.startsWith('/reset'))
        history.push("/signin");
      }
    },[])
    return (
      <Switch>
       <Route exact path="/"> 
          <Home />
      </Route>
      <Route path='/signup'>
         <SignUp/>
      </Route>
       <Route path='/signin'>
         <SignIn/>
      </Route>
       <Route exact path='/profile'>
         <Profile/>
      </Route>
      <Route path="/createpost">
         <CreatePost/>
      </Route>
      <Route path="/profile/:userid">
         <Userprofile/>
      </Route>
      <Route path="/explore">
         <Explore/>
      </Route>
      <Route exact path="/reset">
         <Reset/>
      </Route>
      <Route path="/reset/:token">
         <NewPassword/>
      </Route>
      </Switch>
    )
  }

function App() {
  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
      <Navbar/>
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
    
    
  );
}

export default App;
