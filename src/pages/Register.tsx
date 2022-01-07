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
    const [error,setError]=useState<any>(null)
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
            await registerMutation({ variables: { username,email,password} })
            if(!registerUserErrorMutation && !error){
                navigate('/login');
            }
        }catch(err:any){
            setError(err.toString())
        }
        
    }

    return(
        <div>
            {error?<div>Error {error}</div>:<></>}
            <form  onSubmit={onRegister}>
                <label>
                    username:
                    <input type="text" value={username} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setUsername(e.target.value)}/>
                </label>
                <label>
                    email:
                    <input type="email" value={email} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)}/>
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

export default Register;
