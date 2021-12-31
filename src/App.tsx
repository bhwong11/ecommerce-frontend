import React,{useState,useEffect} from 'react';
import './App.css';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

import Products from './pages/Products';
import { useDispatch, useSelector } from "react-redux";
import { login } from "./actions/auth";


const GET_REVIEWS = gql`
  query{
    reviews{
      title,
      _id,
      product{
        title
      },
      user{
        username
      }
    }
  }`;

  const LOGIN = gql`
  mutation loginUser($username:String!, $password:String!) {
    loginUser(username:$username, password:$password) {
      _id,
      username,
    }
  }
  `

function App() {
  const [reviews,setReviews] = useState<any>(null)
  const [username,setUsername] = useState<any>(null)
  const [password,setPassword] = useState<any>(null)
  const {user:currentUser, isLoggedIn:isLoggedIn} = useSelector((state: any)=>state.auth)
  const dispatch = useDispatch();
  const [loginMutation, { data:loginUserMutation, loading:loginUserLoadingMutation, error:loginUserErrorMutation }] = useMutation(LOGIN,{
    onCompleted({loginUser}){
      console.log(loginUser)
        dispatch(login(loginUser))
    }})
  const handleLogin = async (e:any)=>{
    e.preventDefault()
    loginMutation({ variables: { username,password} })
    }

  const {loading,data} = useQuery<any>(GET_REVIEWS,{
    onCompleted({reviews}){
        setReviews(reviews);
    }})
  console.log(data)

  
  return (
    <>
    {currentUser?<>{currentUser.username}</>:<>no username</>}
    {data?<div>{data.reviews[0].title}</div>:<div>loading</div>}
    {reviews?<>{reviews[0].user.username}</>:<>None</>}
    <div>
      hello world
    </div>
    <Products/>
    <form onSubmit={handleLogin}>
      <input value = {username} onChange={e=>setUsername(e.target.value)}/>
      <input value = {password} onChange={e=>setPassword(e.target.value)}/>
      <button>login</button>
    </form>
    </>
  );
}

export default App;
