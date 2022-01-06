import React from 'react';
import {Routes,BrowserRouter,Route,Link} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import {logout} from '../actions/auth';

function RoutesNav(){
    const {user:currentUser, isLoggedIn:isLoggedIn} = useSelector((state: any)=>state.auth)
    const dispatch = useDispatch();
    const logoutHandler = ()=>{
        dispatch(logout)
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
        </BrowserRouter>
    )

}

export default RoutesNav;