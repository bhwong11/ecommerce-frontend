import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const CREATE_CATEGORY = gql`
  mutation createCategory($name:String!) {
    createCategory(name:$name) {
      _id,
      name
    }
  }
  `

const CreateCategory:React.FC =()=>{
    const navigate = useNavigate();
    const [categoryName,setCategoryName] = useState<string>('')
    const [success,setSuccess] = useState<string>('')
    const [error,setError] = useState<string>('')
    const [createCategoryMutation, { data:createCategoryUserMutation, loading:createCategoryUserLoadingMutation, error:createCategoryUserErrorMutation }] = useMutation(CREATE_CATEGORY,{
      onCompleted({category}){
        console.log(category)
      }})
    const onSubmit=async (e:React.SyntheticEvent)=>{
        setSuccess('')
        setError('')
        e.preventDefault();
        try{
          await createCategoryMutation({ variables: { name:categoryName} })
          setSuccess('successfully created category')
          setCategoryName('')
        }catch(err){
          setError('500 server error, try again later')
          setCategoryName('')
        }
    }
    return(
        <div className="flex flex-col items-center text-stone-200">
            <div className="text-lime-400">{success}</div>
            <div className="text-red-400">{error}</div>
            <div className="text-2xl text-stone-200 mb-2">Create Category</div>
            <form className="border-2 border-stone-200 rounded p-4" onSubmit={onSubmit}>
              <label>
                <div className="flex justify-center">Category Name:</div>
                <input className="rounded text-stone-800" value={categoryName} onChange={(e)=>setCategoryName(e.target.value)}/>
              </label>
              <div className="flex justify-center">
                <button className="border-2 border-stone-200 bg-stone-200 rounded text-slate-600 p-2 m-2 hover:border-stone-200 hover:text-stone-200 hover:bg-slate-600  transition:ease-in-out">create</button>
              </div>
            </form>
        </div>
    )
}

export default CreateCategory;