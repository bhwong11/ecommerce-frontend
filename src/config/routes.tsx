import React from 'react';
import {Routes,BrowserRouter,Route,Link} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import {logout} from '../actions/auth';
import { PURGE } from 'redux-persist';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';

function RoutesNav(){
    const {user:currentUser, isLoggedIn:isLoggedIn} = useSelector((state: any)=>state.auth)
    const dispatch = useDispatch();
    const logoutHandler = ()=>{
        dispatch(logout)
        dispatch({ 
                  type: PURGE,
                  key: "user",
                 result: () => null 
              });   
    }

    return (
        <BrowserRouter>
            {isLoggedIn?
            <nav className="navbar">
                <span>{currentUser.username}</span>
                <a href="/login" onClick={logoutHandler}>loggout</a>            
            </nav>:
            <nav className="navbar">
                
                <a href="/login">login</a>
                <a href="/register">register</a>
            </nav>}
            <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
            </Routes>
        </BrowserRouter>
    )

}

export default RoutesNav;