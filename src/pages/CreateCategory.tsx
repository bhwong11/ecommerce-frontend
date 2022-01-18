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
        <div>
            {success}
            {error}
            <div>Create Category</div>
            <form onSubmit={onSubmit}>
                <input value={categoryName} onChange={(e)=>setCategoryName(e.target.value)}/>
                <button>create</button>
            </form>
        </div>
    )
}

export default CreateCategory;