import React,{useEffect,useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/auth";
import { useNavigate } from 'react-router-dom';
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const LOGIN = gql`
  mutation loginUser($username:String!, $password:String!) {
    loginUser(username:$username, password:$password) {
      _id,
      username,
      cart,
      admin,
      token
    }
  }
  `

const Login:React.FC=()=>{
    const [username,setUsername] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [error,setError] = useState<string>("")
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginMutation, { data:loginUserMutation, loading:loginUserLoadingMutation, error:loginUserErrorMutation }] = useMutation(LOGIN,{
      onCompleted({loginUser}){
          if(loginUser._id!=='none'){
            dispatch(login(loginUser))
          }else{
            setError('invalid login')
          }
      }})
    const onLogin=async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError('')
        try{
          const loginData = await loginMutation({ variables: { username,password} })
          if(!loginUserErrorMutation && error===''){
                if(loginData.data.loginUser._id!=='none'){
                  navigate('/');
                }
            }
        }catch(err:any){
          setError('500 error with login, try again later')
        }
        

    }

    return(
        <div>
            {error?<div>Error {error}</div>:<></>}
            <form  onSubmit={onLogin}>
                <label>
                    username:
                    <input type="text" value={username} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setUsername(e.target.value)}/>
                </label>
                <label>
                    password:
                    <input type="password" value={password} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}/>
                </label>
                <button>login</button>
            </form>
        </div>
    )
}

export default Login;
