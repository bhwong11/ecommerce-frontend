import {
    REGISTER_SUCCESS,
    LOGIN_SUCCESS,
    LOGOUT,
  } from "../actions/types";
  
  //const user:any = JSON.parse(localStorage.getItem("user") || '{}');
  //const initialState = (user && Object.keys(user).length)
  //  ? { isLoggedIn: true, user }
  //  : { isLoggedIn: false, user: null };

  const initialState = { isLoggedIn: false, user: null };
  
  export default function (state:object = initialState, action:any) {
    const { type, payload } = action;
  
    switch (type) {
      case REGISTER_SUCCESS:
        return {
          ...state,
          isLoggedIn: false,
        };
      case LOGIN_SUCCESS:{
        return {
          ...state,
          isLoggedIn: true,
          user: payload.user,
        }
      };
      case LOGOUT:
        return {
          ...state,
          isLoggedIn: false,
          user: null,
        };
      default:
        return {
          ...state,
        };
    }
  }
  