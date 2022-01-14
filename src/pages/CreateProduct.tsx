import React,{useEffect,useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const CREATE_PRODUCT = gql`
  mutation createProduct($title:String!,$price:Int!,$image:String!,$description:String!,$user:ID!,$category:ID!) {
    createProduct(title:$title,price:$price,image:$image,description:$description,user:$user,category:$category) {
      _id,
      title,
      price
    }
  }
  `
const GET_CATEGORIES = gql`
  query{
    categories{
      name,
      _id
    }
  }`;

const CreateProduct:React.FC =()=>{
    const navigate = useNavigate();
    const {user:currentUser} = useSelector((state:any)=>state.auth)
    const [title,setTitle] = useState<string>('')
    const [price,setPrice] = useState<number>(0)
    const [image,setImage] = useState<string>('')
    const [categoryId,setCategoryId] = useState<string>('')
    const [description,setDescription] = useState<string>('')
    const [createProductMutation, { data:createProductUserMutation, loading:createProductUserLoadingMutation, error:createProductUserErrorMutation }] = useMutation(CREATE_PRODUCT,{
      onCompleted({product}){
        console.log(product)
      }})
    const {loading:loadingCategoriesQuery, data:categoriesData} = useQuery(GET_CATEGORIES,{
        onCompleted({categories}){
            console.log(categories)
        }})
    
    const createProductHandler=(e:any)=>{
        e.preventDefault()
        createProductMutation({ variables: { title,price,image,description,user:currentUser._id,category:categoryId} })
    }

    return(
        <div>
            <div>Create Product</div>
            <form onSubmit={createProductHandler}>
            <div>
                <label>
                Title:
                <input value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                Price:
                <input type='text' pattern="[0-9]*" value={price} onChange={(e)=>setPrice(parseInt(e.target.value) || 0)}/>
                </label>
            </div>
            <div>
                <label>
                Image:
                <input value={image} onChange={(e)=>setImage(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                Category:
                <select value={categoryId} onChange={(e)=>setCategoryId(e.target.value)}>
                {console.log('CATEOGRY DATA',categoriesData)}
                {categoriesData?categoriesData.categories.map((category:any)=>{
                    return <option value={category._id}>{category.name}</option>
                }):<></>}            
                </select>
                </label>
            </div>
            <div>
                <label>
                description:
                <input value={description} onChange={(e)=>setDescription(e.target.value)}/>
                </label>
            </div>
            <button>Create Product</button>
            </form>
        </div>
    )
}

export default CreateProduct