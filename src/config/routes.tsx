import React from 'react';
import {Routes,BrowserRouter,Route,Link} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import {logout} from '../actions/auth';
import { PURGE } from 'redux-persist';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Category from '../pages/Category';
import Product from '../pages/Product';
import Cart from '../pages/Cart';
import ErrorPage404 from '../pages/ErrorPage404';

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
                <Link to="/cart" >cart</Link>
                <Link to="/login" onClick={logoutHandler}>Loggout</Link>
            </nav>:
            <nav className="navbar">
                <Link to="/login">login</Link>
                <Link to="/register">register</Link>
            </nav>}
            <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
                    <Route path='category/:categoryId' element={<Category/>}/>
                    <Route path='product/:productId' element={<Product/>}/>
                    <Route path='cart' element={<Cart/>}/>
                    <Route path="*" element={<ErrorPage404/>}/>
            </Routes>
        </BrowserRouter>
    )

}

export default RoutesNav;