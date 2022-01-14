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
    const [createCategoryMutation, { data:createCategoryUserMutation, loading:createCategoryUserLoadingMutation, error:createCategoryUserErrorMutation }] = useMutation(CREATE_CATEGORY,{
      onCompleted({category}){
        console.log(category)
      }})
    const onSubmit=(e:any)=>{
        e.preventDefault();
        createCategoryMutation({ variables: { name:categoryName} })
    }
    return(
        <div>
            <div>Create Category</div>
            <form onSubmit={onSubmit}>
                <input value={categoryName} onChange={(e)=>setCategoryName(e.target.value)}/>
                <button>create</button>
            </form>
        </div>
    )
}

export default CreateCategory;