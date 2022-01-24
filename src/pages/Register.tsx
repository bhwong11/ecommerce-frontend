import React,{useEffect,useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/auth";
import { useNavigate } from 'react-router-dom';
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const REGISTER = gql`
  mutation registerUser($username:String!, $email:String!, $password:String!) {
    registerUser(username:$username,email:$email, password:$password) {
      _id,
      username,
    }
  }
  `

const Register:React.FC=()=>{
    const [username,setUsername] = useState<string>("")
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [error,setError]=useState<string>("")
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [registerMutation, { data:registerUserMutation, loading:registerUserLoadingMutation, error:registerUserErrorMutation }] = useMutation(REGISTER,{
      onCompleted({registerUser}){
        console.log(registerUser)
        if(registerUser._id==='none'){
            setError('a user with that username or email already exist')
        }
        dispatch(register(registerUser))
      }
      , errorPolicy: 'all' })
    const onRegister=async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            const registerUser = await registerMutation({ variables: { username,email,password} })
            if(!registerUserErrorMutation && registerUser.data.registerUser._id!=='none'){
                setError('')
                navigate('/login');
            }
        }catch(err:any){
            setError(err.toString())
        }
        
    }

    return(
        <div className="flex justify-center border-2 border-stone-200  bg-stone-800 rounded-md mx-80 p-4">
            {error?<div className="flex-col text-cyan-200">Error {error}</div>:<></>}
            <form className="flex flex-col" onSubmit={onRegister}>
                <label>
                    <div className="text-stone-200">username:</div>
                    <input className="rounded-md p-1" type="text" value={username} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setUsername(e.target.value)}/>
                </label>
                <label>
                    <div className="text-stone-200">email:</div>
                    <input className="rounded-md p-1" type="email" value={email} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)}/>
                </label>
                <label>
                    <div className="text-stone-200">password:</div>
                    <input className="rounded-md p-1" type="password" value={password} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}/>
                </label>
                <button className="mt-2 border-2 rounded bg-stone-200 text-slate-600">Register</button>
            </form>
        </div>
    )
}

export default Register;
