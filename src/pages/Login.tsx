import React,{useEffect,useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/auth";
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
    const dispatch = useDispatch();
    const [loginMutation, { data:loginUserMutation, loading:loginUserLoadingMutation, error:loginUserErrorMutation }] = useMutation(LOGIN,{
      onCompleted({loginUser}){
        console.log(loginUser)
          dispatch(login(loginUser))
      }})
    const onLogin=(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        loginMutation({ variables: { username,password} })

    }

    return(
        <div>
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
