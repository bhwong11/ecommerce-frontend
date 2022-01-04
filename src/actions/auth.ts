import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
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
  
  export const register = (username:String, email:String, password:String) => (dispatch:any) => {
    const [registerMutation, { data, loading, error }] = useMutation(REGISTER)
    return registerMutation({ variables: { username,email,password} }).then(
      (data:any) => {
        dispatch({
          type: REGISTER_SUCCESS,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: data.message,
        });
  
        return data;
      },
      (error:any) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: REGISTER_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return error;
      }
    );
  };
  
  export const login = (loginUser:any) => (dispatch:any) => {
    console.log('LOGIN ACTION HIT')
    console.log('loginUser',loginUser)
    dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: loginUser },
        });
    return loginUser
  };
  
  export const logout = () => (dispatch:any) => {
    console.log('LOGOUT!!!')
    localStorage.removeItem("uid");
    localStorage.removeItem("user");
  
    dispatch({
      type: LOGOUT,
    });
  };