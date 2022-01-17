import React from 'react';
import {Routes,Navigate,BrowserRouter,Route,Link} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import {logout} from '../actions/auth';
import { PURGE } from 'redux-persist';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Category from '../pages/Category';
import CreateCategory from '../pages/CreateCategory';
import EditCategory from '../pages/EditCategory';
import Product from '../pages/Product';
import CreateProduct from '../pages/CreateProduct';
import EditProduct from '../pages/EditProduct';
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

    function RequireAuth({ children, redirectTo }:any) {
        let isAuthenticated = currentUser;
        return isAuthenticated ? children : <Navigate to={redirectTo} />;
    }

    function RequireAuthAdmin({ children, redirectTo }:any) {
        let isAuthenticated = currentUser?currentUser.admin:false;
        return isAuthenticated ? children : <Navigate to={redirectTo} />;
    }

    return (
        <BrowserRouter>
            {isLoggedIn?
            <nav className="navbar">
                <span>{currentUser.username}</span>
                <Link to="/cart" >cart</Link>
                <Link to="/" >Home</Link>
                <Link to="/login" onClick={logoutHandler}>Loggout</Link>
            </nav>:
            <nav className="navbar">
                <Link to="/login">login</Link>
                <Link to="/register">register</Link>
            </nav>}
            <Routes>
                    <Route path='/' element={
                    <RequireAuth redirectTo="/login">
                        <Home/>
                    </RequireAuth>
                    }/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
                    <Route path='category/create' element={
                    <RequireAuthAdmin redirectTo="/">
                        <CreateCategory/>
                    </RequireAuthAdmin>
                    }/>
                    <Route path='category/:categoryId' element={
                    <RequireAuth redirectTo="/login">
                        <Category/>
                    </RequireAuth>
                    }/>
                    <Route path='category/:categoryId/edit' element={
                    <RequireAuthAdmin redirectTo="/">
                        <EditCategory/>
                    </RequireAuthAdmin>
                    }/>
                    <Route path='product/create' element={
                    <RequireAuthAdmin redirectTo="/">
                        <CreateProduct/>
                    </RequireAuthAdmin>
                    }/>
                    <Route path='product/:productId' element={
                    <RequireAuth redirectTo="/login">
                        <Product/>
                    </RequireAuth>
                    }/>
                    <Route path='product/:productId/edit' element={
                    <RequireAuthAdmin redirectTo="/">
                        <EditProduct/>
                    </RequireAuthAdmin>
                    }/>
                    <Route path='cart' element={
                    <RequireAuth redirectTo="/login">
                        <Cart/>
                    </RequireAuth>
                    }/>
                    <Route path="*" element={<ErrorPage404/>}/>
            </Routes>
        </BrowserRouter>
    )

}

export default RoutesNav;