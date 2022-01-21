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
        <div className="flex justify-center border-2 border-stone-200 rounded-md bg-stone-800 mx-80 p-4">
            {error?<div>Error {error}</div>:<></>}
            <form className="flex flex-col" onSubmit={onLogin}>
                <label>
                <div className="text-stone-200">username:</div>
                    <input className="rounded-md p-1" type="text" value={username} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setUsername(e.target.value)}/>
                </label>
                <label>
                <div className="text-stone-200">password:</div>
                    <input className="rounded-md p-1" type="password" value={password} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}/>
                </label>
                <button className="mt-2 border-2 rounded bg-stone-200 text-slate-600 hover:bg-slate-600 hover:border-stone-200 hover:text-stone-200 transition:ease-in-out">login</button>
            </form>
        </div>
    )
}

export default Login;
