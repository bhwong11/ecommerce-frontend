import {
    REGISTER_SUCCESS,
    LOGIN_SUCCESS,
    LOGOUT,
  } from "./types";
  
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

  const REGISTER = gql`
  mutation registerUser($username:String!,$email:String!, $password:String!) {
    registerUser(username:$username,email:$email, password:$password) {
      _id,
      cart,
      username,
      email
    }
  }
  `

  const LOGIN = gql`
  mutation loginUser($username:String!, $password:String!) {
    loginUser(username:$username, password:$password) {
      _id,
      cart,
      username,
      email
    }
  }
  `
  
  export const register = (user:string) => (dispatch:any) => {
    dispatch({
          type: REGISTER_SUCCESS,
        });
  };
  
  export const login = (loginUser:any) => (dispatch:any) => {
    console.log('LOGIN ACTION HIT')
    console.log('loginUser',loginUser)
    localStorage.setItem('uid',loginUser.token)
    dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: loginUser },
        });
    return loginUser
  };
  
  export const logout = () => (dispatch:any) => {
    console.log('LOGOUT!!!')
    localStorage.removeItem("uid");
    localStorage.removeItem("persist:user");
  
    dispatch({
      type: LOGOUT,
    });
  };